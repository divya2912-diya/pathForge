import React, { useState } from "react";
import { LogOut, Shield, Bell, Gauge, User, KeyRound, AlertCircle, Check, Globe } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import { changePassword, updateCurrentUser } from "../../data/supabaseAuth";
import { SUPPORTED_LANGUAGES } from "../../services/i18nService";

export function SettingsView({ student, onLogout, onUpdateStudent }) {
  const [selectedLang, setSelectedLang] = useState(student?.preferredLanguage || "en");
  
  // Notification Preferences state persisted in user profile
  const [notificationPrefs, setNotificationPrefs] = useState(() => ({
    dailyReminders: student?.notificationPrefs?.dailyReminders ?? true,
    weeklyDigest: student?.notificationPrefs?.weeklyDigest ?? true,
    aiSuggestions: student?.notificationPrefs?.aiSuggestions ?? true,
  }));

  const [pace, setPace] = useState(student?.pace || "Balanced");

  // Change password state
  const [cpCurrent, setCpCurrent] = useState("");
  const [cpNew, setCpNew] = useState("");
  const [cpConfirm, setCpConfirm] = useState("");
  const [cpError, setCpError] = useState("");
  const [cpSuccess, setCpSuccess] = useState(false);
  const [cpLoading, setCpLoading] = useState(false);

  // Toggle notification preference with real Supabase persistence
  const handleToggleNotification = async (key) => {
    const updated = {
      ...notificationPrefs,
      [key]: !notificationPrefs[key]
    };
    setNotificationPrefs(updated);
    if (onUpdateStudent) {
      onUpdateStudent({ notificationPrefs: updated }, "Notification preferences saved!");
    }
    await updateCurrentUser({ notification_prefs: updated, notificationPrefs: updated });
  };

  // Change learning pace with real Supabase persistence
  const handlePaceChange = async (newPace) => {
    setPace(newPace);
    if (onUpdateStudent) {
      onUpdateStudent({ pace: newPace }, `Learning pace updated to ${newPace}!`);
    }
    await updateCurrentUser({ pace: newPace });
  };

  // Change language preference with real Supabase persistence
  const handleLanguageChange = async (code) => {
    setSelectedLang(code);
    if (onUpdateStudent) {
      onUpdateStudent({ preferredLanguage: code }, `Language changed to ${code.toUpperCase()}!`);
    }
    await updateCurrentUser({ preferred_language: code, preferredLanguage: code });
  };

  // Handle password update via Supabase Auth
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setCpError("");
    setCpSuccess(false);

    if (cpNew.length < 8) { 
      setCpError("New password must be at least 8 characters long."); 
      return; 
    }
    if (cpNew !== cpConfirm) { 
      setCpError("New passwords do not match."); 
      return; 
    }

    setCpLoading(true);
    const result = await changePassword({ newPassword: cpNew });
    setCpLoading(false);

    if (result.success) {
      setCpSuccess(true);
      setCpCurrent(""); 
      setCpNew(""); 
      setCpConfirm("");
    } else {
      setCpError(result.error || "Unable to change password. Please try again.");
    }
  };

  const memberSince = student?.createdAt
    ? new Date(student.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Active Member";

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader eyebrow="Account" title="Settings" subtitle="Manage your authenticated profile, learning preferences, and security settings." />

      {/* 1. Account Information */}
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
              <span className={label === "Target Career" ? "text-cyan-300 font-medium" : "text-white"}>{value}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 2. Multilingual Preferences */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} color="#67e8f9" />
          <SectionHeader title="Language Preference" subtitle="Interface and AI Mentor language" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="py-3 px-2 rounded-xl text-sm transition-all cursor-pointer text-center"
              style={
                selectedLang === lang.code
                  ? { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", color: "#94a3b8" }
              }
            >
              <p className="font-bold">{lang.name}</p>
              <p className="text-[11px] opacity-60 mt-0.5">{lang.label}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* 3. Notification Preferences (Persisted) */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} color="#67e8f9" />
          <SectionHeader title="Notification Preferences" subtitle="Saved to your authenticated account" />
        </div>
        {[
          ["dailyReminders", "Daily Learning Reminders", "Get nudged to keep your learning streak going."],
          ["weeklyDigest", "Weekly Progress Digest", "Summary of roadmap progress and newly added resources."],
          ["aiSuggestions", "AI Mentor Recommendations", "Proactive alerts when new skill gaps are identified."],
        ].map(([key, label, desc]) => (
          <div key={key} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p className="text-sm text-white font-medium">{label}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
            <button
              id={`toggle-${key}`}
              onClick={() => handleToggleNotification(key)}
              className="w-11 h-6 rounded-full relative shrink-0 transition-colors cursor-pointer"
              style={{ background: notificationPrefs[key] ? "linear-gradient(90deg,#22d3ee,#3b82f6)" : "rgba(255,255,255,0.12)" }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                style={{ left: notificationPrefs[key] ? 22 : 2 }}
              />
            </button>
          </div>
        ))}
      </GlassCard>

      {/* 4. Learning Pace (Persisted) */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center gap-2 mb-4">
          <Gauge size={16} color="#67e8f9" />
          <SectionHeader title="Learning Pace" subtitle="Controls roadmap density and weekly target hours" />
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
                pace === label
                  ? { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", color: "#94a3b8" }
              }
            >
              <p className="font-medium text-white">{label}</p>
              <p className="text-xs opacity-60 mt-0.5">{sub}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* 5. Change Password (Supabase Auth) */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center gap-2 mb-4">
          <KeyRound size={16} color="#67e8f9" />
          <SectionHeader title="Change Password" subtitle="Update your Supabase authentication password" />
        </div>

        {cpError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" /> {cpError}
          </div>
        )}
        {cpSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check size={14} className="shrink-0" /> Password changed successfully in Supabase!
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          {[
            { label: "New Password (min 8 chars)", value: cpNew, onChange: setCpNew, id: "cp-new" },
            { label: "Confirm New Password", value: cpConfirm, onChange: setCpConfirm, id: "cp-confirm" },
          ].map(({ label, value, onChange, id }) => (
            <div key={id}>
              <label className="block text-xs text-slate-400 mb-1">{label}</label>
              <input
                id={id}
                type="password"
                value={value}
                onChange={e => { onChange(e.target.value); setCpError(""); setCpSuccess(false); }}
                className="lp-input w-full py-2.5 px-3 rounded-xl text-sm bg-black/40 border border-white/10 text-white"
                autoComplete="off"
                required
              />
            </div>
          ))}
          <button
            id="btn-change-password"
            type="submit"
            disabled={cpLoading}
            className="lp-btn-primary px-5 py-2.5 rounded-xl text-sm mt-2 cursor-pointer font-bold disabled:opacity-50"
          >
            {cpLoading ? "Updating in Supabase..." : "Update Password"}
          </button>
        </form>
      </GlassCard>

      {/* 6. Sign Out */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-red-400" />
          <p className="font-semibold text-sm text-white">Sign Out</p>
        </div>
        <p className="text-xs mb-4 text-slate-400">
          Sign out of your active PathForge session. Your learning data and preferences are safely synced to your account.
        </p>
        <button
          id="btn-signout"
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400"
        >
          <LogOut size={16} /> Sign Out of PathForge
        </button>
      </GlassCard>
    </div>
  );
}

export default SettingsView;
