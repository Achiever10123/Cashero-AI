const STORAGE_PREFIX = "enc:";
const LEGACY_KEY_NAME = "cashero_vault_key";
const KEY_DATABASE = "cashero_storage";
const KEY_STORE = "keys";
const PERSISTED_KEY_NAME = "vault";
const cache = new Map();
const pendingWrites = new Map();
let databasePromise;
let encryptionKeyPromise;

function toBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function openKeyDatabase() {
  if (databasePromise) return databasePromise;
  if (!window.indexedDB) {
    throw new Error("Persistent browser storage is unavailable.");
  }

  databasePromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(KEY_DATABASE, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(KEY_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error || new Error("Could not open secure storage."));
    request.onblocked = () =>
      reject(new Error("Secure storage is blocked by another browser tab."));
  });
  return databasePromise;
}

async function readPersistedKey(database) {
  return new Promise((resolve, reject) => {
    const request = database
      .transaction(KEY_STORE, "readonly")
      .objectStore(KEY_STORE)
      .get(PERSISTED_KEY_NAME);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () =>
      reject(request.error || new Error("Could not read the secure key."));
  });
}

async function addPersistedKey(database, key) {
  return new Promise((resolve, reject) => {
    const request = database
      .transaction(KEY_STORE, "readwrite")
      .objectStore(KEY_STORE)
      .add(key, PERSISTED_KEY_NAME);
    request.onsuccess = () => resolve(true);
    request.onerror = (event) => {
      if (request.error?.name === "ConstraintError") {
        event.preventDefault();
        resolve(false);
        return;
      }
      reject(request.error || new Error("Could not save the secure key."));
    };
  });
}

async function createEncryptionKey() {
  const legacyEncodedKey = sessionStorage.getItem(LEGACY_KEY_NAME);
  if (legacyEncodedKey) {
    return window.crypto.subtle.importKey(
      "raw",
      fromBase64(legacyEncodedKey),
      "AES-GCM",
      false,
      ["encrypt", "decrypt"],
    );
  }

  return window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function getEncryptionKey() {
  if (!window.crypto?.subtle) {
    throw new Error("Web Crypto is unavailable in this browser context.");
  }
  if (encryptionKeyPromise) return encryptionKeyPromise;

  encryptionKeyPromise = (async () => {
    const database = await openKeyDatabase();
    const persistedKey = await readPersistedKey(database);
    if (persistedKey) return persistedKey;

    const candidateKey = await createEncryptionKey();
    if (await addPersistedKey(database, candidateKey)) return candidateKey;

    const winningKey = await readPersistedKey(database);
    if (!winningKey) {
      throw new Error("Could not initialize the secure storage key.");
    }
    return winningKey;
  })().catch((error) => {
    encryptionKeyPromise = null;
    throw error;
  });

  return encryptionKeyPromise;
}

async function encryptText(value) {
  const key = await getEncryptionKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const payload = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(value),
  );

  return `${STORAGE_PREFIX}${JSON.stringify({
    v: 1,
    iv: toBase64(iv),
    ct: toBase64(new Uint8Array(payload)),
  })}`;
}

async function decryptText(value) {
  if (!value || !value.startsWith(STORAGE_PREFIX)) return value;
  let encrypted;
  try {
    encrypted = JSON.parse(value.slice(STORAGE_PREFIX.length));
    if (
      encrypted?.v !== 1 ||
      typeof encrypted.iv !== "string" ||
      typeof encrypted.ct !== "string"
    ) {
      throw new Error("Invalid encrypted data format.");
    }
  } catch (error) {
    throw new Error("Saved encrypted data has an invalid format.", {
      cause: error,
    });
  }

  const key = await getEncryptionKey();
  try {
    const plaintext = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(encrypted.iv) },
      key,
      fromBase64(encrypted.ct),
    );
    return new TextDecoder().decode(plaintext);
  } catch (error) {
    throw new Error("Saved encrypted data could not be unlocked.", {
      cause: error,
    });
  }
}

export async function initializeStorage() {
  cache.clear();
  const storedValues = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || key === LEGACY_KEY_NAME) continue;

    const rawValue = localStorage.getItem(key);
    if (rawValue !== null) storedValues.push([key, rawValue]);
  }

  if (!window.crypto?.subtle) {
    throw new Error("Web Crypto is unavailable in this browser context.");
  }

  try {
    const hasEncryptedValues = storedValues.some(([, value]) =>
      value.startsWith(STORAGE_PREFIX),
    );
    if (hasEncryptedValues) {
      const database = await openKeyDatabase();
      const persistedKey = await readPersistedKey(database);
      if (!persistedKey && !sessionStorage.getItem(LEGACY_KEY_NAME)) {
        throw new Error(
          "The key for existing encrypted data is unavailable in this browser session.",
        );
      }
    }

    await getEncryptionKey();
    const decryptedValues = await Promise.all(
      storedValues.map(async ([key, rawValue]) => [
        key,
        await decryptText(rawValue),
      ]),
    );
    for (const [key, value] of decryptedValues) cache.set(key, value);
  } catch (error) {
    cache.clear();
    throw new Error(
      "Could not unlock saved application data. Your saved data has been left untouched; do not clear browser or app storage.",
      { cause: error },
    );
  }
}

export function getStorageItem(key) {
  if (cache.has(key)) return cache.get(key);
  const value = localStorage.getItem(key);
  if (value === null) return null;
  return value;
}

export function setStorageItem(key, value) {
  const serialized = String(value);
  cache.set(key, serialized);

  const previousWrite = pendingWrites.get(key) || Promise.resolve();
  const write = previousWrite
    .then(() => encryptText(serialized))
    .then((encrypted) => localStorage.setItem(key, encrypted))
    .catch((error) => {
      console.error(`[Cashero] Could not save local data for "${key}".`, error);
    });
  pendingWrites.set(key, write);
  void write.then(() => {
    if (pendingWrites.get(key) === write) pendingWrites.delete(key);
  });
  return serialized;
}

export function removeStorageItem(key) {
  cache.delete(key);
  return localStorage.removeItem(key);
}

export function readJSON(key) {
  const serialized = getStorageItem(key);
  if (serialized === null) return null;
  return JSON.parse(serialized);
}

export function writeJSON(key, value) {
  const serialized = JSON.stringify(value);
  setStorageItem(key, serialized);
  return serialized;
}
