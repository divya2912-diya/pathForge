import React, { useState } from "react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import { STUDENT } from "../../data/mockData";

export function SettingsView() {
  const [prefs, setPrefs] = useState({ dailyReminders: true, weeklyDigest: true, aiSuggestions: true, pace: "Balanced" });
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader eyebrow="Account" title="Settings" />
      <GlassCard className="p-6" hover>
        <SectionHeader title="Notifications" />
        {[
          ["dailyReminders", "Daily learning reminders", "A short nudge to keep your streak going."],
          ["weeklyDigest", "Weekly progress digest", "A summary of roadmap progress and new recommendations."],
          ["aiSuggestions", "AI Mentor proactive tips", "Let your AI Mentor message you when it detects a gap."],
        ].map(([key, label, desc]) => (
          <div key={key} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p className="text-sm">{label}</p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>{desc}</p>
            </div>
            <button onClick={() => toggle(key)} className="w-11 h-6 rounded-full relative shrink-0 transition-colors cursor-pointer"
              style={{ background: prefs[key] ? "linear-gradient(90deg,#22d3ee,#3b82f6)" : "rgba(255,255,255,0.12)" }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: prefs[key] ? 22 : 2 }} />
            </button>
          </div>
        ))}
      </GlassCard>
      <GlassCard className="p-6" hover>
        <SectionHeader title="Learning pace" subtitle="Adjusts how densely your roadmap schedules new material" />
        <div className="grid grid-cols-3 gap-3">
          {["Relaxed", "Balanced", "Intensive"].map(p => (
            <button key={p} onClick={() => setPrefs({ ...prefs, pace: p })} className="py-3 rounded-xl text-sm transition-all cursor-pointer"
              style={prefs.pace === p
                ? { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}>
              {p}
            </button>
          ))}
        </div>
      </GlassCard>
      <GlassCard className="p-6" hover>
        <SectionHeader title="Account" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}><span style={{ color: "var(--text-dim)" }}>Name</span><span>{STUDENT.name}</span></div>
          <div className="flex justify-between py-1.5"><span style={{ color: "var(--text-dim)" }}>Email</span><span>alex@university.edu</span></div>
        </div>
      </GlassCard>
    </div>
  );
}

export default SettingsView;
