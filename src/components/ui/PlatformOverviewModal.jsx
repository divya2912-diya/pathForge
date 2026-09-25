import React from "react";
import {
  X, LayoutDashboard, Target, Route, BookOpen, FileCheck,
  Code2, Award, Rocket, FileText, Briefcase, ArrowRight, Compass
} from "lucide-react";
import { getTranslation } from "../../services/i18nService";

const PAGES_OVERVIEW = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    color: "#22d3ee",
    title: "Dashboard",
    desc: "Real-time command center monitoring your career readiness score, learning streaks, assessment average, and active study consistency."
  },
  {
    id: "skills",
    icon: Target,
    color: "#f59e0b",
    title: "Skill Gap Analysis",
    desc: "Compares your current mastered skills against target career requirements to pinpoint missing technical gaps needing attention."
  },
  {
    id: "roadmap",
    icon: Route,
    color: "#a855f7",
    title: "Learning Roadmap",
    desc: "Structured step-by-step learning nodes customized for your target career. Features offline caching and background progress syncing."
  },
  {
    id: "resources",
    icon: BookOpen,
    color: "#3b82f6",
    title: "Learning Resources",
    desc: "Curated documentation, video lectures, and coding problem sets filtered to close your specific high-priority skill gaps."
  },
  {
    id: "assessment",
    icon: FileCheck,
    color: "#10b981",
    title: "Knowledge Assessments",
    desc: "Adaptive quizzes testing real topic understanding. Dynamically calculates scores and identifies weak academic topics."
  },
  {
    id: "projects",
    icon: Code2,
    color: "#ec4899",
    title: "Portfolio Projects",
    desc: "Hands-on project recommendations tailored to build a job-ready portfolio for your chosen career goal."
  },
  {
    id: "certifications",
    icon: Award,
    color: "#8b5cf6",
    title: "Certifications",
    desc: "Track verified course certificates and industry certifications to boost your dynamic career match score."
  },
  {
    id: "career",
    icon: Rocket,
    color: "#f97316",
    title: "Career Readiness",
    desc: "AI-driven career intelligence tool analyzing career paths, supporting dynamic career switching and readiness evaluation."
  },
  {
    id: "resume",
    icon: FileText,
    color: "#06b6d4",
    title: "Resume Intelligence",
    desc: "AI resume scanner evaluating your resume against job specifications and detailing exact missing skills."
  },
  {
    id: "jobs",
    icon: Briefcase,
    color: "#84cc16",
    title: "Job Notifications",
    desc: "Live industry job openings matching your current skills and career readiness score with direct apply links."
  },
];

export function PlatformOverviewModal({ open, onClose, onSelectPage, language = "en" }) {
  if (!open) return null;

  const t = (key) => getTranslation(key, language);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl lp-glass-strong p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 max-h-[90vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-[#04121a] shrink-0">
              <Compass size={24} />
            </div>
            <div>
              <h2 className="lp-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-300 via-white to-blue-200 bg-clip-text text-transparent">
                PathForge Platform Overview & Page Connectivity
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Explore all 10 core pages and features before navigating your step-by-step learning journey.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Overview Grid */}
        <div className="flex-1 overflow-y-auto lp-scrollbar py-6 grid sm:grid-cols-2 lg:grid-cols-2 gap-4 pr-1">
          {PAGES_OVERVIEW.map((page, idx) => {
            const Icon = page.icon;
            const title = getTranslation(`nav.${page.id}`, language) !== `nav.${page.id}`
              ? getTranslation(`nav.${page.id}`, language)
              : page.title;

            return (
              <div
                key={page.id}
                onClick={() => {
                  onSelectPage(page.id);
                  onClose();
                }}
                className="group p-5 rounded-2xl lp-glass hover:bg-slate-800/70 border border-white/10 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: `${page.color}18`, border: `1px solid ${page.color}40` }}
                      >
                        <Icon size={18} style={{ color: page.color }} />
                      </div>
                      <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        Page {idx + 1}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 group-hover:bg-cyan-500 group-hover:text-black transition-colors flex items-center gap-1">
                      Open Page <ArrowRight size={12} />
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {page.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <span className="text-xs text-slate-400">
            Click any page card above to open it directly, or start the guided flow below.
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
            >
              Close Overview
            </button>
            <button
              onClick={() => {
                onSelectPage("dashboard");
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-[#04121a] bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 hover:brightness-110 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Guided Flow (Dashboard)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PlatformOverviewModal;
