import React from "react";
import { CheckCircle2, AlertCircle, ArrowRight, Route, X, MapPin, Sparkles } from "lucide-react";
import GlassCard from "./GlassCard";

export function RoadmapAdditionToastModal({ result, onClose, onViewRoadmap }) {
  if (!result) return null;

  const { success, alreadyAdded, message, item, locationInfo } = result;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <GlassCard strong className={`p-5 shadow-2xl border ${
        success 
          ? "bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-slate-900/95 border-emerald-500/40" 
          : alreadyAdded
          ? "bg-gradient-to-r from-cyan-950/90 via-slate-900/95 to-slate-900/95 border-cyan-500/40"
          : "bg-gradient-to-r from-red-950/90 via-slate-900/95 to-slate-900/95 border-red-500/40"
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              success 
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : alreadyAdded
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                : "bg-red-500/20 text-red-400 border-red-500/40"
            }`}>
              {success ? <CheckCircle2 size={20} /> : alreadyAdded ? <Route size={20} /> : <AlertCircle size={20} />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{message}</h4>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">{item?.title || "Item"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Location Information */}
        {locationInfo && (
          <div className="mt-3.5 p-3 rounded-xl bg-slate-950/70 border border-white/10 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase text-[10px] tracking-wider mb-1">
              <MapPin size={12} /> Roadmap Location Breakdown
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Career Goal:</span>
              <span className="font-semibold text-white">{locationInfo.career}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Roadmap Stage:</span>
              <span className="font-semibold text-cyan-300">{locationInfo.stage}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Topic Node:</span>
              <span className="font-semibold text-emerald-300">{locationInfo.topic}</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => {
              onClose();
              if (onViewRoadmap) onViewRoadmap(item?.id);
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-[#04121a] shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>View Learning Roadmap</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

export default RoadmapAdditionToastModal;
