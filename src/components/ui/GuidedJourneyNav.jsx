import React from "react";
import { ChevronLeft, ChevronRight, Compass, CheckCircle2 } from "lucide-react";
import { getTranslation } from "../../services/i18nService";

const JOURNEY_STEPS = [
  { id: "dashboard", icon: "📊" },
  { id: "skills", icon: "🎯" },
  { id: "roadmap", icon: "🗺️" },
  { id: "resources", icon: "📚" },
  { id: "assessment", icon: "📝" },
  { id: "projects", icon: "💻" },
  { id: "certifications", icon: "📜" },
  { id: "career", icon: "🚀" },
  { id: "resume", icon: "📄" },
  { id: "jobs", icon: "💼" },
];

export function GuidedJourneyNav({ active, go, language = "en" }) {
  const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === active);

  // If viewing profile or settings, don't display stepper bar
  if (currentIndex === -1) return null;

  const prevStep = currentIndex > 0 ? JOURNEY_STEPS[currentIndex - 1] : null;
  const nextStep = currentIndex < JOURNEY_STEPS.length - 1 ? JOURNEY_STEPS[currentIndex + 1] : JOURNEY_STEPS[0];

  const getStepTitle = (stepId) => {
    const translated = getTranslation(`nav.${stepId}`, language);
    if (translated && translated !== `nav.${stepId}`) return translated;

    const titles = {
      dashboard: "Dashboard",
      skills: "Skill Gap",
      roadmap: "Learning Roadmap",
      resources: "Resources",
      assessment: "Assessments",
      projects: "Projects",
      certifications: "Certifications",
      career: "Career Readiness",
      resume: "Resume Intelligence",
      jobs: "Job Notifications",
    };
    return titles[stepId] || stepId;
  };

  return (
    <div className="mb-6 lp-glass p-3.5 rounded-2xl border border-cyan-500/20 shadow-lg shadow-cyan-950/20">
      {/* Top Header Stepper Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
            <Compass size={16} />
          </div>
          <div>
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider block">
              Guided Learning Flow · Step {currentIndex + 1} of {JOURNEY_STEPS.length}
            </span>
            <span className="text-sm font-bold text-white">
              {JOURNEY_STEPS[currentIndex].icon} {getStepTitle(active)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {prevStep && (
            <button
              onClick={() => go(prevStep.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ChevronLeft size={14} /> {getStepTitle(prevStep.id)}
            </button>
          )}

          <button
            onClick={() => go(nextStep.id)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#04121a] bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 hover:brightness-110 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Next: {getStepTitle(nextStep.id)}</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Step Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 lp-scrollbar">
        {JOURNEY_STEPS.map((step, idx) => {
          const isActive = idx === currentIndex;
          const isPassed = idx < currentIndex;
          return (
            <button
              key={step.id}
              onClick={() => go(step.id)}
              title={`Go to ${getStepTitle(step.id)}`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm shadow-cyan-500/30"
                  : isPassed
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{step.icon}</span>
              <span className="hidden sm:inline">{getStepTitle(step.id)}</span>
              {isPassed && <CheckCircle2 size={11} className="text-emerald-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function GuidedJourneyFooter({ active, go, language = "en" }) {
  const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === active);
  if (currentIndex === -1) return null;

  const nextStep = currentIndex < JOURNEY_STEPS.length - 1 ? JOURNEY_STEPS[currentIndex + 1] : JOURNEY_STEPS[0];
  const prevStep = currentIndex > 0 ? JOURNEY_STEPS[currentIndex - 1] : null;

  const getStepTitle = (stepId) => {
    const translated = getTranslation(`nav.${stepId}`, language);
    if (translated && translated !== `nav.${stepId}`) return translated;
    const titles = {
      dashboard: "Dashboard",
      skills: "Skill Gap",
      roadmap: "Learning Roadmap",
      resources: "Resources",
      assessment: "Assessments",
      projects: "Projects",
      certifications: "Certifications",
      career: "Career Readiness",
      resume: "Resume Intelligence",
      jobs: "Job Notifications",
    };
    return titles[stepId] || stepId;
  };

  return (
    <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 lp-glass p-5 rounded-2xl">
      <div>
        <span className="text-xs text-slate-400 font-medium block">Step {currentIndex + 1} of {JOURNEY_STEPS.length} Completed</span>
        <h4 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
          <span>Ready for the next step in your learning path?</span>
        </h4>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {prevStep && (
          <button
            onClick={() => {
              go(prevStep.id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ChevronLeft size={16} /> Back to {getStepTitle(prevStep.id)}
          </button>
        )}
        <button
          onClick={() => {
            go(nextStep.id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#04121a] bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 hover:brightness-110 shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to {getStepTitle(nextStep.id)}</span>
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}

export default GuidedJourneyNav;
