import React from "react";
import {
  X, LayoutDashboard, Target, Route, BookOpen, FileCheck,
  Code2, Award, Rocket, FileText, Briefcase, ArrowRight, Compass,
  Globe, WifiOff, Bot
} from "lucide-react";
import { getTranslation } from "../../services/i18nService";

const PAGES_OVERVIEW = [
  {
    id: "career",
    icon: Rocket,
    color: "#f97316",
    title: "AI-Powered Career Analysis",
    desc: "Analyze your profile, skills, and target career direction using real AI intelligence to map ideal software engineering outcomes.",
    actionText: "Analyze Career"
  },
  {
    id: "skills",
    icon: Target,
    color: "#f59e0b",
    title: "Personalized Learning Path",
    desc: "Generates a customized skill progression blueprint based on your career goals, target role requirements, and current abilities.",
    actionText: "View Learning Path"
  },
  {
    id: "roadmap",
    icon: Route,
    color: "#a855f7",
    title: "Adaptive Learning Roadmap",
    desc: "Interactive visual roadmap with skill node progression, stage milestones, resource integration, and unlockable stages.",
    actionText: "Explore Learning Roadmap"
  },
  {
    id: "assessment",
    icon: FileCheck,
    color: "#10b981",
    title: "Skill Validation Assessments",
    desc: "Prove proficiency through 2-round assessment rounds to validate existing knowledge and skip topics you already master.",
    actionText: "Try Skill Assessment"
  },
  {
    id: "analytics",
    icon: LayoutDashboard,
    color: "#3b82f6",
    title: "Learning Analytics",
    desc: "Track real-time learning progress, topic completion stats, assessment performance, and overall career readiness growth.",
    actionText: "View Analytics"
  },
  {
    id: "dashboard",
    icon: Bot,
    color: "#22d3ee",
    title: "AI Mentor",
    desc: "Context-aware academic and career mentor providing personalized recommendations based on your actual PathForge profile.",
    actionText: "Ask AI Mentor"
  },
  {
    id: "resume",
    icon: FileText,
    color: "#06b6d4",
    title: "Resume Intelligence",
    desc: "Upload and analyze real resumes to extract skills, detect missing competencies, match job descriptions, and auto-update your profile.",
    actionText: "Analyze Resume"
  },
  {
    id: "jobs",
    icon: Briefcase,
    color: "#84cc16",
    title: "Job Opportunities",
    desc: "Discover matching real-world job openings organized by domain, tailored to your readiness score with direct apply options.",
    actionText: "Explore Jobs"
  },
  {
    id: "resources",
    icon: BookOpen,
    color: "#6366f1",
    title: "Certifications & Resources",
    desc: "Discover verified courses, documentation, and certifications tailored to your gaps, and add them directly to your roadmap.",
    actionText: "Explore Resources"
  },
  {
    id: "projects",
    icon: Code2,
    color: "#ec4899",
    title: "Portfolio Projects",
    desc: "Discover and add real-world portfolio projects matching your target domain to prove hands-on expertise to recruiters.",
    actionText: "Explore Projects"
  },
  {
    id: "settings",
    icon: Globe,
    color: "#14b8a6",
    title: "Multilingual Support",
    desc: "Switch the application language anytime (English, Spanish, Hindi, French, German) with real-time dynamic interface translation.",
    actionText: "Language & Settings"
  },
  {
    id: "roadmap",
    icon: WifiOff,
    color: "#eab308",
    title: "Offline Learning",
    desc: "Access cached roadmap topics, saved resources, and milestone progress seamlessly even when internet connectivity is limited.",
    actionText: "View Offline Roadmap"
  },
];

export function PlatformOverviewModal({ open, onClose, onSelectPage, language = "en" }) {
  if (!open) return null;

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
                PathForge Platform Overview & Capabilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Explore all 12 live platform capabilities. Every card opens its functional route directly.
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
        <div className="flex-1 overflow-y-auto lp-scrollbar py-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
          {PAGES_OVERVIEW.map((page, idx) => {
            const Icon = page.icon;

            return (
              <div
                key={`${page.id}-${idx}`}
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
                      <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                        Feature {idx + 1}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {page.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <span className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-black transition-all flex items-center justify-center gap-1.5">
                    {page.actionText} <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <span className="text-xs text-slate-400">
            Click any feature card above to navigate directly to that live section.
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
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PlatformOverviewModal;

