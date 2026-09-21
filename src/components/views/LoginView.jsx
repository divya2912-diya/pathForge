import React, { useState } from "react";
import {
  Flame, Sparkles, ArrowRight, Lock, Mail, Eye, EyeOff,
  UserPlus, LogIn, AlertCircle, GraduationCap, User, Check,
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { ONBOARD_CAREERS } from "../../data/mockData";

// ── Helpers ─────────────────────────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function LoginView({ onLogin, onRegister }) {
  const [tab, setTab] = useState("signin"); // signin | signup

  // ── Sign-In state ──────────────────────────────────────────
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siShowPwd, setSiShowPwd] = useState(false);
  const [siRemember, setSiRemember] = useState(true);
  const [siError, setSiError] = useState("");
  const [siLoading, setSiLoading] = useState(false);

  // ── Sign-Up state ──────────────────────────────────────────
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suDegree, setSuDegree] = useState("B.Tech Computer Science");
  const [suYear, setSuYear] = useState("1st Year");
  const [suCareer, setSuCareer] = useState("Software Engineer");
  const [suShowPwd, setSuShowPwd] = useState(false);
  const [suError, setSuError] = useState("");
  const [suLoading, setSuLoading] = useState(false);

  // ── Sign-In Submit ─────────────────────────────────────────
  const handleSignIn = (e) => {
    e.preventDefault();
    setSiError("");
    if (!siEmail.trim()) { setSiError("Please enter your email address."); return; }
    if (!isValidEmail(siEmail)) { setSiError("Please enter a valid email address."); return; }
    if (!siPassword) { setSiError("Please enter your password."); return; }

    setSiLoading(true);
    setTimeout(() => {
      const result = onLogin({ email: siEmail, password: siPassword, remember: siRemember });
      setSiLoading(false);
      if (!result?.success) {
        setSiError(result?.error || "Sign in failed. Please try again.");
      }
    }, 500);
  };

  // ── Sign-Up Submit ─────────────────────────────────────────
  const handleSignUp = (e) => {
    e.preventDefault();
    setSuError("");
    if (!suName.trim()) { setSuError("Please enter your full name."); return; }
    if (!suEmail.trim() || !isValidEmail(suEmail)) { setSuError("Please enter a valid email address."); return; }
    if (suPassword.length < 8) { setSuError("Password must be at least 8 characters."); return; }
    if (suPassword !== suConfirm) { setSuError("Passwords do not match."); return; }

    setSuLoading(true);
    setTimeout(() => {
      const result = onRegister({
        name: suName,
        email: suEmail,
        password: suPassword,
        degree: suDegree,
        year: suYear,
        targetCareer: suCareer,
      });
      setSuLoading(false);
      if (!result?.success) {
        setSuError(result?.error || "Registration failed. Please try again.");
      }
    }, 500);
  };

  return (
    <div className="relative min-h-screen bg-[#060911] text-[#eef1f7] overflow-hidden flex flex-col">
      <div className="lp-noise" />

      {/* Ambient glows */}
      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.15), transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 -right-40 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14), transparent 70%)" }}
      />

      {/* Header */}
      <header className="relative z-20 flex items-center px-6 md:px-12 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #22d3ee, #3b82f6 50%, #f97316)" }}
          >
            <Flame size={22} color="#04121a" fill="#04121a" />
          </div>
          <span className="lp-display font-bold text-xl leading-none bg-gradient-to-r from-cyan-300 via-blue-200 to-orange-400 bg-clip-text text-transparent select-none">
            PathForge
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-md lp-fade-up">

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="lp-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {tab === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm mt-2" style={{ color: "var(--text-dim)" }}>
              {tab === "signin"
                ? "Sign in to continue your learning journey."
                : "Start building your personalized career roadmap."}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="flex items-center mb-6 p-1 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <button
              id="tab-signin"
              onClick={() => { setTab("signin"); setSiError(""); }}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              style={
                tab === "signin"
                  ? { background: "rgba(34,211,238,0.15)", color: "#67e8f9", border: "1px solid rgba(34,211,238,0.35)" }
                  : { color: "var(--text-dim)" }
              }
            >
              <LogIn size={15} /> Sign In
            </button>
            <button
              id="tab-signup"
              onClick={() => { setTab("signup"); setSuError(""); }}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              style={
                tab === "signup"
                  ? { background: "rgba(139,92,246,0.15)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.35)" }
                  : { color: "var(--text-dim)" }
              }
            >
              <UserPlus size={15} /> Create Account
            </button>
          </div>

          {/* ── SIGN IN FORM ────────────────────────────────── */}
          {tab === "signin" && (
            <GlassCard strong className="p-6 sm:p-7">
              {siError && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{siError}</span>
                </div>
              )}
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="signin-email"
                      type="email"
                      value={siEmail}
                      onChange={(e) => { setSiEmail(e.target.value); setSiError(""); }}
                      placeholder="you@example.com"
                      className="lp-input w-full py-2.5 pl-10 pr-4 rounded-xl text-sm"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="signin-password"
                      type={siShowPwd ? "text" : "password"}
                      value={siPassword}
                      onChange={(e) => { setSiPassword(e.target.value); setSiError(""); }}
                      placeholder="Enter your password"
                      className="lp-input w-full py-2.5 pl-10 pr-10 rounded-xl text-sm"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setSiShowPwd(!siShowPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {siShowPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2 text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                    <input
                      type="checkbox"
                      checked={siRemember}
                      onChange={(e) => setSiRemember(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 cursor-pointer"
                    />
                    Remember me on this device
                  </label>
                </div>

                <button
                  id="btn-signin-submit"
                  type="submit"
                  disabled={siLoading}
                  className="lp-btn-primary w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                >
                  {siLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <>Sign In <ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-white/5 text-center">
                <p className="text-xs text-slate-400">
                  New to PathForge?{" "}
                  <button
                    onClick={() => { setTab("signup"); setSiError(""); }}
                    className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline cursor-pointer"
                  >
                    Create a free account
                  </button>
                </p>
              </div>
            </GlassCard>
          )}

          {/* ── SIGN UP FORM ────────────────────────────────── */}
          {tab === "signup" && (
            <GlassCard strong className="p-6 sm:p-7">
              {suError && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{suError}</span>
                </div>
              )}
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="signup-name"
                      type="text"
                      value={suName}
                      onChange={(e) => { setSuName(e.target.value); setSuError(""); }}
                      placeholder="Your full name"
                      className="lp-input w-full py-2.5 pl-10 pr-4 rounded-xl text-sm"
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="signup-email"
                      type="email"
                      value={suEmail}
                      onChange={(e) => { setSuEmail(e.target.value); setSuError(""); }}
                      placeholder="you@example.com"
                      className="lp-input w-full py-2.5 pl-10 pr-4 rounded-xl text-sm"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password <span className="text-slate-500">(min. 8 characters)</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="signup-password"
                      type={suShowPwd ? "text" : "password"}
                      value={suPassword}
                      onChange={(e) => { setSuPassword(e.target.value); setSuError(""); }}
                      placeholder="Create a strong password"
                      className="lp-input w-full py-2.5 pl-10 pr-10 rounded-xl text-sm"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setSuShowPwd(!suShowPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {suShowPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Password strength indicator */}
                  {suPassword.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background:
                                suPassword.length >= i * 3
                                  ? suPassword.length >= 12
                                    ? "#34d399"
                                    : suPassword.length >= 8
                                    ? "#22d3ee"
                                    : "#fbbf24"
                                  : "rgba(255,255,255,0.1)",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] shrink-0" style={{
                        color: suPassword.length >= 12 ? "#34d399" : suPassword.length >= 8 ? "#22d3ee" : "#fbbf24"
                      }}>
                        {suPassword.length >= 12 ? "Strong" : suPassword.length >= 8 ? "Good" : "Weak"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="signup-confirm"
                      type={suShowPwd ? "text" : "password"}
                      value={suConfirm}
                      onChange={(e) => { setSuConfirm(e.target.value); setSuError(""); }}
                      placeholder="Repeat your password"
                      className="lp-input w-full py-2.5 pl-10 pr-10 rounded-xl text-sm"
                      autoComplete="new-password"
                    />
                    {suConfirm.length > 0 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {suPassword === suConfirm
                          ? <Check size={16} className="text-emerald-400" />
                          : <AlertCircle size={16} className="text-red-400" />
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* Degree & Year — 2-column */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Degree
                    </label>
                    <div className="relative">
                      <GraduationCap size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select
                        id="signup-degree"
                        value={suDegree}
                        onChange={(e) => setSuDegree(e.target.value)}
                        className="lp-input w-full py-2 pl-8 pr-2 rounded-xl text-xs"
                      >
                        {["B.Tech Computer Science", "B.Tech IT", "B.Sc Data Science", "BCA", "MCA", "M.Tech", "Other"].map((o) => (
                          <option key={o} className="bg-[#0a0f1c]">{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Year
                    </label>
                    <select
                      id="signup-year"
                      value={suYear}
                      onChange={(e) => setSuYear(e.target.value)}
                      className="lp-input w-full py-2 px-3 rounded-xl text-xs"
                    >
                      {["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"].map((o) => (
                        <option key={o} className="bg-[#0a0f1c]">{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Career */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Target Career
                  </label>
                  <select
                    id="signup-career"
                    value={suCareer}
                    onChange={(e) => setSuCareer(e.target.value)}
                    className="lp-input w-full py-2.5 px-3 rounded-xl text-sm"
                  >
                    {ONBOARD_CAREERS.map((c) => (
                      <option key={c} className="bg-[#0a0f1c]">{c}</option>
                    ))}
                  </select>
                </div>

                <button
                  id="btn-signup-submit"
                  type="submit"
                  disabled={suLoading}
                  className="lp-btn-primary w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
                >
                  {suLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    <>Create Account & Start Onboarding <ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-white/5 text-center">
                <p className="text-xs text-slate-400">
                  Already have an account?{" "}
                  <button
                    onClick={() => { setTab("signin"); setSuError(""); }}
                    className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </GlassCard>
          )}

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-600 mt-6">
            PathForge — AI-powered career guidance for students · Data stored locally on your device
          </p>
        </div>
      </main>
    </div>
  );
}
