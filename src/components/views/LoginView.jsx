import React, { useState } from "react";
import {
  Flame, Sparkles, ArrowRight, ArrowLeft, Lock, Mail, CheckCircle2,
  AlertCircle, GraduationCap, Eye, EyeOff, ShieldCheck, UserCheck
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Pill from "../ui/Pill";
import { DEMO_STUDENT_CREDENTIALS, STUDENT } from "../../data/mockData";

export default function LoginView({
  onDemoLogin,
  onStudentLogin,
  onBackToHome,
  onStartOnboarding,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickFill = () => {
    setEmail(DEMO_STUDENT_CREDENTIALS.email);
    setPassword(DEMO_STUDENT_CREDENTIALS.password);
    setError("");
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your Student Email or ID");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError("");
    // Simulate brief authentication check
    setTimeout(() => {
      setIsLoading(false);
      onStudentLogin({ email: email.trim(), rememberMe });
    }, 400);
  };

  return (
    <div className="relative min-h-screen bg-[#060911] text-[#eef1f7] overflow-hidden flex flex-col justify-between">
      <div className="lp-noise" />

      {/* Ambient background glows */}
      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.16), transparent 70%)" }}
      />
      <div
        className="absolute bottom-10 -right-40 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)" }}
      />

      {/* Top Navigation */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto w-full">
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

        <button
          onClick={onBackToHome}
          className="lp-btn-ghost px-4 py-2 rounded-xl text-xs sm:text-sm text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </header>

      {/* Main Login Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-5 py-8 w-full lp-fade-up flex-1 flex flex-col justify-center">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="lp-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Welcome to <span className="lp-gradient-text">PathForge</span>
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-dim)" }}>
            Our platform is built specifically for <strong>Students</strong>. Choose an option below to sign in or explore instantly.
          </p>
        </div>

        {/* Dual Login Grid */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* OPTION 1: DEMO LOGIN (For Hackathon Judges) */}
          <div
            className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group"
            style={{
              background: "linear-gradient(145deg, rgba(34,211,238,0.09), rgba(139,92,246,0.12), rgba(6,9,17,0.85))",
              border: "1px solid rgba(34,211,238,0.35)",
              boxShadow: "0 0 35px -5px rgba(34,211,238,0.18)",
            }}
          >
            {/* Top accent badge */}
            <div className="flex items-center justify-between gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 uppercase tracking-wider">
                <Sparkles size={13} className="text-cyan-300" /> Fast-Track
              </span>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> Zero Credentials
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <UserCheck size={20} />
                </div>
                <h2 className="lp-display text-xl sm:text-2xl font-semibold text-white">
                  Demo Login
                </h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: "var(--text-dim)" }}>
                Designed specifically for <strong>Hackathon Judges</strong> to enter instantly without registration or typing credentials.
              </p>

              {/* Pre-loaded features */}
              <div className="space-y-2.5 mb-8">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Pre-configured Student</span>
                  <span className="text-cyan-300 font-medium">Alex Chen (3rd Year CS)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">AI Career Target</span>
                  <span className="text-violet-300 font-medium">AI/ML Engineer · 94% Match</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Action Plan</span>
                  <span className="text-amber-300 font-medium">Role Gap-to-Hire (3 milestones)</span>
                </div>
              </div>
            </div>

            <button
              onClick={onDemoLogin}
              className="lp-btn-primary w-full py-3.5 px-5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/35 transition-all"
            >
              <Sparkles size={16} /> Enter pathForge <ArrowRight size={16} />
            </button>
          </div>

          {/* OPTION 2: STUDENT LOGIN */}
          <GlassCard className="p-6 sm:p-7 flex flex-col justify-between" hover>
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 text-slate-300 border border-white/10 uppercase tracking-wider">
                  <GraduationCap size={13} /> Registered
                </span>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
                >
                  Fill Demo Credentials
                </button>
              </div>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-violet-400/10 border border-violet-400/30 flex items-center justify-center text-violet-300">
                  <Lock size={18} />
                </div>
                <h2 className="lp-display text-xl sm:text-2xl font-semibold text-white">
                  Student Login
                </h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: "var(--text-dim)" }}>
                Sign in with your university student email or student ID to access your personalized roadmap.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Student Email / ID
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="e.g. alex.chen@university.edu"
                      className="lp-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="Enter your student password"
                      className="lp-input w-full pl-10 pr-10 py-2.5 rounded-xl text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 cursor-pointer"
                    />
                    Remember this device
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="lp-btn-primary w-full py-3 px-5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
                >
                  {isLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      Sign In as Student <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <p className="text-xs text-slate-400">
                New student?{" "}
                <button
                  type="button"
                  onClick={onStartOnboarding}
                  className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline cursor-pointer"
                >
                  Build your learning path
                </button>
              </p>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
