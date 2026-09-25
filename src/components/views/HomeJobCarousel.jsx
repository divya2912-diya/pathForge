import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  ChevronLeft, ChevronRight, Briefcase, MapPin, Clock, 
  ExternalLink, Bookmark, CheckCircle2, AlertTriangle, 
  Sparkles, ArrowRight, ShieldCheck, Layers, Check
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import { fetchLiveJobs, evaluateJobMatch, classifyJobDomain } from "../../services/jobService";

export function HomeJobCarousel({ student, onUpdateStudent, go }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch Swipe State
  const touchStartX = useRef(null);

  // Fetch Jobs
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      const data = await fetchLiveJobs();
      if (mounted) {
        setJobs(data);
        setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  // Saved Jobs Set
  const savedJobIds = useMemo(() => {
    return new Set((student?.savedJobs || []).map(j => j.id));
  }, [student?.savedJobs]);

  // Evaluated Jobs
  const evaluatedJobs = useMemo(() => {
    return jobs.map(j => evaluateJobMatch(j, student));
  }, [jobs, student]);

  // Available Domains from real dataset
  const availableDomains = useMemo(() => {
    const set = new Set();
    evaluatedJobs.forEach(j => {
      const d = classifyJobDomain(j);
      if (d) set.add(d);
    });
    return Array.from(set);
  }, [evaluatedJobs]);

  // Priority Domain matching user target career
  const targetCareer = student?.targetCareer || "";
  
  // Filter Jobs by Domain
  const filteredJobs = useMemo(() => {
    if (selectedDomain === "all") {
      // Sort recommended first
      return [...evaluatedJobs].sort((a, b) => b.matchScore - a.matchScore);
    }
    return evaluatedJobs.filter(j => classifyJobDomain(j).toLowerCase() === selectedDomain.toLowerCase());
  }, [evaluatedJobs, selectedDomain]);

  // Reset index when domain changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedDomain]);

  // Auto-Slide Timer (5s interval, pauses on hover/interaction)
  useEffect(() => {
    if (isPaused || filteredJobs.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredJobs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, filteredJobs.length]);

  // Navigation Handlers
  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + filteredJobs.length) % filteredJobs.length);
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % filteredJobs.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 40) {
      nextSlide(); // Swipe left -> Next
    } else if (diff < -40) {
      prevSlide(); // Swipe right -> Prev
    }
    touchStartX.current = null;
  };

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

  if (loading) {
    return (
      <GlassCard className="p-6 h-[260px] animate-pulse flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading career job opportunities...</p>
      </GlassCard>
    );
  }

  if (evaluatedJobs.length === 0) {
    return (
      <GlassCard className="p-6 text-center border-dashed border-white/10">
        <p className="text-xs text-slate-400">Job feed temporarily unavailable.</p>
      </GlassCard>
    );
  }

  return (
    <div 
      className="space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── SECTION HEADER & NAVIGATION CONTROLS ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <SectionHeader 
            eyebrow="REAL-TIME CAREER OPPORTUNITIES" 
            title="Latest Job Opportunities" 
            subtitle="Live job vacancies matching your career profile and skills." 
          />
        </div>

        {/* Previous / Next Slide Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={prevSlide}
            aria-label="Previous Job"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Job"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── DOMAIN FILTER TABS ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit text-xs">
        <button
          onClick={() => setSelectedDomain("all")}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
            selectedDomain === "all" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          All Recommended
        </button>

        {availableDomains.map(d => {
          const isTargetMatch = targetCareer && d.toLowerCase().includes(targetCareer.toLowerCase());
          return (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                selectedDomain.toLowerCase() === d.toLowerCase() 
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {d} {isTargetMatch && <Sparkles size={11} className="text-amber-300" />}
            </button>
          );
        })}
      </div>

      {/* ── PHYSICAL HORIZONTAL CAROUSEL CONTAINER ────────────────────── */}
      <div 
        className="relative overflow-hidden rounded-2xl p-1"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {filteredJobs.length > 0 ? (
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {filteredJobs.map((job) => {
              const isSaved = savedJobIds.has(job.id);

              return (
                <div key={job.id} className="w-full shrink-0 px-1">
                  <GlassCard strong className="p-6 relative flex flex-col justify-between border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-purple-500/[0.03]">
                    
                    {/* Top Row: Badge & Save */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
                          {job.notificationType || "🎯 Recommended Job"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-300">
                          {job.domain}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleSave(job)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved ? "text-amber-400 bg-amber-400/10" : "text-slate-500 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Job Details */}
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-cyan-400 mt-1 flex items-center gap-2">
                        <Briefcase size={13} className="text-slate-400" /> {job.company}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-3 p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-slate-500" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-500" /> {job.postedDate}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-semibold text-slate-300">
                          {job.workMode}
                        </span>
                      </div>

                      {/* Skill Breakdown */}
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

                        {/* PATHFORGE INTEGRATION: MISSING SKILL -> ROADMAP */}
                        {job.missingSkills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1 mr-1">
                              <AlertTriangle size={13} /> Missing:
                            </span>
                            {job.missingSkills.map((s, i) => (
                              <button
                                key={i}
                                onClick={() => go?.("roadmap")}
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

                    {/* Action Bar */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Source: {job.source}
                      </span>

                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#060911] rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/10"
                      >
                        View Job <ExternalLink size={13} />
                      </a>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        ) : (
          <GlassCard className="p-8 text-center border-dashed border-white/10">
            <p className="text-xs text-slate-400">No jobs currently available for {selectedDomain}.</p>
          </GlassCard>
        )}
      </div>

      {/* ── CAROUSEL INDICATORS & VIEW ALL JOBS BUTTON ──────────────────── */}
      <div className="flex items-center justify-between pt-2">
        {/* Indicators Dots */}
        <div className="flex items-center gap-1.5">
          {filteredJobs.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                i === currentIndex ? "bg-cyan-400 w-6" : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* View All Jobs Action */}
        <button
          onClick={() => go?.("jobs")}
          className="text-xs font-bold text-cyan-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          View All Job Notifications <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}

export default HomeJobCarousel;
