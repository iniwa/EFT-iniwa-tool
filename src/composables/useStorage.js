// src/composables/useStorage.js
// localStorage and IndexedDB helpers

/**
 * Read a value from localStorage, returning `defaultValue` on any error.
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function loadLS(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.warn(`LS Load Error (${key}):`, e);
    return defaultValue;
  }
}

/**
 * Write a value to localStorage as JSON.
 * @param {string} key
 * @param {*} value
 */
export function saveLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LS Save Error:', e);
  }
}

// ---------------------------------------------------------------------------
// IndexedDB singleton composable
// ---------------------------------------------------------------------------

const DB_NAME = 'EFT_APP_DB';
const STORE_NAME = 'api_cache';
const DB_VERSION = 1;

/** Cached DB connection promise (opened once, reused) */
let _dbPromise = null;

/**
 * Open (or return the cached) IndexedDB connection.
 * @returns {Promise<IDBDatabase>}
 */
function getDB() {
  if (_dbPromise) return _dbPromise;

  _dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => {
      _dbPromise = null; // allow retry on next call
      reject(event.target.error);
    };
  });

  return _dbPromise;
}

/**
 * Composable that provides async IndexedDB helpers.
 * The underlying DB connection is cached so it is only opened once.
 *
 * @returns {{ saveDB: (key: string, value: any) => Promise<void>, loadDB: (key: string) => Promise<any> }}
 */
export function useIndexedDB() {
  /**
   * Store a value in IndexedDB under `key`.
   * @param {string} key
   * @param {*} value
   */
  async function saveDB(key, value) {
    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('IDB Save Error:', e);
    }
  }

  /**
   * Retrieve a value from IndexedDB by `key`.
   * Returns `null` when the key does not exist or on error.
   * @param {string} key
   * @returns {Promise<any>}
   */
  async function loadDB(key) {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      console.warn('IDB Load Error:', e);
      return null;
    }
  }

  return { saveDB, loadDB };
}
