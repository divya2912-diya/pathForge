import React, { useState } from "react";
import { PlayCircle, X, ExternalLink } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import { RESOURCES, RESOURCE_ICONS } from "../../data/mockData";

export function ResourcesView({ student, added, toggleAdded, go }) {
  const [filter, setFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All Domains");
  const [activeVideo, setActiveVideo] = useState(null);

  const types = ["All", "Course", "Documentation", "Practice Problems", "Book"];
  const domains = ["All Domains", "Data Science", "Web Development", "Cybersecurity", "Cloud Computing"];
  
  const filtered = RESOURCES.filter(r => {
    const typeMatch = filter === "All" || r.type === filter;
    const domainMatch = domainFilter === "All Domains" || r.domain === domainFilter;
    return typeMatch && domainMatch;
  });

  const handleOpenResource = (resource) => {
    if (resource.type === "Course" && resource.url?.includes("youtube.com/embed")) {
      setActiveVideo(resource);
    } else if (resource.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Intelligent recommendations" title="Learning resources" subtitle="Ranked by AI match score based on your skill profile and current gaps." />
      <div className="flex flex-col gap-4">
        {/* Domain Filters */}
        <div className="flex overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 min-w-max">
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setDomainFilter(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  domainFilter === d
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} className="px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer"
              style={filter === t ? { background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" } : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7cede" }}>
              {t}
            </button>
          ))}
        </div>
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
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenResource(r)}
                  className="lp-btn-ghost text-xs py-2 rounded-lg flex-1 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {r.type === "Course" ? <PlayCircle size={13} /> : <ExternalLink size={13} />}
                  Open resource
                </button>
                <button
                  onClick={() => toggleAdded?.(r.id)}
                  className={`text-xs py-2 px-3 rounded-lg border font-semibold flex items-center gap-1 transition-all ${
                    added?.has(r.id) 
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
                  }`}
                >
                  {added?.has(r.id) ? "✓ Added" : "+ Roadmap"}
                </button>
              </div>
              {added?.has(r.id) && (
                <div className="mt-2 text-[11px] text-emerald-400 flex items-center justify-between">
                  <span>✓ Added to your roadmap</span>
                  <button onClick={() => go?.("roadmap")} className="underline font-semibold hover:text-cyan-300">View Roadmap</button>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setActiveVideo(null)}>
          <div className="w-full max-w-5xl bg-[#0f172a] rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/50">
              <div>
                <h3 className="text-lg font-semibold text-white">{activeVideo.title}</h3>
                <p className="text-sm text-slate-400">{activeVideo.domain} · {activeVideo.difficulty}</p>
              </div>
              <button onClick={() => setActiveVideo(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="w-full aspect-video bg-black">
              <iframe
                src={activeVideo.url}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourcesView;
