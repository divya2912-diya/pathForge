import React, { useState } from "react";
import { LogOut, Shield, Bell, Gauge, User, KeyRound, AlertCircle, Check, Cpu, Key, Sparkles } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import { changePassword } from "../../data/supabaseAuth";
import {
  AI_MODELS,
  getStoredApiKey,
  saveApiKey,
  getStoredModel,
  saveModel,
} from "../../lib/aiMentorService";

export function SettingsView({ student, onLogout, onUpdateStudent }) {
  const [prefs, setPrefs] = useState({
    dailyReminders: true,
    weeklyDigest: true,
    aiSuggestions: true,
    pace: student?.pace || "Balanced",
  });
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  // Gemini AI Agent Settings State
  const [apiKeyInput, setApiKeyInput] = useState(getStoredApiKey());
  const [selectedModel, setSelectedModel] = useState(getStoredModel());
  const [aiSavedSuccess, setAiSavedSuccess] = useState(false);

  // Change password state
  const [cpCurrent, setCpCurrent] = useState("");
  const [cpNew, setCpNew] = useState("");
  const [cpConfirm, setCpConfirm] = useState("");
  const [cpError, setCpError] = useState("");
  const [cpSuccess, setCpSuccess] = useState(false);
  const [cpLoading, setCpLoading] = useState(false);

  const handleSaveAiSettings = (e) => {
    e.preventDefault();
    saveApiKey(apiKeyInput);
    saveModel(selectedModel);
    setAiSavedSuccess(true);
    setTimeout(() => setAiSavedSuccess(false), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setCpError("");
    setCpSuccess(false);
    if (cpNew.length < 8) { setCpError("New password must be at least 8 characters."); return; }
    if (cpNew !== cpConfirm) { setCpError("New passwords do not match."); return; }
    setCpLoading(true);
    const result = await changePassword({ newPassword: cpNew });
    setCpLoading(false);
    if (result.success) {
      setCpSuccess(true);
      setCpCurrent(""); setCpNew(""); setCpConfirm("");
    } else {
      setCpError(result.error || "Failed to change password.");
    }
  };

  const handlePaceChange = (pace) => {
    setPrefs(p => ({ ...p, pace }));
    onUpdateStudent?.({ pace }, "Learning pace updated!");
  };

  const memberSince = student?.createdAt
    ? new Date(student.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown";

  const isKeyActive = !!getStoredApiKey();

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

      {/* Gemini AI Agent Configuration Card */}
      <GlassCard className="p-6 border border-cyan-500/30" hover>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-cyan-400" />
            <SectionHeader
              title="Gemini AI Agent Settings"
              subtitle="Configure your Google Gemini API Key and preferred Gemini model"
            />
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              isKeyActive
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-300 border-amber-500/30"
            }`}
          >
            {isKeyActive ? "✓ Gemini Key Active" : "No Key Set"}
          </span>
        </div>

        {aiSavedSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check size={14} className="shrink-0" /> Gemini AI Agent settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSaveAiSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Key size={13} className="text-cyan-400" />
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste your Google Gemini API Key (AIza...)"
              className="lp-input w-full py-2.5 px-3 rounded-xl text-sm text-white placeholder-slate-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Your key is saved locally in your browser and used directly for Google Gemini completions.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Sparkles size={13} className="text-cyan-400" />
              Gemini Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="lp-input w-full py-2.5 px-3 rounded-xl text-sm bg-slate-900 text-white cursor-pointer"
            >
              {AI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            {isKeyActive ? (
              <button
                type="button"
                onClick={() => {
                  saveApiKey("");
                  setApiKeyInput("");
                  setAiSavedSuccess(true);
                  setTimeout(() => setAiSavedSuccess(false), 2000);
                }}
                className="text-xs px-3 py-2 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30 cursor-pointer font-medium"
              >
                Clear Gemini Key
              </button>
            ) : <span />}

            <button
              type="submit"
              className="lp-btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
            >
              Save Gemini Settings
            </button>
          </div>
        </form>
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
