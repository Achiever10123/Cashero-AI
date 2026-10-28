export function getStorageItem(key) {
  return localStorage.getItem(key);
}

export function setStorageItem(key, value) {
  return localStorage.setItem(key, value);
}

export function removeStorageItem(key) {
  return localStorage.removeItem(key);
}

export function readJSON(key) {
  const serialized = getStorageItem(key);
  if (serialized === null) return null;

  return JSON.parse(serialized);
}

export function writeJSON(key, value) {
  return setStorageItem(key, JSON.stringify(value));
}
