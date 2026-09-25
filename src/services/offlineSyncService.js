// ============================================================
//  PathForge — Real Offline Sync Service with IndexedDB & Supabase
// ============================================================

import { supabase } from "../lib/supabaseClient";
import { 
  cacheLearningData, 
  getCachedLearningData, 
  enqueuePendingProgressAction, 
  getPendingSyncActions, 
  markActionSynced, 
  clearUserOfflineData 
} from "./indexedDBService";

/**
 * Register Service Worker if supported.
 */
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        console.log("PathForge Service Worker registered successfully:", reg.scope);
      }).catch((err) => {
        console.warn("SW registration notice:", err);
      });
    });
  }
}

/**
 * Cache offline content in IndexedDB
 */
export async function cacheLearningContent(key, data, userId = "guest") {
  return await cacheLearningData(key, data, userId);
}

/**
 * Get cached content from IndexedDB
 */
export async function getCachedContent(key) {
  return await getCachedLearningData(key);
}

/**
 * Queue an offline action in IndexedDB
 */
export async function enqueueOfflineAction(actionType, payload, userId, roadmapNodeId) {
  return await enqueuePendingProgressAction({
    userId: userId || "guest",
    roadmapNodeId: roadmapNodeId || payload?.roadmapNodeId || payload?.milestoneId || "",
    action: actionType,
    payload
  });
}

/**
 * Sync pending offline actions with Supabase when online.
 */
export async function syncOfflineQueue(onStatusChange, userId) {
  if (!navigator.onLine) return;

  try {
    const pending = await getPendingSyncActions(userId);
    if (pending.length === 0) {
      onStatusChange?.("Online");
      return;
    }

    onStatusChange?.("Syncing...");

    const { data: { session } } = await supabase.auth.getSession();
    const activeUserId = session?.user?.id || userId;

    for (const item of pending) {
      try {
        if (item.action === "complete" || item.action === "complete_node") {
          const milestoneId = item.roadmapNodeId || item.payload?.milestoneId;
          const career = item.payload?.career || "Software Engineer";

          if (activeUserId && milestoneId) {
            // Upsert user_roadmap_progress in Supabase safely
            await supabase.from("user_roadmap_progress").upsert({
              user_id: activeUserId,
              node_id: String(milestoneId),
              status: "completed",
              progress_pct: 100,
              updated_at: new Date().toISOString()
            }, { onConflict: "user_id,node_id" });
          }
        } else if (item.action === "record_activity") {
          if (activeUserId) {
            await supabase.from("learning_activity").insert([{
              user_id: activeUserId,
              activity_type: item.payload?.activityType || "learning",
              duration_seconds: item.payload?.durationSeconds || 120,
              started_at: item.payload?.startedAt || new Date().toISOString(),
              completed_at: new Date().toISOString()
            }]);
          }
        }

        // Mark IndexedDB action as synced upon successful Supabase update
        await markActionSynced(item.id);
      } catch (err) {
        console.warn(`Failed to sync item ${item.id}:`, err);
      }
    }

    onStatusChange?.("Synced");
    setTimeout(() => onStatusChange?.("Online"), 3000);
  } catch (err) {
    console.error("Error during offline sync:", err);
    onStatusChange?.("Online");
  }
}

/**
 * Security: Clear user offline cache upon logout
 */
export async function handleLogoutCacheClear(userId) {
  if (userId) {
    await clearUserOfflineData(userId);
  }
}
