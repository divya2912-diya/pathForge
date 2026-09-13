import React from "react";
import { Award } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import { CERTIFICATIONS } from "../../data/mockData";

export function CertificationsView({ added, toggleAdded }) {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Validate your skills" title="Recommended certifications" subtitle="Ranked by relevance to your target role and current gaps." />
      <div className="grid md:grid-cols-2 gap-5">
        {CERTIFICATIONS.map(c => (
          <GlassCard key={c.id} hover className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.14)" }}>
              <Award size={20} color="#c4b5fd" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-semibold">{c.title}</p>
                <Pill tone="cyan">{c.match}%</Pill>
              </div>
              <p className="text-xs mb-2" style={{ color: "var(--text-dim)" }}>{c.provider} · {c.duration} · {c.difficulty}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">{c.skills.map(s => <Pill key={s}>{s}</Pill>)}</div>
              <button onClick={() => toggleAdded(c.id)} className="text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                style={added.has(c.id) ? { background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.4)", color: "#6ee7b7" } : { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.35)", color: "#67e8f9" }}>
                {added.has(c.id) ? "Added to roadmap ✓" : "Add to roadmap"}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export default CertificationsView;
