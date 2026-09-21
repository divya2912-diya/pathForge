import React from "react";
import { Star, Check } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import { PROJECTS } from "../../data/mockData";

export function ProjectsView({ added, toggleAdded }) {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Build to prove it" title="Recommended projects" subtitle="Chosen to close your current skill gaps and strengthen your portfolio." />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {PROJECTS.map(p => (
          <GlassCard key={p.id} hover className="p-5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Pill tone={p.difficulty === "Advanced" ? "violet" : "cyan"}>{p.difficulty}</Pill>
              <Pill tone="cyan">{p.match}% match</Pill>
            </div>
            <p className="text-sm font-semibold mb-1.5">{p.title}</p>
            <p className="text-xs mb-3 flex-1" style={{ color: "#8b93a7" }}>{p.desc}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">{p.skills.map(s => <Pill key={s}>{s}</Pill>)}</div>
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill={i < p.impact ? "#fbbf24" : "none"} color="#fbbf24" />)}
              <span className="text-xs ml-1" style={{ color: "var(--text-dim)" }}>career impact</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button className="lp-btn-ghost text-xs py-2 rounded-lg flex-1 cursor-pointer">View project</button>
              <button onClick={() => toggleAdded(p.id)} className="text-xs py-2 rounded-lg flex-1 flex items-center justify-center gap-1 cursor-pointer"
                style={added.has(p.id) ? { background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.4)", color: "#6ee7b7" } : { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.35)", color: "#67e8f9" }}>
                {added.has(p.id) ? <><Check size={13} /> Added</> : "Add to roadmap"}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export default ProjectsView;
