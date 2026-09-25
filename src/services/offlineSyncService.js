// ============================================================
//  PathForge — Offline Storage & Synchronization Service
// ============================================================

import { supabase } from "../lib/supabaseClient";

const QUEUE_KEY = "pathforge_offline_queue";
const CONTENT_CACHE_KEY = "pathforge_cached_content";

/**
 * Register Service Worker if supported.
 */
export function registerServiceWorker() {
  if ("serviceWorker" in navigator && process.env.NODE_ENV !== "test") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("SW registration notice:", err);
      });
    });
  }
}

/**
 * Cache offline content locally for immediate retrieval.
 */
export function cacheLearningContent(key, data) {
  try {
    const existing = JSON.parse(localStorage.getItem(CONTENT_CACHE_KEY) || "{}");
    existing[key] = { data, timestamp: Date.now() };
    localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn("Failed to cache content locally:", err);
  }
}

/**
 * Get cached content locally.
 */
export function getCachedContent(key) {
  try {
    const existing = JSON.parse(localStorage.getItem(CONTENT_CACHE_KEY) || "{}");
    return existing[key]?.data || null;
  } catch {
    return null;
  }
}

/**
 * Queue an offline action locally.
 */
export function enqueueOfflineAction(actionType, payload, userId) {
  try {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    const newAction = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      user_id: userId,
      action_type: actionType,
      payload,
      created_at: new Date().toISOString(),
      sync_status: "pending"
    };
    queue.push(newAction);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return newAction;
  } catch (err) {
    console.error("Failed to queue offline action:", err);
    return null;
  }
}

/**
 * Sync pending offline actions with Supabase when online.
 */
export async function syncOfflineQueue(onStatusChange) {
  if (!navigator.onLine) return;

  try {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    const pending = queue.filter(item => item.sync_status === "pending");

    if (pending.length === 0) return;

    onStatusChange?.("Syncing...");

    const updatedQueue = [...queue];

    for (const item of pending) {
      try {
        if (item.action_type === "complete_node") {
          const { career, milestoneId, progress } = item.payload;
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await supabase.from("milestone_progress").upsert({
              user_id: session.user.id,
              career,
              milestone_id: milestoneId,
              progress,
              updated_at: new Date().toISOString()
            }, { onConflict: "user_id,career,milestone_id" });
          }
        } else if (item.action_type === "record_activity") {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await supabase.from("learning_activity").insert([{
              user_id: session.user.id,
              activity_type: item.payload.activityType || "learning",
              resource_id: item.payload.resourceId || "",
              roadmap_node_id: item.payload.roadmapNodeId || "",
              duration_seconds: item.payload.durationSeconds || 0,
              started_at: item.payload.startedAt || new Date().toISOString(),
              completed_at: new Date().toISOString()
            }]);
          }
        }

        // Mark as synced
        const target = updatedQueue.find(q => q.id === item.id);
        if (target) target.sync_status = "synced";
      } catch (err) {
        console.warn(`Failed to sync item ${item.id}:`, err);
      }
    }

    // Retain only un-synced items in localStorage
    const remaining = updatedQueue.filter(q => q.sync_status === "pending");
    localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));

    onStatusChange?.("Synced");
    setTimeout(() => onStatusChange?.("Online"), 3000);
  } catch (err) {
    console.error("Error during offline sync:", err);
    onStatusChange?.("Online");
  }
}
