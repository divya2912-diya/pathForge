import React, { useState, useEffect, useMemo } from "react";
import { Star, Check, FolderKanban, Plus, CheckCircle2, Target, ExternalLink, Bookmark, Briefcase } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import ModalShell from "../ui/ModalShell";
import { rankProjects } from "../../data/projectEngine";
import { getCatalogProjects, getSavedProjects, toggleSavedProject } from "../../data/supabaseAuth";

export function ProjectsView({ student, added, toggleAdded, go }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeDomain, setActiveDomain] = useState("Recommended");
  const [catalog, setCatalog] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch Catalog & Saved
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      const [projs, saved] = await Promise.all([
        getCatalogProjects(),
        getSavedProjects()
      ]);
      if (mounted) {
        setCatalog(projs);
        setSavedIds(saved);
        setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  const DOMAIN_TABS = [
    { id: "Recommended", label: "Recommended for You" },
    { id: "All", label: "All Projects" },
    { id: "Web", label: "Web / Full Stack" },
    { id: "Data", label: "Data Science & AI" },
    { id: "Cloud", label: "Cloud & DevOps" },
    { id: "Cyber", label: "Cybersecurity" }
  ];

  // Compute Recommendations & Filter
  const displayedProjects = useMemo(() => {
    if (activeDomain === "Recommended") {
      return rankProjects(catalog, student);
    }
    
    // For other tabs, just filter the catalog directly without strict match scoring,
    // but maybe still calculate match score so the UI has it.
    let filtered = catalog;
    if (activeDomain === "Web") {
      filtered = catalog.filter(p => (p.career_tags || []).some(t => t.toLowerCase().includes("full stack") || t.toLowerCase().includes("web") || t.toLowerCase().includes("frontend") || t.toLowerCase().includes("backend")));
    } else if (activeDomain === "Data") {
      filtered = catalog.filter(p => (p.career_tags || []).some(t => t.toLowerCase().includes("data") || t.toLowerCase().includes("ai") || t.toLowerCase().includes("machine learning")));
    } else if (activeDomain === "Cloud") {
      filtered = catalog.filter(p => (p.career_tags || []).some(t => t.toLowerCase().includes("cloud") || t.toLowerCase().includes("devops")));
    } else if (activeDomain === "Cyber") {
      filtered = catalog.filter(p => (p.career_tags || []).some(t => t.toLowerCase().includes("cyber") || t.toLowerCase().includes("security")));
    }
    
    // Just map them to have a base match score for the UI if they don't go through the engine
    return filtered.map(p => ({
      ...p,
      match: p.match || 50, // Default if not calculated
      reason: "Browsing by domain category."
    })).sort((a, b) => b.impact - a.impact);
  }, [catalog, student, activeDomain]);

  // Handlers
  const handleToggleSave = async (e, projectId) => {
    e.stopPropagation();
    const isSaved = savedIds.has(projectId);
    
    // Optimistic UI
    setSavedIds(prev => {
      const next = new Set(prev);
      if (isSaved) next.delete(projectId);
      else next.add(projectId);
      return next;
    });

    const res = await toggleSavedProject(projectId, isSaved);
    if (!res.success) {
      // Revert if failed
      setSavedIds(prev => {
        const next = new Set(prev);
        if (isSaved) next.add(projectId);
        else next.delete(projectId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <SectionHeader eyebrow="Build to prove it" title="Projects Portfolio" subtitle="Discover projects to strengthen your skills across any domain." />
        
        {/* Domain Tabs */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 hide-scrollbar w-full" style={{ scrollbarWidth: 'none' }}>
          <div className="inline-flex bg-white/5 p-1 rounded-xl border border-white/10 w-max">
            {DOMAIN_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDomain(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeDomain === tab.id 
                    ? "bg-cyan-500 text-[#060911] shadow-lg shadow-cyan-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <GlassCard key={i} className="p-6 h-[220px] animate-pulse flex flex-col justify-between">
              <div className="flex gap-4"><div className="w-12 h-12 bg-white/5 rounded-xl" /><div className="flex-1 space-y-2"><div className="h-4 bg-white/5 rounded w-3/4" /><div className="h-3 bg-white/5 rounded w-1/2" /></div></div>
              <div className="flex gap-2"><div className="w-16 h-6 bg-white/5 rounded-full" /><div className="w-16 h-6 bg-white/5 rounded-full" /></div>
            </GlassCard>
          ))}
        </div>
      ) : displayedProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayedProjects.map(p => (
            <GlassCard key={p.id} hover className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex flex-col gap-1.5">
                  <Pill tone={p.difficulty === "Advanced" ? "violet" : p.difficulty === "Intermediate" ? "cyan" : "emerald"}>{p.difficulty}</Pill>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => handleToggleSave(e, p.id)} className={`p-1.5 rounded-lg transition-colors ${savedIds.has(p.id) ? "text-amber-400 bg-amber-400/10" : "text-slate-500 hover:text-white hover:bg-white/10"}`}>
                    <Bookmark size={16} fill={savedIds.has(p.id) ? "currentColor" : "none"} />
                  </button>
                  <div className={`px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm ${
                        p.match >= 80 ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10" : 
                        p.match >= 50 ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-cyan-500/10" :
                        "bg-white/5 border-white/10 text-slate-300"
                      }`}>
                    {p.match}% Match
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mb-1.5 leading-tight">{p.title}</h3>
              <p className="text-xs mb-4 flex-1 text-slate-400 line-clamp-2 leading-relaxed">{p.description}</p>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(p.skills || []).slice(0, 3).map((s, i) => <Pill key={i} tone="slate">{s}</Pill>)}
                {(p.skills || []).length > 3 && <Pill tone="slate">+{p.skills.length - 3}</Pill>}
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 z-10">
                <button 
                  onClick={() => setSelectedProject(p)}
                  className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  View project
                </button>
                <button onClick={() => toggleAdded(p.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                  added.has(p.id) ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10" : 
                  "bg-cyan-500 hover:bg-cyan-400 text-[#060911] border border-cyan-400 hover:shadow-cyan-500/20"
                }`}>
                  {added.has(p.id) ? <><CheckCircle2 size={14} /> Added to Roadmap</> : <><Plus size={14} /> Add to Roadmap</>}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <FolderKanban size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No projects found for this domain</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">It looks like we don't have any projects specifically tailored to your current career goal right now. Try updating your target career.</p>
        </div>
      )}

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
                        selectedProject.match >= 50 ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-cyan-500/10" :
                        "bg-white/5 border-white/10 text-slate-300"
                      }`}>
                    {selectedProject.match}% Match
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                    selectedProject.difficulty === "Advanced" ? "bg-violet-500/15 border-violet-500/30 text-violet-300" : 
                    selectedProject.difficulty === "Intermediate" ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300" :
                    "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  }`}>
                    {selectedProject.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm">
              <h4 className="font-bold text-indigo-300 mb-1 flex items-center gap-2"><Target size={16} /> Why this is recommended</h4>
              <p className="text-indigo-200/80 text-xs leading-relaxed">
                {selectedProject.reason}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">Description</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedProject.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Skills Applied</h4>
              <div className="flex flex-wrap gap-2">
                {(selectedProject.skills || []).map((skill, i) => (
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
                    <Star key={i} size={18} fill={i < (selectedProject.impact || 3) ? "#fbbf24" : "none"} color={i < (selectedProject.impact || 3) ? "#fbbf24" : "#475569"} />
                  ))}
                </div>
                <span className="text-sm text-slate-400 font-medium ml-2">Portfolio Value</span>
              </div>
            </div>
            
            {/* Sources Required */}
            {(selectedProject.source_url || selectedProject.demo_url) && (
              <div>
                <h4 className="text-sm font-bold text-white mb-3">Sources & Resources</h4>
                <div className="flex flex-col gap-2">
                  {selectedProject.source_url && (
                    <a href={selectedProject.source_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                      <span className="text-sm font-semibold text-white flex items-center gap-2"><FolderKanban size={16} className="text-cyan-400" /> Starter Code / Tutorial</span>
                      <ExternalLink size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                    </a>
                  )}
                  {selectedProject.demo_url && (
                    <a href={selectedProject.demo_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                      <span className="text-sm font-semibold text-white flex items-center gap-2"><Briefcase size={16} className="text-emerald-400" /> Live Demo Example</span>
                      <ExternalLink size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              <button 
                onClick={() => { toggleAdded(selectedProject.id); }} 
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  added.has(selectedProject.id) ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : 
                  "bg-cyan-500 hover:bg-cyan-400 text-[#060911] border border-cyan-400 hover:shadow-cyan-500/20"
                }`}
              >
                {added.has(selectedProject.id) ? <><CheckCircle2 size={16} /> Added to Roadmap</> : <><Plus size={16} /> Add to Roadmap</>}
              </button>
              {added.has(selectedProject.id) && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <span>✓ Project added to your roadmap.</span>
                  <button onClick={() => { setSelectedProject(null); go?.("roadmap"); }} className="underline font-bold text-cyan-300 hover:text-cyan-200">
                    View Roadmap →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </ModalShell>
    </div>
  );
}

export default ProjectsView;
