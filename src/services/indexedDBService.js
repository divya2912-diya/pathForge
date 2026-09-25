// ============================================================
//  PathForge — IndexedDB Service for Real Offline Learning Data
// ============================================================

const DB_NAME = "PathForgeOfflineDB";
const DB_VERSION = 1;
const STORE_CACHE = "offline_cache";
const STORE_QUEUE = "offline_sync_queue";

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      console.warn("IndexedDB is not supported in this browser environment.");
      resolve(null);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_CACHE)) {
        db.createObjectStore(STORE_CACHE, { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        const queueStore = db.createObjectStore(STORE_QUEUE, { keyPath: "id" });
        queueStore.createIndex("userId", "userId", { unique: false });
        queueStore.createIndex("syncStatus", "syncStatus", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (err) => {
      console.error("Failed to open IndexedDB:", err);
      resolve(null);
    };
  });

  return dbPromise;
}

/**
 * Cache structured learning content in IndexedDB
 */
export async function cacheLearningData(key, data, userId = "guest") {
  try {
    const db = await openDB();
    if (!db) return;

    const tx = db.transaction(STORE_CACHE, "readwrite");
    const store = tx.objectStore(STORE_CACHE);
    await store.put({
      key,
      userId,
      data,
      timestamp: Date.now()
    });
  } catch (err) {
    console.warn(`IndexedDB cache error for key ${key}:`, err);
  }
}

/**
 * Retrieve cached learning content from IndexedDB
 */
export async function getCachedLearningData(key) {
  try {
    const db = await openDB();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CACHE, "readonly");
      const store = tx.objectStore(STORE_CACHE);
      const req = store.get(key);

      req.onsuccess = () => resolve(req.result?.data || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Queue a pending progress action while offline into IndexedDB
 */
export async function enqueuePendingProgressAction({ userId, roadmapNodeId, action = "complete", payload = {} }) {
  try {
    const db = await openDB();
    if (!db) return null;

    const actionId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const record = {
      id: actionId,
      userId,
      roadmapNodeId,
      action,
      payload,
      timestamp: Date.now(),
      created_at: new Date().toISOString(),
      syncStatus: "pending"
    };

    const tx = db.transaction(STORE_QUEUE, "readwrite");
    const store = tx.objectStore(STORE_QUEUE);
    store.put(record);

    return record;
  } catch (err) {
    console.error("Failed to queue pending progress action in IndexedDB:", err);
    return null;
  }
}

/**
 * Fetch all pending offline sync actions for a user from IndexedDB
 */
export async function getPendingSyncActions(userId) {
  try {
    const db = await openDB();
    if (!db) return [];

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_QUEUE, "readonly");
      const store = tx.objectStore(STORE_QUEUE);
      const req = store.getAll();

      req.onsuccess = () => {
        const all = req.result || [];
        const pending = all.filter(item => item.syncStatus === "pending" && (!userId || item.userId === userId));
        resolve(pending);
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Update sync status of a pending action in IndexedDB
 */
export async function markActionSynced(actionId) {
  try {
    const db = await openDB();
    if (!db) return;

    const tx = db.transaction(STORE_QUEUE, "readwrite");
    const store = tx.objectStore(STORE_QUEUE);
    store.delete(actionId);
  } catch (err) {
    console.warn(`Failed to delete synced action ${actionId} from IndexedDB:`, err);
  }
}

/**
 * Clear user-scoped offline cache upon logout for security & multi-user isolation
 */
export async function clearUserOfflineData(userId) {
  try {
    const db = await openDB();
    if (!db) return;

    const tx = db.transaction([STORE_CACHE, STORE_QUEUE], "readwrite");
    const cacheStore = tx.objectStore(STORE_CACHE);
    const queueStore = tx.objectStore(STORE_QUEUE);

    const cacheReq = cacheStore.getAllKeys();
    cacheReq.onsuccess = () => {
      const keys = cacheReq.result || [];
      keys.forEach(k => {
        if (typeof k === "string" && (k.includes(userId) || k.startsWith("user_"))) {
          cacheStore.delete(k);
        }
      });
    };
  } catch (err) {
    console.warn("Failed to clear IndexedDB user offline data:", err);
  }
}
