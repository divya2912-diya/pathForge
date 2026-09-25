import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { syncOfflineQueue } from "../../services/offlineSyncService";

export function SyncStatusBadge() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState("Online"); // Online | Offline | Syncing... | Synced

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus("Syncing...");
      syncOfflineQueue((status) => setSyncStatus(status));
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("Offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (navigator.onLine) {
      syncOfflineQueue((status) => setSyncStatus(status));
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  let badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let Icon = Wifi;

  if (!isOnline || syncStatus === "Offline") {
    badgeColor = "bg-amber-500/10 text-amber-300 border-amber-500/30";
    Icon = WifiOff;
  } else if (syncStatus === "Syncing...") {
    badgeColor = "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
    Icon = RefreshCw;
  } else if (syncStatus === "Synced") {
    badgeColor = "bg-blue-500/10 text-blue-300 border-blue-500/30";
    Icon = CheckCircle2;
  }

  return (
    <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition-all ${badgeColor}`}>
      <Icon size={12} className={syncStatus === "Syncing..." ? "animate-spin" : ""} />
      <span>{syncStatus}</span>
    </div>
  );
}

export default SyncStatusBadge;
