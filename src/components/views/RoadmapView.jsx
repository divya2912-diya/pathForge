import React, { useState } from "react";
import { Clock, ChevronDown, Target } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import StatusDot from "../ui/StatusDot";
import Pill from "../ui/Pill";
import ProgressBar from "../ui/ProgressBar";
import { STUDENT, ROADMAP } from "../../data/mockData";

export function RoadmapView() {
  const [expanded, setExpanded] = useState(3);
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Personalized path" title={`Roadmap to ${STUDENT.targetCareer}`} subtitle="Built from your skills, gaps and performance. Click a milestone to expand it." />
      <div className="relative pl-8">
        <div className="absolute left-[15px] top-2 bottom-2 w-px" style={{ background: "linear-gradient(180deg, rgba(34,211,238,0.5), rgba(139,92,246,0.5), rgba(255,255,255,0.08))" }} />
        <div className="space-y-4">
          {ROADMAP.map(m => {
            const isOpen = expanded === m.id;
            return (
              <div key={m.id} className="relative">
                <div className="absolute -left-[29px] top-5"><StatusDot status={m.status} /></div>
                <GlassCard hover className={`p-5 ${m.status === "locked" ? "opacity-60" : ""}`}>
                  <button onClick={() => setExpanded(isOpen ? null : m.id)} className="w-full flex items-center justify-between text-left cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="lp-display text-sm shrink-0" style={{ color: "var(--text-dim)" }}>{String(m.id).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{m.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Pill tone={m.difficulty === "Advanced" ? "violet" : m.difficulty === "Intermediate" ? "cyan" : "default"}>{m.difficulty}</Pill>
                          <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-dim)" }}><Clock size={11} /> {m.duration}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown size={18} className="shrink-0 ml-2" style={{ color: "var(--text-dim)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .3s" }} />
                  </button>
                  {m.status === "in-progress" && (
                    <div className="mt-3"><ProgressBar value={m.progress} tone="cyan" height={6} /></div>
                  )}
                  {isOpen && (
                    <div className="mt-4 pt-4 lp-fade-up" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <p className="text-sm mb-3" style={{ color: "#c7cede" }}>{m.desc}</p>
                      <p className="text-xs flex items-start gap-1.5" style={{ color: "#67e8f9" }}><Target size={13} className="mt-0.5 shrink-0" /> {m.relevance}</p>
                    </div>
                  )}
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RoadmapView;
