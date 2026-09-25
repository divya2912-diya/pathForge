import React, { useState, useEffect, useMemo } from "react";
import { 
  Bell, Search, Filter, Bookmark, ExternalLink, CheckCircle2, 
  AlertTriangle, MapPin, Briefcase, Clock, Sparkles, Check, 
  Settings, RefreshCw, ArrowRight, ShieldCheck
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ModalShell from "../ui/ModalShell";
import { fetchLiveJobs, evaluateJobMatch } from "../../services/jobService";

export function JobNotificationsView({ student, onUpdateStudent, go }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all | recommended | saved
  const [search, setSearch] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("all"); // all | remote | hybrid | on-site
  const [unreadIds, setUnreadIds] = useState(new Set());
  const [prefsModalOpen, setPrefsModalOpen] = useState(false);

  // Fetch Jobs
  useEffect(() => {
    let mounted = true;
    async function loadJobs() {
      setLoading(true);
      const data = await fetchLiveJobs();
      if (mounted) {
        setJobs(data);
        // Mark first 3 as unread for notification feed
        setUnreadIds(new Set(data.slice(0, 3).map(j => j.id)));
        setLoading(false);
      }
    }
    loadJobs();
    return () => { mounted = false; };
  }, []);

  // Saved Jobs Set
  const savedJobIds = useMemo(() => {
    return new Set((student?.savedJobs || []).map(j => j.id));
  }, [student?.savedJobs]);

  // Evaluated & Filtered Jobs
  const evaluatedJobs = useMemo(() => {
    return jobs.map(j => evaluateJobMatch(j, student));
  }, [jobs, student]);

  const filteredJobs = useMemo(() => {
    return evaluatedJobs.filter(job => {
      // Tab Filter
      if (activeTab === "saved") {
        if (!savedJobIds.has(job.id)) return false;
      } else if (activeTab === "recommended") {
        if (!job.isCareerMatch && job.matchScore < 40) return false;
      }

      // Work Mode Filter
      if (workModeFilter !== "all") {
        if (job.workMode.toLowerCase() !== workModeFilter.toLowerCase()) return false;
      }

      // Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches = 
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.skills.some(s => s.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [evaluatedJobs, activeTab, workModeFilter, search, savedJobIds]);

  // Handlers
  const handleToggleSave = (job) => {
    const isSaved = savedJobIds.has(job.id);
    let updatedSaved = [...(student?.savedJobs || [])];
    if (isSaved) {
      updatedSaved = updatedSaved.filter(j => j.id !== job.id);
    } else {
      updatedSaved.push(job);
    }
    onUpdateStudent?.({ ...student, savedJobs: updatedSaved }, isSaved ? "Job removed from saved list" : "Job saved!");
  };

  const handleMarkAllRead = () => {
    setUnreadIds(new Set());
  };

  const handleJobClick = (jobId) => {
    setUnreadIds(prev => {
      const next = new Set(prev);
      next.delete(jobId);
      return next;
    });
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const prefs = {
      targetRole: fd.get("targetRole"),
      location: fd.get("location"),
      workMode: fd.get("workMode"),
      frequency: fd.get("frequency"),
    };
    onUpdateStudent?.({ ...student, jobPreferences: prefs }, "Job alert preferences updated!");
    setPrefsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* ── HEADER & UNREAD BADGE ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <SectionHeader 
            eyebrow="Real-time career alerts & job feed" 
            title="Job Notifications" 
            subtitle="Centralized feed of real active opportunities matched to your target career and skills." 
          />
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          {unreadIds.size > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 size={14} className="text-cyan-400" /> Mark all read
            </button>
          )}

          <button
            onClick={() => setPrefsModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-xs text-white hover:from-cyan-400 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Settings size={15} /> Job Preferences
          </button>
        </div>
      </div>

      {/* ── UNREAD SUMMARY BANNER ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/5 to-purple-500/10 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Bell size={20} />
            </div>
            {unreadIds.size > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadIds.size}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {unreadIds.size > 0 ? `🔴 ${unreadIds.size} New Job Notifications` : "✓ All notifications caught up"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized based on your target career goal: <span className="text-cyan-300 font-semibold">{student?.targetCareer || "Software Engineer"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-emerald-400" /> Verified Job Source Links Only
        </div>
      </div>

      {/* ── TABS & CONTROLS ────────────────────────────────────────────── */}
      <div className="space-y-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Tab Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#060911] border border-white/10 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "all" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              All Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab("recommended")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "recommended" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles size={13} /> Recommended ({evaluatedJobs.filter(j => j.isCareerMatch).length})
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "saved" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <Bookmark size={13} /> Saved Jobs ({student?.savedJobs?.length || 0})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search jobs by title, company, skill (e.g. React, Node.js, Remote)..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#060911] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" 
            />
          </div>

          {/* Work Mode Filter */}
          <select 
            value={workModeFilter} 
            onChange={e => setWorkModeFilter(e.target.value)}
            className="bg-[#060911] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="all">All Work Modes</option>
            <option value="remote">Remote Only</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-site</option>
          </select>
        </div>
      </div>

      {/* ── JOB FEED GRID ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <GlassCard key={i} className="p-6 h-[200px] animate-pulse flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-5 bg-white/5 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-1/3" />
              </div>
              <div className="h-8 bg-white/5 rounded w-full" />
            </GlassCard>
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-5">
          {filteredJobs.map(job => {
            const isUnread = unreadIds.has(job.id);
            const isSaved = savedJobIds.has(job.id);

            return (
              <GlassCard 
                key={job.id} 
                hover 
                onClick={() => handleJobClick(job.id)}
                className={`p-6 flex flex-col justify-between group transition-all duration-300 relative border-white/5 hover:border-cyan-500/30 ${
                  isUnread ? "bg-gradient-to-br from-cyan-500/[0.05] to-transparent border-l-4 border-l-cyan-400" : ""
                }`}
              >
                <div>
                  {/* Top Bar: Notification Badge & Save Button */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      {job.notificationType || "🎯 Recommended Job"}
                    </span>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleSave(job); }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isSaved ? "text-amber-400 bg-amber-400/10" : "text-slate-500 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Job Title & Company */}
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-cyan-400 mt-1 flex items-center gap-2">
                    <Briefcase size={13} className="text-slate-400" /> {job.company}
                  </p>

                  {/* Details Meta */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-3 p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-500" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-500" /> {job.postedDate}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-semibold text-slate-300">
                      {job.experience}
                    </span>
                  </div>

                  {/* SKILL GAP & MATCH ANALYSIS */}
                  <div className="mt-4 space-y-2">
                    {job.matchedSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mr-1">
                          <CheckCircle2 size={13} /> Matched:
                        </span>
                        {job.matchedSkills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* PATHFORGE INTEGRATION: MISSING SKILL → ROADMAP / RESOURCE */}
                    {job.missingSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1 mr-1">
                          <AlertTriangle size={13} /> Missing:
                        </span>
                        {job.missingSkills.map((s, i) => (
                          <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); go?.("roadmap"); }}
                            title={`Click to learn ${s} on your PathForge Roadmap`}
                            className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] text-amber-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {s} <ArrowRight size={10} className="opacity-70" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Source: {job.source}
                  </span>

                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#060911] rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/10"
                  >
                    View Job <ExternalLink size={13} />
                  </a>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        /* ── EMPTY STATE FOR NO MATCHES / UNAVAILABLE ─────────────────────── */
        <GlassCard className="p-12 text-center border-dashed border-white/10">
          <Briefcase size={44} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">No job vacancies found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            {activeTab === "saved" 
              ? "You haven't saved any job notifications yet." 
              : "No job postings matched your current search filters."}
          </p>
        </GlassCard>
      )}

      {/* ── JOB ALERT PREFERENCES MODAL ──────────────────────────────────── */}
      <ModalShell
        open={prefsModalOpen}
        title="Job Alert Preferences"
        subtitle="Configure your personalized career alerts"
        icon={Settings}
        onClose={() => setPrefsModalOpen(false)}
      >
        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target Role / Career</label>
            <input 
              name="targetRole" 
              defaultValue={student?.jobPreferences?.targetRole || student?.targetCareer || "Software Engineer"} 
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Preferred Location</label>
            <input 
              name="location" 
              defaultValue={student?.jobPreferences?.location || "Remote / Worldwide"} 
              placeholder="e.g. Remote, San Francisco, New York"
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Work Mode</label>
              <select 
                name="workMode" 
                defaultValue={student?.jobPreferences?.workMode || "Remote"} 
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Any">Any Work Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Alert Frequency</label>
              <select 
                name="frequency" 
                defaultValue={student?.jobPreferences?.frequency || "Daily"} 
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="Daily">Daily Alerts</option>
                <option value="Weekly">Weekly Digest</option>
                <option value="Off">Off</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={() => setPrefsModalOpen(false)} 
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#060911] bg-cyan-500 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </ModalShell>

    </div>
  );
}

export default JobNotificationsView;
