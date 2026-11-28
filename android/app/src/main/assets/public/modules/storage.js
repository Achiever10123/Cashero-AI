const STORAGE_PREFIX = "enc:";
const KEY_NAME = "cashero_vault_key";
const cache = new Map();

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

async function getEncryptionKey() {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Web Crypto is unavailable in this browser context.");
  }

  let encodedKey = sessionStorage.getItem(KEY_NAME);
  if (!encodedKey) {
    const randomKey = window.crypto.getRandomValues(new Uint8Array(32));
    encodedKey = toBase64(randomKey);
    sessionStorage.setItem(KEY_NAME, encodedKey);
  }

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    fromBase64(encodedKey),
    "AES-GCM",
    false,
    ["encrypt", "decrypt"],
  );

  return keyMaterial;
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
  const encrypted = JSON.parse(value.slice(STORAGE_PREFIX.length));
  const key = await getEncryptionKey();
  const plaintext = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(encrypted.iv) },
    key,
    fromBase64(encrypted.ct),
  );

  return new TextDecoder().decode(plaintext);
}

export async function initializeStorage() {
  if (!window.crypto || !window.crypto.subtle) return;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || key === KEY_NAME) continue;

    const rawValue = localStorage.getItem(key);
    if (rawValue === null) continue;

    try {
      cache.set(key, await decryptText(rawValue));
    } catch {
      cache.set(key, rawValue);
    }
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
  void encryptText(serialized).then((encrypted) => {
    localStorage.setItem(key, encrypted);
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
