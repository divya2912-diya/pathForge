import React from "react";
import {
  Flame, Sparkles, ArrowRight, Radar, Route, LayoutGrid, FileText,
  Compass, ShieldCheck, AlertTriangle, User, LogIn
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import FloatingCard from "../ui/FloatingCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";

export function LandingPage({ onStart, onExplore, onProfile, student, onLogin, onDemoLogin }) {
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
          <button
            onClick={onLogin}
            className="lp-btn-ghost px-3.5 py-2 rounded-xl text-xs sm:text-sm text-cyan-300 hover:text-white border border-cyan-400/30 hover:border-cyan-400/60 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm shadow-cyan-500/10"
          >
            <LogIn size={15} /> Sign In
          </button>
          <button
            onClick={onProfile}
            aria-label="View Profile"
            title={`${student?.name || "Alex"}'s Profile`}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer group shrink-0 overflow-hidden"
            style={{
              background: student?.profilePicture ? "transparent" : "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(139,92,246,0.18))",
              border: "1px solid rgba(34,211,238,0.35)",
              boxShadow: "0 0 15px -3px rgba(34,211,238,0.25)",
            }}
          >
            {student?.profilePicture ? (
              <img src={student.profilePicture} alt={student.name || "Profile"} className="w-full h-full object-cover rounded-full" />
            ) : (
              <User size={18} className="text-cyan-300 group-hover:scale-110 transition-transform" />
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#060911]" />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-28 grid md:grid-cols-2 gap-14 items-center">
        <div className="lp-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.25)", color: "#67e8f9" }}>
            <Sparkles size={13} /> AI-powered education to employment
          </div>
          <h1 className="lp-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-semibold tracking-tight">
            Your learning path.
            <br />
            <span className="lp-gradient-text">Powered by intelligence.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg max-w-lg" style={{ color: "var(--text-dim)" }}>
            Discover what you know, understand what you're missing, and follow an AI-guided path from learning to career readiness.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <button onClick={onStart} className="lp-btn-primary px-6 py-3.5 rounded-xl flex items-center gap-2 text-[15px] cursor-pointer">
              Build my learning path <ArrowRight size={17} />
            </button>
            <button
              onClick={onDemoLogin}
              className="px-5 py-3.5 rounded-xl text-[14px] text-cyan-300 font-medium flex items-center gap-2 cursor-pointer transition-all group"
              style={{
                background: "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(139,92,246,0.12))",
                border: "1px solid rgba(34,211,238,0.35)",
                boxShadow: "0 0 20px -3px rgba(34,211,238,0.2)",
              }}
            >
              <Sparkles size={16} className="text-cyan-300 group-hover:rotate-12 transition-transform" />
              Enter pathForge
            </button>
            <button onClick={onExplore} className="lp-btn-ghost px-5 py-3.5 rounded-xl text-[14px] text-slate-300 hover:text-white cursor-pointer">
              Explore platform
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

          <FloatingCard className="lp-float-1" style={{ top: "6%", left: "2%" }}>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Python</p>
            <p className="lp-display text-lg font-semibold text-cyan-300">92% Mastery</p>
          </FloatingCard>
          <FloatingCard className="lp-float-2" style={{ top: "2%", right: "0%" }}>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Machine Learning</p>
            <p className="lp-display text-lg font-semibold text-blue-300">67% Mastery</p>
          </FloatingCard>
          <FloatingCard className="lp-float-3" style={{ bottom: "20%", left: "-2%" }}>
            <div className="flex items-center gap-1.5 text-amber-300 text-xs mb-1"><AlertTriangle size={12} /> Skill gap detected</div>
            <p className="lp-display text-sm font-medium">→ Deep Learning</p>
          </FloatingCard>
          <FloatingCard className="lp-float-1" style={{ bottom: "8%", right: "2%", animationDelay: "1.2s" }}>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Career match</p>
            <p className="lp-display text-lg font-semibold" style={{ color: "#c4b5fd" }}>AI Engineer · 94%</p>
          </FloatingCard>
          <FloatingCard className="lp-float-2" style={{ top: "42%", left: "-4%", animationDelay: ".6s" }}>
            <div className="flex items-center gap-1.5 text-xs"><Route size={12} color="#67e8f9" /> Roadmap node</div>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>Statistics → ML</p>
          </FloatingCard>
        </div>
      </div>

      {/* WHAT THE PLATFORM DOES */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <SectionHeader eyebrow="What PathForge does" title="Everything between your last course and your first job" subtitle="One system that reads your profile and keeps every recommendation current as you learn." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Radar, title: "Skill profiling", desc: "Detects what you already know from courses, projects and certifications, then maps strengths and gaps." },
            { icon: Route, title: "Adaptive roadmap", desc: "Sequences exactly what to learn next toward your target career, and reorders itself as you progress." },
            { icon: LayoutGrid, title: "Resource matching", desc: "Surfaces the videos, docs and problem sets most likely to close your specific gaps — with a reason for each." },
            { icon: Sparkles, title: "Adaptive assessments", desc: "Validates real understanding with difficulty that adjusts to you, not a fixed quiz bank." },
            { icon: FileText, title: "Resume intelligence", desc: "Scores your resume against your target role and points out exactly what's missing." },
            { icon: Compass, title: "Career matching", desc: "Compares your skills to real industry requirements and tells you what closes the gap fastest." },
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
      </div>

      {/* TRUSTED AI */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-28">
        <GlassCard strong className="p-8 md:p-10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} color="#34d399" />
            <span className="lp-display font-semibold">Trusted AI knowledge</span>
          </div>
          <p className="text-sm mb-8 max-w-xl" style={{ color: "var(--text-dim)" }}>
            Every recommendation is grounded in retrieval over verified sources — not a hallucinated guess.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-6">
            {["Student question", "AI retrieval", "Verified knowledge", "Personalized answer"].map((step, i, arr) => (
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
            {["Documentation", "Academic Resources", "Verified Courses", "Industry Resources"].map(s => <Pill key={s}>{s}</Pill>)}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default LandingPage;
