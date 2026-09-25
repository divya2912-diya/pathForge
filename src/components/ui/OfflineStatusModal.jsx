import React from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle2, X, CloudOff } from "lucide-react";
import GlassCard from "./GlassCard";
import { getTranslation } from "../../services/i18nService";

export function OfflineStatusModal({ open, onClose, isOnline, syncStatus, lang = "en" }) {
  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
        <GlassCard strong className="p-6 space-y-4 border-cyan-500/30 shadow-2xl relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
              isOnline 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}>
              {isOnline ? <Wifi size={24} /> : <CloudOff size={24} />}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isOnline ? getTranslation("offline.online", lang) : getTranslation("offline.offlineModalTitle", lang)}
              </h3>
              <p className="text-xs text-slate-400 font-semibold">Status: {syncStatus}</p>
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-2 text-xs text-slate-300">
            {isOnline ? (
              <p>🟢 Connected to the internet. All progress changes are synchronized directly with your Supabase profile.</p>
            ) : (
              <p>
                {getTranslation("offline.offlineModalDesc", lang)}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white text-xs cursor-pointer hover:from-cyan-400 transition-all shadow-md"
            >
              Close
            </button>
          </div>
        </GlassCard>
      </div>
    </>
  );
}

export default OfflineStatusModal;
