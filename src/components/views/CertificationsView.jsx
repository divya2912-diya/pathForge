import React, { useState, useEffect, useMemo } from "react";
import { 
  Award, Search, Filter, Plus, ExternalLink, Bookmark, 
  CheckCircle2, ChevronDown, Clock, BarChart, ArrowRight, 
  X, Trash2, Edit3, UploadCloud, Target, Briefcase, BookOpen
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import ModalShell from "../ui/ModalShell";
import { rankCertifications } from "../../data/certificationEngine";
import { getCatalogCertifications, getSavedCertifications, toggleSavedCertification } from "../../data/supabaseAuth";
import { SKILL_REQUIREMENTS, calculateDynamicReadiness } from "../../data/userProfile";

// ── Icons ────────────────────────────────────────────────────────
const CertIcon = ({ icon: Icon, tone = "violet" }) => {
  const tones = {
    violet: "from-violet-500/20 to-indigo-500/10 border-violet-500/30 text-violet-400 shadow-violet-500/10",
    emerald: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10",
    cyan: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400 shadow-cyan-500/10",
  };
  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br border flex items-center justify-center shrink-0 shadow-md ${tones[tone]}`}>
      <Icon size={24} className="drop-shadow-md" />
    </div>
  );
};

// ── Main View ───────────────────────────────────────────────────
export function CertificationsView({ student, onUpdateStudent, added, toggleAdded }) {
  const [activeTab, setActiveTab] = useState("recommended");
  const [catalog, setCatalog] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("match"); // match, duration, difficulty
  
  // Modals
  const [selectedCert, setSelectedCert] = useState(null);
  
  // My Certifications state
  const [myCertToEdit, setMyCertToEdit] = useState(null);
  const [myCertModalOpen, setMyCertModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch Catalog & Saved
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      const [certs, saved] = await Promise.all([
        getCatalogCertifications(),
        getSavedCertifications()
      ]);
      if (mounted) {
        setCatalog(certs);
        setSavedIds(saved);
        setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  // Compute Recommendations
  const recommendations = useMemo(() => {
    return rankCertifications(catalog, student);
  }, [catalog, student]);

  // Derived Career Data
  const targetCareer = student?.targetCareer || "Software Engineer";
  const requiredSkills = (SKILL_REQUIREMENTS[targetCareer] || []).map(s => s.toLowerCase());
  const userSkills = (student?.skills || []).map(s => s.toLowerCase());
  const missingSkills = requiredSkills.filter(req => !userSkills.some(us => req.includes(us) || us.includes(req)));
  const readiness = calculateDynamicReadiness(student) || 0;

  // Filter & Sort
  const filteredCerts = useMemo(() => {
    let res = [...recommendations];
    
    if (search.trim()) {
      const query = search.toLowerCase();
      res = res.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.provider.toLowerCase().includes(query) ||
        (c.skills || []).some(s => s.toLowerCase().includes(query))
      );
    }
    
    if (sortBy === "duration") {
      res.sort((a, b) => (a.duration?.length || 0) - (b.duration?.length || 0));
    } else if (sortBy === "difficulty") {
      const diffRank = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
      res.sort((a, b) => (diffRank[a.difficulty] || 0) - (diffRank[b.difficulty] || 0));
    }
    return res;
  }, [recommendations, search, sortBy]);

  // Handlers
  const handleToggleSave = async (e, certId) => {
    e.stopPropagation();
    const isSaved = savedIds.has(certId);
    
    // Optimistic UI
    setSavedIds(prev => {
      const next = new Set(prev);
      if (isSaved) next.delete(certId);
      else next.add(certId);
      return next;
    });

    const res = await toggleSavedCertification(certId, isSaved);
    if (!res.success) {
      // Revert if failed (simplified error handling)
      setSavedIds(prev => {
        const next = new Set(prev);
        if (isSaved) next.add(certId);
        else next.delete(certId);
        return next;
      });
    }
  };

  const handleSaveMyCert = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newCert = {
      id: myCertToEdit?.id || Date.now().toString(),
      name: fd.get("name"),
      issuer: fd.get("issuer"),
      issueDate: fd.get("issueDate"),
      credentialId: fd.get("credentialId"),
      credentialUrl: fd.get("credentialUrl"),
      skills: fd.get("skills") ? fd.get("skills").split(",").map(s => s.trim()).filter(Boolean) : [],
    };
    
    const list = [...(student?.certificationsList || [])];
    if (myCertToEdit) {
      const idx = list.findIndex(c => c.id === myCertToEdit.id);
      if (idx !== -1) list[idx] = newCert;
    } else {
      list.push(newCert);
    }
    
    onUpdateStudent?.({ ...student, certificationsList: list }, "Certification saved!");
    setMyCertModalOpen(false);
  };

  const handleDeleteMyCert = () => {
    if (!deleteTarget) return;
    const list = (student?.certificationsList || []).filter(c => c.id !== deleteTarget.id);
    onUpdateStudent?.({ ...student, certificationsList: list }, "Certification removed");
    setDeleteModalOpen(false);
  };

  // Renderers
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <SectionHeader 
            eyebrow="Build credentials that support your career goal" 
            title="Certifications Intelligence" 
            subtitle="Personalized recommendations and credential management." 
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit">
        <button onClick={() => setActiveTab("recommended")} 
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "recommended" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
          Recommended Certifications
        </button>
        <button onClick={() => setActiveTab("my-certs")} 
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "my-certs" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
          My Certifications
        </button>
      </div>

      {activeTab === "recommended" && (
        <div className="space-y-6">
          {/* Career Context Card */}
          <GlassCard className="p-6 relative overflow-hidden bg-gradient-to-br from-indigo-500/[0.03] to-cyan-500/[0.02]">
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
              <Target size={120} className="text-cyan-400 blur-sm" />
            </div>
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="flex-1">
                <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider mb-1">Your Career Goal</p>
                <h2 className="text-2xl font-bold text-white mb-2">{targetCareer}</h2>
                <div className="flex items-center gap-3">
                  <div className="w-full max-w-[200px] h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" style={{ width: `${readiness}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-cyan-300">{readiness}% Readiness</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-rose-300 font-semibold uppercase tracking-wider mb-2">Priority Skill Gaps</p>
                {missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.slice(0, 5).map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium shadow-sm">
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </span>
                    ))}
                    {missingSkills.length > 5 && <span className="text-xs text-slate-500 self-center">+{missingSkills.length - 5} more</span>}
                  </div>
                ) : (
                  <div className="text-sm text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={16} /> All core skills acquired!</div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search recommendations..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2">
                <Filter size={14} />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent border-none text-white focus:outline-none cursor-pointer appearance-none outline-none">
                  <option value="match" className="bg-[#0a0f1c]">Best Match</option>
                  <option value="duration" className="bg-[#0a0f1c]">Shortest Duration</option>
                  <option value="difficulty" className="bg-[#0a0f1c]">Beginner Friendly</option>
                </select>
                <ChevronDown size={14} className="ml-1" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map(i => (
                <GlassCard key={i} className="p-6 h-[220px] animate-pulse flex flex-col justify-between">
                  <div className="flex gap-4"><div className="w-12 h-12 bg-white/5 rounded-xl" /><div className="flex-1 space-y-2"><div className="h-4 bg-white/5 rounded w-3/4" /><div className="h-3 bg-white/5 rounded w-1/2" /></div></div>
                  <div className="flex gap-2"><div className="w-16 h-6 bg-white/5 rounded-full" /><div className="w-16 h-6 bg-white/5 rounded-full" /></div>
                </GlassCard>
              ))}
            </div>
          ) : filteredCerts.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-5">
              {filteredCerts.map(cert => (
                <GlassCard key={cert.id} hover className="p-6 relative flex flex-col group overflow-hidden border-white/5 transition-all duration-300 hover:border-cyan-500/30 hover:-translate-y-1">
                  
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                    <div className="flex items-start gap-4">
                      <CertIcon icon={Award} tone={cert.matchScore >= 80 ? "emerald" : "cyan"} />
                      <div>
                        <h3 className="text-base font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors leading-tight mb-1">{cert.name}</h3>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                          <Briefcase size={12} className="text-slate-500" /> {cert.provider}
                        </p>
                      </div>
                    </div>
                    
                    {/* Match Badge */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button onClick={(e) => handleToggleSave(e, cert.id)} className={`p-1.5 rounded-lg transition-colors ${savedIds.has(cert.id) ? "text-amber-400 bg-amber-400/10" : "text-slate-500 hover:text-white hover:bg-white/10"}`}>
                        <Bookmark size={16} fill={savedIds.has(cert.id) ? "currentColor" : "none"} />
                      </button>
                      <div className={`px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm ${
                        cert.matchScore >= 80 ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10" : 
                        "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-cyan-500/10"
                      }`}>
                        {cert.matchScore}% Match
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 z-10">
                    <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-500" /> {cert.duration}</div>
                    <div className="w-1 h-1 rounded-full bg-slate-600" />
                    <div className="flex items-center gap-1.5"><BarChart size={14} className="text-slate-500" /> {cert.difficulty}</div>
                  </div>

                  {/* Skills Preview */}
                  <div className="flex flex-wrap gap-1.5 mb-5 z-10">
                    {cert.displaySkills.slice(0, 4).map((skill, i) => (
                      <span key={i} className={`px-2 py-0.5 rounded text-[11px] font-medium border ${skill.isGap ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300" : "bg-white/5 border-white/10 text-slate-300"}`}>
                        {skill.name} {skill.isGap && "✨"}
                      </span>
                    ))}
                    {cert.displaySkills.length > 4 && (
                      <span className="px-2 py-0.5 rounded text-[11px] text-slate-500">+{cert.displaySkills.length - 4}</span>
                    )}
                  </div>
                  
                  {/* Footer / Actions */}
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4 z-10">
                    <button onClick={() => setSelectedCert(cert)} className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                      View Details
                    </button>
                    <button onClick={() => toggleAdded(cert.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                      added.has(cert.id) ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10" : 
                      "bg-cyan-500 hover:bg-cyan-400 text-[#060911] border border-cyan-400 hover:shadow-cyan-500/20"
                    }`}>
                      {added.has(cert.id) ? <><CheckCircle2 size={14} /> Added to Roadmap</> : <><Plus size={14} /> Add to Roadmap</>}
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <Award size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No recommendations found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">Try adjusting your filters or expanding your career goals to discover more certifications.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "my-certs" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Earned Credentials</h2>
              <p className="text-sm text-slate-400">Certifications and credentials you've completed.</p>
            </div>
            <button onClick={() => { setMyCertToEdit(null); setMyCertModalOpen(true); }} className="lp-btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 font-bold shadow-lg shadow-cyan-500/10">
              <Plus size={14} /> Add Certification
            </button>
          </div>

          {student?.certificationsList?.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-5">
              {student.certificationsList.map(cert => (
                <GlassCard key={cert.id} className="p-5 flex flex-col justify-between group hover:border-violet-500/30 transition-colors">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0">
                          <Award size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white leading-tight">{cert.name}</h3>
                          <p className="text-xs text-violet-300 font-medium">{cert.issuer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => { setMyCertToEdit(cert); setMyCertModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded-md hover:bg-white/10"><Edit3 size={14}/></button>
                        <button onClick={() => { setDeleteTarget(cert); setDeleteModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-md hover:bg-white/10"><Trash2 size={14}/></button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400 bg-white/5 p-3 rounded-lg border border-white/5">
                      {cert.issueDate && <div><span className="text-slate-500 mr-1">Issued:</span><span className="text-slate-200">{cert.issueDate}</span></div>}
                      {cert.credentialId && <div><span className="text-slate-500 mr-1">ID:</span><span className="text-slate-200">{cert.credentialId}</span></div>}
                    </div>
                    
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {cert.skills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-medium">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {cert.credentialUrl && (
                    <div className="mt-5 pt-4 border-t border-white/5">
                      <a href={cert.credentialUrl.startsWith("http") ? cert.credentialUrl : `https://${cert.credentialUrl}`} target="_blank" rel="noreferrer" 
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline">
                        <ExternalLink size={14} /> View Official Credential
                      </a>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard className="flex flex-col items-center justify-center py-16 text-center gap-3 border-dashed border-white/10">
              <Award size={40} className="text-slate-600 mb-2" />
              <h3 className="text-sm font-bold text-white">No certifications added yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Keep track of the credentials you've earned and associate them with your skills.</p>
            </GlassCard>
          )}
        </div>
      )}

      {/* ── Modals ────────────────────────────────────────────────── */}

      {/* Recommendation Details Modal */}
      <ModalShell open={!!selectedCert} title="Certification Details" icon={Award} onClose={() => setSelectedCert(null)}>
        {selectedCert && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 pb-5 border-b border-white/5">
              <CertIcon icon={Award} tone="cyan" />
              <div>
                <h2 className="text-lg font-bold text-white">{selectedCert.name}</h2>
                <p className="text-sm text-cyan-300 font-medium">{selectedCert.provider}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm">
              <h4 className="font-bold text-indigo-300 mb-1 flex items-center gap-2"><Target size={16} /> Why this is recommended</h4>
              <p className="text-indigo-200/80 text-xs leading-relaxed">{selectedCert.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Duration</span>
                <span className="text-sm text-slate-200 font-medium">{selectedCert.duration}</span>
              </div>
              <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Difficulty</span>
                <span className="text-sm text-slate-200 font-medium">{selectedCert.difficulty}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Skills Covered</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCert.displaySkills.map((skill, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${skill.isGap ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-200 shadow-sm" : "bg-white/5 border-white/10 text-slate-300"}`}>
                    {skill.name} {skill.isGap && <span className="ml-1 opacity-70">✦ Gap</span>}
                  </span>
                ))}
              </div>
            </div>

            {selectedCert.description && (
              <div>
                <h4 className="text-sm font-bold text-white mb-2">Description</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedCert.description}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Where to get it</h4>
              <div className="flex flex-col gap-2">
                {selectedCert.official_url && (
                  <a href={selectedCert.official_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                    <span className="text-sm font-semibold text-white flex items-center gap-2"><Award size={16} className="text-amber-400" /> Official Provider</span>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                  </a>
                )}
                {selectedCert.learning_url && (
                  <a href={selectedCert.learning_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                    <span className="text-sm font-semibold text-white flex items-center gap-2"><BookOpen size={16} className="text-cyan-400" /> Learning Platform</span>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button onClick={() => { toggleAdded(selectedCert.id); setSelectedCert(null); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                added.has(selectedCert.id) ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : 
                "bg-cyan-500 hover:bg-cyan-400 text-[#060911] border border-cyan-400 hover:shadow-cyan-500/20"
              }`}>
                {added.has(selectedCert.id) ? <><CheckCircle2 size={16} /> Added</> : <><Plus size={16} /> Add to Roadmap</>}
              </button>
            </div>
          </div>
        )}
      </ModalShell>

      {/* Add/Edit Earned Certification Modal */}
      <ModalShell open={myCertModalOpen} title={myCertToEdit ? "Edit Certification" : "Add Certification"} subtitle="Record a credential you've officially earned" icon={Award} onClose={() => setMyCertModalOpen(false)}>
        <form onSubmit={handleSaveMyCert} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Certification Name *</label>
              <input name="name" defaultValue={myCertToEdit?.name} required className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Issuing Organization *</label>
              <input name="issuer" defaultValue={myCertToEdit?.issuer} required className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Issue Date</label>
                <input name="issueDate" type="text" placeholder="e.g. March 2026" defaultValue={myCertToEdit?.issueDate} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Credential ID</label>
                <input name="credentialId" defaultValue={myCertToEdit?.credentialId} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Credential URL</label>
              <input name="credentialUrl" defaultValue={myCertToEdit?.credentialUrl} placeholder="https://" className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Skills Covered (comma separated)</label>
              <input name="skills" defaultValue={myCertToEdit?.skills?.join(", ")} placeholder="e.g. Docker, Python" className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setMyCertModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#060911] bg-cyan-500 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">Save Certification</button>
          </div>
        </form>
      </ModalShell>

      {/* Delete Confirm Modal */}
      <ModalShell open={deleteModalOpen} title="Delete Certification" icon={Trash2} onClose={() => setDeleteModalOpen(false)}>
        <div className="space-y-6">
          <p className="text-sm text-slate-300">Are you sure you want to remove <span className="font-bold text-white">"{deleteTarget?.name}"</span> from your profile? This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10">Cancel</button>
            <button onClick={handleDeleteMyCert} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 transition-colors shadow-lg shadow-rose-500/10">Delete</button>
          </div>
        </div>
      </ModalShell>

    </div>
  );
}

export default CertificationsView;
