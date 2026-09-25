import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  ChevronLeft, ChevronRight, Briefcase, MapPin, Clock, 
  ExternalLink, Bookmark, CheckCircle2, AlertTriangle, 
  Sparkles, ArrowRight
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

  // Drag & Touch Gesture State
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(null);

  // Section Entry Intersection Observer State
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Reduced Motion Preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // IntersectionObserver for Section Entry Reveal
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  // Available Domains
  const availableDomains = useMemo(() => {
    const set = new Set();
    evaluatedJobs.forEach(j => {
      const d = classifyJobDomain(j);
      if (d) set.add(d);
    });
    return Array.from(set);
  }, [evaluatedJobs]);

  const targetCareer = student?.targetCareer || "";

  // Filter Jobs by Selected Domain
  const filteredJobs = useMemo(() => {
    if (selectedDomain === "all") {
      return [...evaluatedJobs].sort((a, b) => b.matchScore - a.matchScore);
    }
    return evaluatedJobs.filter(j => classifyJobDomain(j).toLowerCase() === selectedDomain.toLowerCase());
  }, [evaluatedJobs, selectedDomain]);

  // Reset Index when Domain Changes
  useEffect(() => {
    setCurrentIndex(0);
    setDragOffset(0);
  }, [selectedDomain]);

  // Auto-Slide Timer (5s interval, pauses on hover / drag / user interaction)
  useEffect(() => {
    if (isPaused || isDragging || filteredJobs.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredJobs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, isDragging, filteredJobs.length]);

  // Navigation Handlers (Infinite Loop)
  const prevSlide = () => {
    setDragOffset(0);
    setCurrentIndex(prev => (prev - 1 + filteredJobs.length) % filteredJobs.length);
  };

  const nextSlide = () => {
    setDragOffset(0);
    setCurrentIndex(prev => (prev + 1) % filteredJobs.length);
  };

  // Mouse Drag & Touch Gesture Handlers
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setIsPaused(true);
    startXRef.current = clientX;
  };

  const handleDragMove = (clientX) => {
    if (!isDragging || startXRef.current === null) return;
    const diff = clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);
    if (dragOffset < -60) {
      nextSlide();
    } else if (dragOffset > 60) {
      prevSlide();
    } else {
      setDragOffset(0);
    }
    startXRef.current = null;
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

  // Pagination Window for Slide Indicators (Max 8 visible dots)
  const maxDots = 8;
  const dotIndices = useMemo(() => {
    const total = filteredJobs.length;
    if (total <= maxDots) return Array.from({ length: total }, (_, i) => i);
    let start = Math.max(0, currentIndex - Math.floor(maxDots / 2));
    let end = start + maxDots;
    if (end > total) {
      end = total;
      start = Math.max(0, end - maxDots);
    }
    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [filteredJobs.length, currentIndex]);

  if (loading) {
    return (
      <GlassCard className="p-8 h-[280px] animate-pulse flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading real-time career job opportunities...</p>
      </GlassCard>
    );
  }

  if (evaluatedJobs.length === 0) {
    return (
      <GlassCard className="p-8 text-center border-dashed border-white/10">
        <p className="text-xs text-slate-400">Job notification feed temporarily unavailable.</p>
      </GlassCard>
    );
  }

  // Dynamic Slide Track Transform
  const trackTransform = `translate3d(calc(-${currentIndex * 100}% + ${dragOffset}px), 0, 0)`;

  return (
    <div 
      ref={containerRef}
      className={`space-y-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        handleDragEnd();
      }}
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
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={prevSlide}
            aria-label="Previous Job"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-cyan-500/20 active:scale-95 border border-white/10 hover:border-cyan-400/50 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]"
          >
            <ChevronLeft size={19} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Job"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-cyan-500/20 active:scale-95 border border-white/10 hover:border-cyan-400/50 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>

      {/* ── DOMAIN FILTER TABS ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit text-xs">
        <button
          onClick={() => setSelectedDomain("all")}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
            selectedDomain === "all" 
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]" 
              : "text-slate-400 hover:text-white"
          }`}
        >
          All Recommended
        </button>

        {availableDomains.map(d => {
          const isTargetMatch = targetCareer && d.toLowerCase().includes(targetCareer.toLowerCase());
          const isSelected = selectedDomain.toLowerCase() === d.toLowerCase();
          return (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                isSelected 
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {d} {isTargetMatch && <Sparkles size={11} className="text-amber-300" />}
            </button>
          );
        })}
      </div>

      {/* ── CINEMATIC HORIZONTAL CAROUSEL VIEWPORT ────────────────────── */}
      <div 
        className="relative overflow-hidden rounded-2xl p-1 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {filteredJobs.length > 0 ? (
          <div 
            className="flex"
            style={{ 
              transform: trackTransform,
              transition: isDragging || prefersReducedMotion ? "none" : "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            {filteredJobs.map((job, idx) => {
              const isSaved = savedJobIds.has(job.id);
              const isActive = idx === currentIndex;
              const distance = Math.abs(idx - currentIndex);

              // Depth Scaling & Opacity for Cinematic Card Transition
              const cardScale = isActive ? 1 : distance === 1 ? 0.96 : 0.92;
              const cardOpacity = isActive ? 1 : distance === 1 ? 0.35 : 0.05;
              const cardBlur = isActive ? "blur(0px)" : "blur(1px)";

              return (
                <div 
                  key={job.id} 
                  className="w-full shrink-0 px-1"
                  style={{
                    opacity: cardOpacity,
                    transform: `scale(${cardScale})`,
                    filter: cardBlur,
                    transition: isDragging || prefersReducedMotion
                      ? "none" 
                      : "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1), filter 600ms cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  <GlassCard 
                    strong 
                    className="p-6 relative flex flex-col justify-between border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-purple-500/[0.04] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.003] hover:border-cyan-500/40 hover:shadow-[0_14px_40px_-10px_rgba(34,211,238,0.2)]"
                  >
                    {/* Top Row: Badge & Save Button */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5 shadow-sm shadow-cyan-500/10">
                          {job.notificationType || "🎯 Recommended Job"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-300">
                          {job.domain}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(job);
                        }}
                        className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                          isSaved ? "text-amber-400 bg-amber-400/10 border border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]" : "text-slate-500 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Job Details */}
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white leading-tight tracking-tight">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-cyan-400 mt-1.5 flex items-center gap-2">
                        <Briefcase size={14} className="text-slate-400" /> {job.company}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300 mt-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-slate-400" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-400" /> {job.postedDate}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-semibold text-cyan-200 border border-white/5">
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
                              <span key={i} className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-[10px] text-emerald-300 font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* PATHFORGE ROADMAP INTEGRATION */}
                        {job.missingSkills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1 mr-1">
                              <AlertTriangle size={13} /> Missing:
                            </span>
                            {job.missingSkills.map((s, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  go?.("roadmap");
                                }}
                                title={`Click to learn ${s} on your PathForge Roadmap`}
                                className="px-2.5 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] text-amber-300 font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-sm shadow-amber-500/5"
                              >
                                {s} <ArrowRight size={10} className="opacity-80" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Action Bar */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Source: <span className="text-slate-300 font-semibold">{job.source}</span>
                      </span>

                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-[#04121a] rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:scale-105 active:scale-95 cursor-pointer"
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
      <div className="flex items-center justify-between pt-1">
        {/* Indicators Dots */}
        <div className="flex items-center gap-1.5">
          {dotIndices.map((i) => {
            const isActive = i === currentIndex;
            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 w-7 shadow-[0_0_12px_rgba(34,211,238,0.5)]" 
                    : "bg-white/20 hover:bg-white/40 w-2.5"
                }`}
              />
            );
          })}
        </div>

        {/* View All Jobs Action */}
        <button
          onClick={() => go?.("jobs")}
          className="text-xs font-bold text-cyan-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer group"
        >
          View All Job Notifications <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}

export default HomeJobCarousel;
