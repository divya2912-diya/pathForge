import React, { useState } from "react";
import { Star, Check, FolderKanban, Plus, CheckCircle2, Target } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import ModalShell from "../ui/ModalShell";
import { PROJECTS } from "../../data/mockData";

export function ProjectsView({ added, toggleAdded }) {
  const [selectedProject, setSelectedProject] = useState(null);

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
            <p className="text-xs mb-3 flex-1 text-slate-400">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">{p.skills.map(s => <Pill key={s}>{s}</Pill>)}</div>
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill={i < p.impact ? "#fbbf24" : "none"} color="#fbbf24" />)}
              <span className="text-xs ml-1 text-slate-500">career impact</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button 
                onClick={() => setSelectedProject(p)}
                className="lp-btn-ghost text-xs py-2 rounded-lg flex-1 cursor-pointer transition-colors hover:text-white"
              >
                View project
              </button>
              <button onClick={() => toggleAdded(p.id)} className={`text-xs py-2 rounded-lg flex-1 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                added.has(p.id) 
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-300" 
                  : "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
              }`}>
                {added.has(p.id) ? <><Check size={13} /> Added</> : "Add to roadmap"}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Project Details Modal */}
      <ModalShell open={!!selectedProject} title="Project Details" icon={FolderKanban} onClose={() => setSelectedProject(null)}>
        {selectedProject && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/5">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{selectedProject.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm ${
                        selectedProject.match >= 80 ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10" : 
                        "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-cyan-500/10"
                      }`}>
                    {selectedProject.match}% Match
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                    selectedProject.difficulty === "Advanced" ? "bg-violet-500/15 border-violet-500/30 text-violet-300" : "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                  }`}>
                    {selectedProject.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm">
              <h4 className="font-bold text-indigo-300 mb-1 flex items-center gap-2"><Target size={16} /> Why this is recommended</h4>
              <p className="text-indigo-200/80 text-xs leading-relaxed">
                This project builds practical experience in {selectedProject.skills.join(", ")}, which directly targets your current skill gaps for your career goal.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">Description</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedProject.desc}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Skills Applied</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium border bg-white/5 border-white/10 text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">Career Impact</h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill={i < selectedProject.impact ? "#fbbf24" : "none"} color={i < selectedProject.impact ? "#fbbf24" : "#475569"} />
                  ))}
                </div>
                <span className="text-sm text-slate-400 font-medium ml-2">High portfolio value</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button 
                onClick={() => { toggleAdded(selectedProject.id); setSelectedProject(null); }} 
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  added.has(selectedProject.id) ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : 
                  "bg-cyan-500 hover:bg-cyan-400 text-[#060911] border border-cyan-400 hover:shadow-cyan-500/20"
                }`}
              >
                {added.has(selectedProject.id) ? <><CheckCircle2 size={16} /> Added to Roadmap</> : <><Plus size={16} /> Add to Roadmap</>}
              </button>
            </div>
          </div>
        )}
      </ModalShell>
    </div>
  );
}

export default ProjectsView;
