// ============================================================
// TTS audio cache (IndexedDB) — synthesized clips are cached by exact
// voice+rate+text so replaying the same line (e.g. re-pressing "Slow"
// on a sentence you already heard) reuses the stored audio instead of
// calling the Azure API again. This is a real cost saver since
// shadowing sentences get replayed a lot. Cache is keyed per voice, so
// alternating Ava/Aria on fresh text still works — only exact repeats
// are served from cache.
// ============================================================

const TTS_CACHE_DB_NAME = "speakvn_tts_cache";
const TTS_CACHE_STORE = "clips";
let ttsCacheDbPromise = null;

function openTtsCacheDb() {
  if (ttsCacheDbPromise) return ttsCacheDbPromise;
  ttsCacheDbPromise = new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported in this browser."));
      return;
    }
    const req = indexedDB.open(TTS_CACHE_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(TTS_CACHE_STORE)) {
        db.createObjectStore(TTS_CACHE_STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return ttsCacheDbPromise;
}

function ttsCacheKeyFor(voiceTag, rateAttr, text) {
  return `${voiceTag}|${rateAttr}|${text}`;
}

async function ttsCacheGet(key) {
  try {
    const db = await openTtsCacheDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(TTS_CACHE_STORE, "readonly");
      const req = tx.objectStore(TTS_CACHE_STORE).get(key);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return null;
  }
}

async function ttsCachePut(key, blob) {
  try {
    const db = await openTtsCacheDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(TTS_CACHE_STORE, "readwrite");
      tx.objectStore(TTS_CACHE_STORE).put({ key, blob, bytes: blob.size, ts: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    // Cache write failures shouldn't break playback — just means no caching this time.
  }
}

async function ttsCacheStats() {
  try {
    const db = await openTtsCacheDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(TTS_CACHE_STORE, "readonly");
      const req = tx.objectStore(TTS_CACHE_STORE).getAll();
      req.onsuccess = () => {
        const rows = req.result || [];
        const bytes = rows.reduce((sum, r) => sum + (r.bytes || 0), 0);
        resolve({ count: rows.length, bytes });
      };
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return { count: 0, bytes: 0 };
  }
}

async function ttsCacheClear() {
  try {
    const db = await openTtsCacheDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(TTS_CACHE_STORE, "readwrite");
      tx.objectStore(TTS_CACHE_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {}
}
