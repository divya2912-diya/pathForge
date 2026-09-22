import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

export function AnalyzingScreen({ onDone, student, onboardingData }) {
  const targetCareer = onboardingData?.career || onboardingData?.targetCareer || student?.targetCareer || "Software Engineer";
  const skillsCount = onboardingData?.skills?.length ?? student?.skills?.length ?? 0;
  const projectsCount = onboardingData?.projectsList?.length ?? student?.projectsList?.length ?? 0;
  const certsCount = onboardingData?.certificationsList?.length ?? student?.certificationsList?.length ?? 0;

  const stages = [
    `Reading your profile (${targetCareer})`,
    `Mapping your ${skillsCount} selected skill${skillsCount !== 1 ? "s" : ""}`,
    `Identifying skill gaps for ${targetCareer}`,
    `Analyzing your experience (${projectsCount} project${projectsCount !== 1 ? "s" : ""}, ${certsCount} certification${certsCount !== 1 ? "s" : ""})`,
    "Building your learning roadmap",
    "Preparing recommendations",
  ];

  const [completedIdx, setCompletedIdx] = useState(-1);

  useEffect(() => {
    if (completedIdx >= stages.length - 1) {
      const t = setTimeout(onDone, 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCompletedIdx(i => i + 1);
    }, 600);
    return () => clearTimeout(t);
  }, [completedIdx, stages.length, onDone]);

  const progress = Math.min(100, Math.round(((completedIdx + 1) / stages.length) * 100));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 45%, rgba(34,211,238,0.1), transparent 60%)" }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        {/* Animated orb */}
        <div
          className="lp-orb lp-spin-slow rounded-full mb-8 shrink-0"
          style={{
            width: 120,
            height: 120,
            background: "radial-gradient(circle at 35% 30%, rgba(103,232,249,0.7), rgba(139,92,246,0.4) 60%, transparent 75%)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 0 40px rgba(34,211,238,0.25)",
          }}
        />

        <h2 className="lp-display text-2xl font-bold mb-1 text-white">
          Building your PathForge career plan
        </h2>
        <p className="text-xs mb-8" style={{ color: "var(--text-dim)" }}>
          Analyzing your skills, experience and target career...
        </p>

        {/* Stage list */}
        <div className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 mb-8 text-left space-y-3">
          {stages.map((stageText, idx) => {
            const isDone = idx <= completedIdx;
            const isCurrent = idx === completedIdx + 1;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 text-xs transition-all duration-300"
                style={{
                  opacity: isDone ? 1 : isCurrent ? 0.9 : 0.35,
                  color: isDone ? "#67e8f9" : isCurrent ? "#ffffff" : "var(--text-dim)",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold transition-all"
                  style={{
                    background: isDone
                      ? "rgba(34,211,238,0.2)"
                      : isCurrent
                      ? "rgba(139,92,246,0.2)"
                      : "rgba(255,255,255,0.05)",
                    border: isDone
                      ? "1px solid rgba(34,211,238,0.5)"
                      : isCurrent
                      ? "1px solid rgba(139,92,246,0.5)"
                      : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {isDone ? (
                    <Check size={11} color="#67e8f9" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                  )}
                </div>
                <span className="font-medium truncate">{stageText}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #22d3ee, #8b5cf6)",
              width: `${progress}%`,
              transition: "width .5s ease-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AnalyzingScreen;
