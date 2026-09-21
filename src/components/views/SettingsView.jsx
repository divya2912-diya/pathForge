import React, { useState } from "react";
import { LogOut, Shield, Bell, Gauge, User, KeyRound, AlertCircle, Check } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import { changePassword } from "../../data/authStore";

export function SettingsView({ student, onLogout, onUpdateStudent }) {
  const [prefs, setPrefs] = useState({
    dailyReminders: true,
    weeklyDigest: true,
    aiSuggestions: true,
    pace: student?.pace || "Balanced",
  });
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  // Change password state
  const [cpCurrent, setCpCurrent] = useState("");
  const [cpNew, setCpNew] = useState("");
  const [cpConfirm, setCpConfirm] = useState("");
  const [cpError, setCpError] = useState("");
  const [cpSuccess, setCpSuccess] = useState(false);
  const [cpLoading, setCpLoading] = useState(false);

  const handleChangePassword = (e) => {
    e.preventDefault();
    setCpError("");
    setCpSuccess(false);
    if (!cpCurrent) { setCpError("Enter your current password."); return; }
    if (cpNew.length < 8) { setCpError("New password must be at least 8 characters."); return; }
    if (cpNew !== cpConfirm) { setCpError("New passwords do not match."); return; }
    setCpLoading(true);
    setTimeout(() => {
      const result = changePassword({ currentPassword: cpCurrent, newPassword: cpNew });
      setCpLoading(false);
      if (result.success) {
        setCpSuccess(true);
        setCpCurrent(""); setCpNew(""); setCpConfirm("");
      } else {
        setCpError(result.error || "Failed to change password.");
      }
    }, 500);
  };

  const handlePaceChange = (pace) => {
    setPrefs(p => ({ ...p, pace }));
    onUpdateStudent?.({ pace }, "Learning pace updated!");
  };

  const memberSince = student?.createdAt
    ? new Date(student.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown";

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader eyebrow="Account" title="Settings" />

      {/* Account Info */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center gap-2 mb-4">
          <User size={16} color="#67e8f9" />
          <SectionHeader title="Account Information" />
        </div>
        <div className="space-y-1 text-sm">
          {[
            ["Name", student?.name || "—"],
            ["Email", student?.email || "—"],
            ["Degree", student?.degree || "—"],
            ["Year", student?.year || "—"],
            ["Target Career", student?.targetCareer || "—"],
            ["Member since", memberSince],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "var(--text-dim)" }}>{label}</span>
              <span className={label === "Target Career" ? "text-cyan-300 font-medium" : ""}>{value}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} color="#67e8f9" />
          <SectionHeader title="Notifications" />
        </div>
        {[
          ["dailyReminders", "Daily learning reminders", "A short nudge to keep your streak going."],
          ["weeklyDigest", "Weekly progress digest", "A summary of roadmap progress and new recommendations."],
          ["aiSuggestions", "AI Mentor proactive tips", "Let your AI Mentor message you when it detects a gap."],
        ].map(([key, label, desc]) => (
          <div key={key} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p className="text-sm">{label}</p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>{desc}</p>
            </div>
            <button
              id={`toggle-${key}`}
              onClick={() => toggle(key)}
              className="w-11 h-6 rounded-full relative shrink-0 transition-colors cursor-pointer"
              style={{ background: prefs[key] ? "linear-gradient(90deg,#22d3ee,#3b82f6)" : "rgba(255,255,255,0.12)" }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                style={{ left: prefs[key] ? 22 : 2 }}
              />
            </button>
          </div>
        ))}
      </GlassCard>

      {/* Learning Pace */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center gap-2 mb-4">
          <Gauge size={16} color="#67e8f9" />
          <SectionHeader title="Learning Pace" subtitle="Adjusts how densely your roadmap schedules new material" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Relaxed", sub: "~3 hrs/week" },
            { label: "Balanced", sub: "~6 hrs/week" },
            { label: "Intensive", sub: "~10+ hrs/week" },
          ].map(({ label, sub }) => (
            <button
              key={label}
              id={`pace-${label.toLowerCase()}`}
              onClick={() => handlePaceChange(label)}
              className="py-3 px-2 rounded-xl text-sm transition-all cursor-pointer text-center"
              style={
                prefs.pace === label
                  ? { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }
              }
            >
              <p className="font-medium">{label}</p>
              <p className="text-xs opacity-60 mt-0.5">{sub}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Change Password */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center gap-2 mb-4">
          <KeyRound size={16} color="#67e8f9" />
          <SectionHeader title="Change Password" />
        </div>

        {cpError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" /> {cpError}
          </div>
        )}
        {cpSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check size={14} className="shrink-0" /> Password changed successfully!
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          {[
            { label: "Current Password", value: cpCurrent, onChange: setCpCurrent, id: "cp-current" },
            { label: "New Password", value: cpNew, onChange: setCpNew, id: "cp-new" },
            { label: "Confirm New Password", value: cpConfirm, onChange: setCpConfirm, id: "cp-confirm" },
          ].map(({ label, value, onChange, id }) => (
            <div key={id}>
              <label className="block text-xs text-slate-400 mb-1">{label}</label>
              <input
                id={id}
                type="password"
                value={value}
                onChange={e => { onChange(e.target.value); setCpError(""); setCpSuccess(false); }}
                className="lp-input w-full py-2.5 px-3 rounded-xl text-sm"
                autoComplete="off"
              />
            </div>
          ))}
          <button
            id="btn-change-password"
            type="submit"
            disabled={cpLoading}
            className="lp-btn-primary px-5 py-2.5 rounded-xl text-sm mt-2 cursor-pointer"
          >
            {cpLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </GlassCard>

      {/* Sign Out */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-red-400" />
          <p className="font-semibold text-sm text-white">Sign Out</p>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--text-dim)" }}>
          You'll need to sign in again to access your PathForge account. Your data is safely stored on this device.
        </p>
        <button
          id="btn-signout"
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
        >
          <LogOut size={16} /> Sign Out of PathForge
        </button>
      </GlassCard>
    </div>
  );
}

export default SettingsView;
