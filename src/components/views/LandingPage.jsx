import React from "react";
import {
  Flame, Sparkles, ArrowRight, Radar, Route, LayoutGrid, FileText,
  Compass, ShieldCheck, AlertTriangle, User, LogIn, CheckCircle2
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import FloatingCard from "../ui/FloatingCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import { SKILL_REQUIREMENTS, CAREER_ROADMAPS } from "../../data/userProfile";
import { HomeJobCarousel } from "./HomeJobCarousel";
import { LanguageSelector } from "../ui/LanguageSelector";
import { getTranslation } from "../../services/i18nService";
import { PlatformOverviewModal } from "../ui/PlatformOverviewModal";

function getRequiredSkillsForCareer(targetCareer) {
  if (!targetCareer) return [];
  if (SKILL_REQUIREMENTS[targetCareer]) return SKILL_REQUIREMENTS[targetCareer];
  
  const careerLower = targetCareer.toLowerCase();
  if (careerLower.includes("react") || careerLower.includes("frontend")) {
    return ["JavaScript", "React", "HTML/CSS", "Git", "TypeScript", "REST APIs"];
  }
  if (careerLower.includes("node") || careerLower.includes("backend") || careerLower.includes("python")) {
    return ["Python", "Node.js", "SQL", "REST APIs", "Git", "System Design", "Docker"];
  }
  if (careerLower.includes("ai") || careerLower.includes("ml") || careerLower.includes("data")) {
    return ["Python", "Machine Learning", "Statistics", "SQL", "Deep Learning", "Docker"];
  }
  return ["Problem Solving", "Git", "Data Structures", "System Design", "SQL"];
}

function RevealSection({ children, className = "" }) {
  const ref = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
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

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function LandingPage({ onStart, onExplore, onProfile, student, onLogin, onUpdateStudent, go, language = "en", onLanguageChange }) {
  const t = (key) => getTranslation(key, language);
  const [showOverviewModal, setShowOverviewModal] = React.useState(false);

  // Extract real dynamic user data (Single Source of Truth)
  const userSkills = Array.isArray(student?.skills) ? student.skills : [];
  
  // Box 1: Top-Left Skill
  const skill1 = userSkills[0];
  const skill1Mastery = student?.skillMastery?.[skill1] ?? student?.assessments?.[skill1]?.score;

  // Box 2: Top-Right Skill
  const skill2 = userSkills[1];
  const skill2Mastery = student?.skillMastery?.[skill2] ?? student?.assessments?.[skill2]?.score;

  // Box 3: Roadmap Node
  let nextRoadmapStep = null;
  if (student?.targetCareer) {
    const roadmapList = student?.roadmap || CAREER_ROADMAPS[student.targetCareer] || [];
    const activeStep = roadmapList.find(r => r.status === "in-progress" || r.status === "upcoming");
    if (activeStep) {
      nextRoadmapStep = activeStep.title;
    } else if (roadmapList.length > 0) {
      nextRoadmapStep = roadmapList[0].title;
    }
  }

  // Box 4: Skill Gap Analysis
  let topSkillGap = null;
  let hasNoGaps = false;
  if (student?.targetCareer) {
    const reqSkills = getRequiredSkillsForCareer(student.targetCareer);
    const userSkillSet = new Set(userSkills.map(s => String(s).toLowerCase().trim()));
    const missing = reqSkills.filter(req => !userSkillSet.has(req.toLowerCase().trim()));
    if (missing.length > 0) {
      topSkillGap = missing[0];
    } else if (reqSkills.length > 0) {
      hasNoGaps = true;
    }
  }

  // Box 5: Career Match / Goal
  const targetCareer = student?.targetCareer;
  const realReadinessScore = typeof student?.readinessScore === "number" 
    ? student.readinessScore 
    : (typeof student?.readiness === "number" ? student.readiness : null);

  return (
    <div className="relative overflow-hidden">
      <div className="lp-noise" />
      {/* ambient glows */}
      <div
        className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.16), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14), transparent 70%)" }}
      />

      {/* NAV */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-[50px] md:h-[50px] rounded-xl sm:rounded-[14px] md:rounded-[16px] flex items-center justify-center shadow-lg relative overflow-hidden shrink-0"
            style={{ background: "linear-gradient(135deg, #22d3ee, #3b82f6 50%, #f97316)" }}
          >
            <Flame
              size={28}
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              color="#04121a"
              fill="#04121a"
            />
          </div>
          <span className="lp-display font-bold tracking-tight text-xl sm:text-[22px] md:text-[26px] leading-none bg-gradient-to-r from-cyan-300 via-blue-200 to-orange-400 bg-clip-text text-transparent select-none">
            PathForge
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector currentLang={language} onLanguageChange={onLanguageChange} />
          {student ? (
            <>
              <span className="hidden sm:inline text-xs text-slate-400">
                {t("landing.welcomeBack")}, <span className="text-white font-medium">{student.name?.split(" ")[0]}</span>
              </span>
              <button
                onClick={onProfile}
                aria-label="View Profile"
                title={`${student.name || t("common.profile")}`}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer group shrink-0 overflow-hidden"
                style={{
                  background: student?.profilePicture ? "transparent" : "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(139,92,246,0.18))",
                  border: "1px solid rgba(34,211,238,0.35)",
                  boxShadow: "0 0 15px -3px rgba(34,211,238,0.25)",
                }}
              >
                {student?.profilePicture ? (
                  <img src={student.profilePicture} alt={student.name || t("common.profile")} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-xs font-bold text-cyan-300 select-none">
                    {student?.name?.slice(0, 2).toUpperCase() || "ME"}
                  </span>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#060911]" />
              </button>
            </>
          ) : (
            <button
              id="btn-landing-signin"
              onClick={onLogin}
              className="lp-btn-ghost px-3.5 py-2 rounded-xl text-xs sm:text-sm text-cyan-300 hover:text-white border border-cyan-400/30 hover:border-cyan-400/60 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm shadow-cyan-500/10"
            >
              <LogIn size={15} /> {t("common.signIn")}
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-28 grid md:grid-cols-2 gap-14 items-center">
        <div className="lp-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.25)", color: "#67e8f9" }}>
            <Sparkles size={13} /> {t("landing.badge")}
          </div>
          {student && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4 ml-3" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399" }}>
              {t("landing.welcomeBack")}, {student.name?.split(" ")[0]}! 👋
            </div>
          )}
          <h1 className="lp-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-semibold tracking-tight">
            {t("landing.heroTitle1")}
            <br />
            <span className="lp-gradient-text">{t("landing.heroTitle2")}</span>
          </h1>
          <p className="mt-6 text-base md:text-lg max-w-lg" style={{ color: "var(--text-dim)" }}>
            {t("landing.heroSubtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <button
              id="btn-landing-start"
              onClick={onStart}
              className="lp-btn-primary px-6 py-3.5 rounded-xl flex items-center gap-2 text-[15px] cursor-pointer"
            >
              {student?.onboardingComplete ? t("landing.continueJourney") : t("landing.buildPath")} <ArrowRight size={17} />
            </button>
            <button
              id="btn-landing-explore"
              onClick={() => setShowOverviewModal(true)}
              className="lp-btn-ghost px-5 py-3.5 rounded-xl text-[14px] text-slate-300 hover:text-white cursor-pointer"
            >
              {t("landing.explorePlatform")}
            </button>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="relative h-[440px] md:h-[520px] lp-fade-up" style={{ animationDelay: ".15s" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="lp-orb lp-spin-slow rounded-full"
              style={{
                width: 210, height: 210,
                background: "radial-gradient(circle at 35% 30%, rgba(103,232,249,0.55), rgba(139,92,246,0.35) 55%, rgba(6,9,17,0.1) 75%)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{ width: 90, height: 90, background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(103,232,249,0.4))", filter: "blur(1px)" }}
            />
          </div>

          {/* connection lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.35 }}>
            <line x1="18%" y1="20%" x2="48%" y2="46%" stroke="#67e8f9" strokeWidth="1" strokeDasharray="4 5" />
            <line x1="82%" y1="18%" x2="55%" y2="45%" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="4 5" />
            <line x1="12%" y1="78%" x2="48%" y2="55%" stroke="#67e8f9" strokeWidth="1" strokeDasharray="4 5" />
            <line x1="85%" y1="80%" x2="55%" y2="56%" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="4 5" />
          </svg>

          {/* 1. TOP-LEFT BOX: USER SKILL 1 */}
          <FloatingCard onClick={onStart} className="lp-float-1 cursor-pointer hover:scale-105 transition-all" style={{ top: "6%", left: "2%" }}>
            {skill1 ? (
              <>
                <p className="text-xs text-slate-400 font-medium">{skill1}</p>
                <p className="lp-display text-base sm:text-lg font-semibold text-cyan-300">
                  {typeof skill1Mastery === "number" ? `${skill1Mastery}% ${t("landing.mastery")}` : t("landing.skillAdded")}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-400 font-medium">{t("landing.noSkills")}</p>
                <p className="lp-display text-xs sm:text-sm font-semibold text-cyan-300">{t("landing.completeProfile")}</p>
              </>
            )}
          </FloatingCard>

          {/* 2. TOP-RIGHT BOX: USER SKILL 2 */}
          <FloatingCard onClick={onStart} className="lp-float-2 cursor-pointer hover:scale-105 transition-all" style={{ top: "2%", right: "0%" }}>
            {skill2 ? (
              <>
                <p className="text-xs text-slate-400 font-medium">{skill2}</p>
                <p className="lp-display text-base sm:text-lg font-semibold text-blue-300">
                  {typeof skill2Mastery === "number" ? `${skill2Mastery}% ${t("landing.mastery")}` : t("landing.skillAdded")}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-400 font-medium">{t("landing.addMoreSkills")}</p>
                <p className="lp-display text-xs sm:text-sm font-semibold text-blue-300">{t("landing.updateProfile")}</p>
              </>
            )}
          </FloatingCard>

          {/* 3. LEFT-MIDDLE BOX: ROADMAP NODE (CLICKABLE) */}
          <FloatingCard onClick={onStart} className="lp-float-2 cursor-pointer hover:scale-105 transition-all" style={{ top: "42%", left: "-4%", animationDelay: ".6s" }}>
            {nextRoadmapStep ? (
              <>
                <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-medium">
                  <Route size={12} color="#67e8f9" /> {t("landing.nextStep")}
                </div>
                <p className="lp-display text-xs sm:text-sm font-semibold text-white mt-0.5">
                  {nextRoadmapStep}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Route size={12} color="#94a3b8" /> {t("landing.roadmap")}
                </div>
                <p className="text-xs mt-0.5 text-slate-300 font-medium">
                  {student ? t("landing.completeOnboarding") : t("landing.completeProfile")}
                </p>
              </>
            )}
          </FloatingCard>

          {/* 4. LEFT-BOTTOM BOX: SKILL GAP */}
          <FloatingCard onClick={onStart} className="lp-float-3 cursor-pointer hover:scale-105 transition-all" style={{ bottom: "20%", left: "-2%" }}>
            {topSkillGap ? (
              <>
                <div className="flex items-center gap-1.5 text-amber-300 text-xs mb-1 font-medium">
                  <AlertTriangle size={12} /> {t("landing.skillGapDetected")}
                </div>
                <p className="lp-display text-xs sm:text-sm font-medium text-white">
                  → {topSkillGap}
                </p>
              </>
            ) : hasNoGaps ? (
              <>
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs mb-1 font-medium">
                  <CheckCircle2 size={12} /> {t("landing.noGaps")}
                </div>
                <p className="lp-display text-xs sm:text-sm font-medium text-emerald-300">
                  {t("landing.onTrack")}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1 font-medium">
                  <AlertTriangle size={12} /> {t("landing.skillGapAnalysis")}
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {t("landing.waitingProfile")}
                </p>
              </>
            )}
          </FloatingCard>

          {/* 5. BOTTOM-RIGHT BOX: CAREER MATCH */}
          <FloatingCard onClick={onStart} className="lp-float-1 cursor-pointer hover:scale-105 transition-all" style={{ bottom: "8%", right: "2%", animationDelay: "1.2s" }}>
            {targetCareer ? (
              <>
                <p className="text-xs text-slate-400 font-medium">
                  {typeof realReadinessScore === "number" ? t("landing.careerReadiness") : t("landing.careerGoal")}
                </p>
                <p className="lp-display text-xs sm:text-sm font-semibold" style={{ color: "#c4b5fd" }}>
                  {targetCareer}
                  {typeof realReadinessScore === "number" && ` · ${realReadinessScore}%`}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-400 font-medium">{t("landing.targetCareer")}</p>
                <p className="lp-display text-xs sm:text-sm font-semibold text-purple-300">{t("landing.notSet")}</p>
              </>
            )}
          </FloatingCard>
        </div>
      </div>

      {/* WHAT THE PLATFORM DOES */}
      <RevealSection className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <SectionHeader eyebrow={t("landing.eyebrow")} title={t("landing.sectionTitle")} subtitle={t("landing.sectionSubtitle")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Radar, title: t("landing.skillProfilingTitle"), desc: t("landing.skillProfilingDesc") },
            { icon: Route, title: t("landing.adaptiveRoadmapTitle"), desc: t("landing.adaptiveRoadmapDesc") },
            { icon: LayoutGrid, title: t("landing.resourceMatchingTitle"), desc: t("landing.resourceMatchingDesc") },
            { icon: Sparkles, title: t("landing.adaptiveAssessmentsTitle"), desc: t("landing.adaptiveAssessmentsDesc") },
            { icon: FileText, title: t("landing.resumeIntelligenceTitle"), desc: t("landing.resumeIntelligenceDesc") },
            { icon: Compass, title: t("landing.careerMatchingTitle"), desc: t("landing.careerMatchingDesc") },
          ].map(({ icon: Icon, title, desc }) => (
            <GlassCard key={title} hover className="p-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(34,211,238,0.1)" }}>
                <Icon size={18} color="#67e8f9" />
              </div>
              <p className="text-sm font-semibold mb-1.5">{title}</p>
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>{desc}</p>
            </GlassCard>
          ))}
        </div>
      </RevealSection>

      {/* LIVE JOB NOTIFICATIONS CAROUSEL */}
      <RevealSection className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <HomeJobCarousel 
          student={student} 
          onUpdateStudent={onUpdateStudent} 
          go={go || onExplore} 
        />
      </RevealSection>

      {/* TRUSTED AI */}
      <RevealSection className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-28">
        <GlassCard strong className="p-8 md:p-10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} color="#34d399" />
            <span className="lp-display font-semibold">{t("landing.trustedTitle")}</span>
          </div>
          <p className="text-sm mb-8 max-w-xl" style={{ color: "var(--text-dim)" }}>
            {t("landing.trustedSubtitle")}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-6">
            {[t("landing.step1"), t("landing.step2"), t("landing.step3"), t("landing.step4")].map((step, i, arr) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ background: i === arr.length - 1 ? "#34d399" : "#67e8f9" }} />
                  {step}
                </div>
                {i < arr.length - 1 && <ArrowRight size={16} className="hidden sm:block" style={{ color: "var(--text-dim)" }} />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-8">
            {[t("landing.pillDoc"), t("landing.pillAcademic"), t("landing.pillCourses"), t("landing.pillIndustry")].map(s => <Pill key={s}>{s}</Pill>)}
          </div>
        </GlassCard>
      </RevealSection>

      <PlatformOverviewModal
        open={showOverviewModal}
        onClose={() => setShowOverviewModal(false)}
        onSelectPage={(pageId) => {
          if (go) go(pageId);
          else if (onExplore) onExplore(pageId);
        }}
        language={language}
      />
    </div>
  );
}

export default LandingPage;
