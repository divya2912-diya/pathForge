import React, { useState } from "react";
import { PlayCircle } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import { RESOURCES, RESOURCE_ICONS } from "../../data/mockData";

export function ResourcesView() {
  const [filter, setFilter] = useState("All");
  const types = ["All", "Course", "Documentation", "Practice Problems", "Book"];
  const filtered = filter === "All" ? RESOURCES : RESOURCES.filter(r => r.type === filter);
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Intelligent recommendations" title="Learning resources" subtitle="Ranked by AI match score based on your skill profile and current gaps." />
      <div className="flex flex-wrap gap-2">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} className="px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer"
            style={filter === t ? { background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" } : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7cede" }}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(r => {
          const Icon = RESOURCE_ICONS[r.icon] || PlayCircle;
          return (
            <GlassCard key={r.id} hover className="p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.12)" }}>
                  <Icon size={16} color="#c4b5fd" />
                </div>
                <Pill tone="cyan">{r.match}% match</Pill>
              </div>
              <p className="text-sm font-semibold mb-1">{r.title}</p>
              <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: "var(--text-dim)" }}>
                <span>{r.type}</span><span>·</span><span>{r.difficulty}</span><span>·</span><span>{r.time}</span>
              </div>
              <p className="text-xs flex-1 mb-4" style={{ color: "#8b93a7" }}>{r.reason}</p>
              <button className="lp-btn-ghost text-xs py-2 rounded-lg w-full flex items-center justify-center gap-1.5 cursor-pointer">
                <PlayCircle size={13} /> Open resource
              </button>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

export default ResourcesView;
