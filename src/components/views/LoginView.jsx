import React, { useState, useEffect } from "react";
import {
  Flame, Sparkles, ArrowRight, Lock, Mail, Eye, EyeOff,
  UserPlus, LogIn, AlertCircle, GraduationCap, User, Check,
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { ONBOARD_CAREERS } from "../../data/mockData";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function LoginView({ onLogin, onRegister }) {
  const [tab, setTab] = useState("signin");
  const [mounted, setMounted] = useState(false);

  // Sign-In state
  const [siEmail, setSiEmail]       = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siShowPwd, setSiShowPwd]   = useState(false);
  const [siRemember, setSiRemember] = useState(true);
  const [siError, setSiError]       = useState("");
  const [siLoading, setSiLoading]   = useState(false);

  // Sign-Up state
  const [suName, setSuName]         = useState("");
  const [suEmail, setSuEmail]       = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm]   = useState("");
  const [suDegree, setSuDegree]     = useState("B.Tech Computer Science");
  const [suYear, setSuYear]         = useState("1st Year");
  const [suCareer, setSuCareer]     = useState("Software Engineer");
  const [suShowPwd, setSuShowPwd]   = useState(false);
  const [suError, setSuError]       = useState("");
  const [suLoading, setSuLoading]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSiError("");
    if (!siEmail.trim())        { setSiError("Please enter your email address."); return; }
    if (!isValidEmail(siEmail)) { setSiError("Please enter a valid email address."); return; }
    if (!siPassword)            { setSiError("Please enter your password."); return; }
    setSiLoading(true);
    const result = await onLogin({ email: siEmail, password: siPassword, remember: siRemember });
    setSiLoading(false);
    if (!result?.success) setSiError(result?.error || "Sign in failed. Please try again.");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSuError("");
    if (!suName.trim())                          { setSuError("Please enter your full name."); return; }
    if (!suEmail.trim() || !isValidEmail(suEmail)) { setSuError("Please enter a valid email address."); return; }
    if (suPassword.length < 8)                   { setSuError("Password must be at least 8 characters."); return; }
    if (suPassword !== suConfirm)                { setSuError("Passwords do not match."); return; }
    setSuLoading(true);
    const result = await onRegister({ name: suName, email: suEmail, password: suPassword, degree: suDegree, year: suYear, targetCareer: suCareer });
    setSuLoading(false);
    if (!result?.success) setSuError(result?.error || "Registration failed. Please try again.");
  };

  const pwStrength = suPassword.length >= 12 ? { label: "Strong", color: "#34d399", bars: 4 }
    : suPassword.length >= 8  ? { label: "Good",   color: "#22d3ee", bars: 3 }
    : suPassword.length >= 4  ? { label: "Weak",   color: "#fbbf24", bars: 2 }
    : suPassword.length > 0   ? { label: "Poor",   color: "#f87171", bars: 1 }
    : null;

  return (
    <div className="relative min-h-screen bg-[#060911] text-[#eef1f7] overflow-hidden flex flex-col">

      {/* ── Animated background orbs ─────────────────────── */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* ── Subtle grid overlay ───────────────────────────── */}
      <div className="login-grid" />

      {/* ── Header / Brand ───────────────────────────────── */}
      <header
        className="relative z-20 flex items-center justify-center px-6 pt-10 pb-2"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Logo icon with glow + float */}
          <div className="login-logo-wrap">
            <div className="login-logo-glow" />
            <div className="login-logo-icon">
              <Flame size={28} color="#04121a" fill="#04121a" strokeWidth={2.5} />
            </div>
          </div>

          {/* Brand name */}
          <div className="login-brand-name">
            <span className="login-brand-path">Path</span>
            <span className="login-brand-forge">Forge</span>
          </div>

          {/* Tagline */}
          <p className="text-xs tracking-[0.18em] uppercase font-medium" style={{ color: "rgba(148,163,184,0.6)" }}>
            AI-Powered Career Intelligence
          </p>
        </div>
      </header>

      {/* ── Main form area ───────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 py-6">
        <div
          className="w-full max-w-md"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          {/* Page title */}
          <div className="text-center mb-7">
            <h1 className="lp-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {tab === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm mt-2" style={{ color: "rgba(148,163,184,0.7)" }}>
              {tab === "signin"
                ? "Sign in to continue your learning journey."
                : "Start building your personalized career roadmap."}
            </p>
          </div>

          {/* ── Tab switcher ─────────────────────────────── */}
          <div className="login-tab-bar mb-5">
            <button
              id="tab-signin"
              onClick={() => { setTab("signin"); setSiError(""); }}
              className="login-tab"
              data-active={tab === "signin"}
            >
              <LogIn size={14} />
              Sign In
            </button>
            <button
              id="tab-signup"
              onClick={() => { setTab("signup"); setSuError(""); }}
              className="login-tab"
              data-active={tab === "signup"}
            >
              <UserPlus size={14} />
              Create Account
            </button>
          </div>

          {/* ── SIGN IN FORM ─────────────────────────────── */}
          {tab === "signin" && (
            <div className="login-card">
              {siError && <ErrorBanner msg={siError} />}
              <form onSubmit={handleSignIn} className="space-y-4">
                <Field label="Email Address">
                  <InputWrap icon={<Mail size={15} />}>
                    <input
                      id="signin-email"
                      type="email"
                      value={siEmail}
                      onChange={(e) => { setSiEmail(e.target.value); setSiError(""); }}
                      placeholder="you@example.com"
                      className="lp-input pl-10 pr-4 py-2.5 rounded-xl text-sm w-full"
                      autoComplete="email"
                    />
                  </InputWrap>
                </Field>

                <Field label="Password">
                  <InputWrap icon={<Lock size={15} />} rightEl={
                    <EyeBtn show={siShowPwd} toggle={() => setSiShowPwd(!siShowPwd)} />
                  }>
                    <input
                      id="signin-password"
                      type={siShowPwd ? "text" : "password"}
                      value={siPassword}
                      onChange={(e) => { setSiPassword(e.target.value); setSiError(""); }}
                      placeholder="Enter your password"
                      className="lp-input pl-10 pr-10 py-2.5 rounded-xl text-sm w-full"
                      autoComplete="current-password"
                    />
                  </InputWrap>
                </Field>

                <label className="flex items-center gap-2.5 cursor-pointer group mt-1">
                  <input
                    type="checkbox"
                    checked={siRemember}
                    onChange={(e) => setSiRemember(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                    Remember me on this device
                  </span>
                </label>

                <SubmitBtn id="btn-signin-submit" loading={siLoading} label="Sign In" />
              </form>

              <div className="mt-5 pt-4 border-t border-white/5 text-center">
                <p className="text-xs text-slate-400">
                  New to PathForge?{" "}
                  <button
                    onClick={() => { setTab("signup"); setSiError(""); }}
                    className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline cursor-pointer transition-colors"
                  >
                    Create a free account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ── SIGN UP FORM ─────────────────────────────── */}
          {tab === "signup" && (
            <div className="login-card">
              {suError && <ErrorBanner msg={suError} />}
              <form onSubmit={handleSignUp} className="space-y-4">
                <Field label="Full Name">
                  <InputWrap icon={<User size={15} />}>
                    <input
                      id="signup-name"
                      type="text"
                      value={suName}
                      onChange={(e) => { setSuName(e.target.value); setSuError(""); }}
                      placeholder="Your full name"
                      className="lp-input pl-10 pr-4 py-2.5 rounded-xl text-sm w-full"
                      autoComplete="name"
                    />
                  </InputWrap>
                </Field>

                <Field label="Email Address">
                  <InputWrap icon={<Mail size={15} />}>
                    <input
                      id="signup-email"
                      type="email"
                      value={suEmail}
                      onChange={(e) => { setSuEmail(e.target.value); setSuError(""); }}
                      placeholder="you@example.com"
                      className="lp-input pl-10 pr-4 py-2.5 rounded-xl text-sm w-full"
                      autoComplete="email"
                    />
                  </InputWrap>
                </Field>

                <Field label={<>Password <span className="text-slate-500 font-normal">(min. 8 characters)</span></>}>
                  <InputWrap icon={<Lock size={15} />} rightEl={
                    <EyeBtn show={suShowPwd} toggle={() => setSuShowPwd(!suShowPwd)} />
                  }>
                    <input
                      id="signup-password"
                      type={suShowPwd ? "text" : "password"}
                      value={suPassword}
                      onChange={(e) => { setSuPassword(e.target.value); setSuError(""); }}
                      placeholder="Create a strong password"
                      className="lp-input pl-10 pr-10 py-2.5 rounded-xl text-sm w-full"
                      autoComplete="new-password"
                    />
                  </InputWrap>
                  {pwStrength && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ background: i <= pwStrength.bars ? pwStrength.color : "rgba(255,255,255,0.08)" }} />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium shrink-0 transition-colors" style={{ color: pwStrength.color }}>
                        {pwStrength.label}
                      </span>
                    </div>
                  )}
                </Field>

                <Field label="Confirm Password">
                  <InputWrap icon={<Lock size={15} />} rightEl={
                    suConfirm.length > 0 ? (
                      suPassword === suConfirm
                        ? <Check size={15} className="text-emerald-400" />
                        : <AlertCircle size={15} className="text-red-400" />
                    ) : null
                  }>
                    <input
                      id="signup-confirm"
                      type={suShowPwd ? "text" : "password"}
                      value={suConfirm}
                      onChange={(e) => { setSuConfirm(e.target.value); setSuError(""); }}
                      placeholder="Repeat your password"
                      className="lp-input pl-10 pr-10 py-2.5 rounded-xl text-sm w-full"
                      autoComplete="new-password"
                    />
                  </InputWrap>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Degree">
                    <InputWrap icon={<GraduationCap size={13} />}>
                      <select
                        id="signup-degree"
                        value={suDegree}
                        onChange={(e) => setSuDegree(e.target.value)}
                        className="lp-input pl-8 pr-2 py-2 rounded-xl text-xs w-full"
                      >
                        {["B.Tech Computer Science","B.Tech IT","B.Sc Data Science","BCA","MCA","M.Tech","Other"].map(o => (
                          <option key={o} className="bg-[#0a0f1c]">{o}</option>
                        ))}
                      </select>
                    </InputWrap>
                  </Field>
                  <Field label="Year">
                    <select
                      id="signup-year"
                      value={suYear}
                      onChange={(e) => setSuYear(e.target.value)}
                      className="lp-input px-3 py-2 rounded-xl text-xs w-full"
                    >
                      {["1st Year","2nd Year","3rd Year","4th Year","Postgraduate"].map(o => (
                        <option key={o} className="bg-[#0a0f1c]">{o}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Target Career">
                  <select
                    id="signup-career"
                    value={suCareer}
                    onChange={(e) => setSuCareer(e.target.value)}
                    className="lp-input px-3 py-2.5 rounded-xl text-sm w-full"
                  >
                    {ONBOARD_CAREERS.map(c => (
                      <option key={c} className="bg-[#0a0f1c]">{c}</option>
                    ))}
                  </select>
                </Field>

                <SubmitBtn
                  id="btn-signup-submit"
                  loading={suLoading}
                  label="Create Account & Start Onboarding"
                  variant="purple"
                />
              </form>

              <div className="mt-5 pt-4 border-t border-white/5 text-center">
                <p className="text-xs text-slate-400">
                  Already have an account?{" "}
                  <button
                    onClick={() => { setTab("signin"); setSuError(""); }}
                    className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline cursor-pointer transition-colors"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function InputWrap({ icon, rightEl, children }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {icon}
        </span>
      )}
      {children}
      {rightEl && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightEl}
        </span>
      )}
    </div>
  );
}

function EyeBtn({ show, toggle }) {
  return (
    <button type="button" onClick={toggle}
      className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer">
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );
}

function ErrorBanner({ msg }) {
  return (
    <div className="mb-4 p-3 rounded-xl flex items-center gap-2 text-xs text-red-300"
      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
      <AlertCircle size={14} className="shrink-0" />
      <span>{msg}</span>
    </div>
  );
}

function SubmitBtn({ id, loading, label, variant = "cyan" }) {
  const grad = variant === "purple"
    ? "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)"
    : "linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #8b5cf6 100%)";

  return (
    <button
      id={id}
      type="submit"
      disabled={loading}
      className="login-submit-btn w-full"
      style={{ background: grad }}
    >
      <span className="login-submit-shine" />
      {loading ? (
        <span className="flex items-center gap-2 relative z-10">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {variant === "purple" ? "Creating account…" : "Signing in…"}
        </span>
      ) : (
        <span className="flex items-center gap-2 justify-center relative z-10">
          {label} <ArrowRight size={15} />
        </span>
      )}
    </button>
  );
}
