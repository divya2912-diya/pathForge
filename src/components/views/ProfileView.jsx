import React, { useState, useRef, useMemo } from "react";
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Award, Mail, Edit3, Camera,
  MapPin, ExternalLink, Phone, Globe, ShieldCheck, Check, X,
  FolderKanban, Trash2, Search, Plus, BookOpen, Briefcase
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar,
  ResponsiveContainer, Tooltip as RTooltip
} from "recharts";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import ProgressBar from "../ui/ProgressBar";
import ProgressRing from "../ui/ProgressRing";
import AssessmentView from "./AssessmentView";
import { ONBOARD_CAREERS } from "../../data/mockData";

// ── Skill grouping logic (computed from user's real skills) ──────
const SKILL_GROUP_MAP = {
  "Programming":     ["Python","Java","C++","C","JavaScript","TypeScript"],
  "Data & Databases":["SQL","Statistics","Machine Learning"],
  "Web & Frameworks":["React","Node.js","HTML/CSS"],
  "Tools & Systems": ["Docker","AWS","Git","Linux"],
};

const RADAR_KEYS = ["Programming","Data","Web","Tools","AI/ML"];
function buildRadarData(skills = []) {
  const all = skills.map(s => s.toLowerCase());
  return [
    { subject: "Programming", value: countMatch(all, ["python","java","c++","c","javascript","typescript"]) },
    { subject: "Data",        value: countMatch(all, ["sql","statistics"]) },
    { subject: "Web",         value: countMatch(all, ["react","node.js","html/css"]) },
    { subject: "Tools",       value: countMatch(all, ["docker","aws","git","linux"]) },
    { subject: "AI/ML",       value: countMatch(all, ["machine learning"]) },
  ].map(d => ({ ...d, value: Math.min(100, d.value * 33) }));
}
function countMatch(skills, targets) {
  return targets.filter(t => skills.some(s => s.includes(t))).length;
}

function buildSkillGroups(skills = []) {
  const lower = skills.map(s => s.toLowerCase());
  return Object.entries(SKILL_GROUP_MAP)
    .map(([name, targets]) => {
      const matched = targets.filter(t => lower.some(s => s.includes(t.toLowerCase())));
      const level = targets.length ? Math.round((matched.length / targets.length) * 100) : 0;
      return { name, level, matched };
    })
    .filter(g => g.level > 0);
}

// ── Empty state component ────────────────────────────────────────
function EmptyField({ label, onEdit }) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 transition-colors text-sm italic cursor-pointer"
    >
      <Plus size={13} /> Add {label}
    </button>
  );
}

// ── EditProfileModal ─────────────────────────────────────────────
export function EditProfileModal({ open, onClose, student, onSave }) {
  const [formData, setFormData] = useState(student || {});

  React.useEffect(() => {
    if (student) setFormData(student);
  }, [student, open]);

  if (!open) return null;

  const avatarStyles = [
    { name: "Cyan / Violet", value: "linear-gradient(135deg, #22d3ee, #8b5cf6)" },
    { name: "Blue / Orange", value: "linear-gradient(135deg, #3b82f6, #f97316)" },
    { name: "Emerald / Cyan", value: "linear-gradient(135deg, #10b981, #06b6d4)" },
    { name: "Violet / Pink",  value: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
    { name: "Amber / Fire",   value: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md lp-fade-up">
      <div className="w-full max-w-xl lp-glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)" }}>
              <Edit3 size={16} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="lp-display text-base font-semibold text-white">Edit Profile</h3>
              <p className="text-xs text-slate-400">Update your personal and academic information</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto lp-scrollbar p-6 space-y-4">
          {/* Avatar colour */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Avatar Theme (fallback for photo)</label>
            <div className="flex items-center gap-3">
              {avatarStyles.map((s) => (
                <button key={s.name} type="button"
                  onClick={() => setFormData({ ...formData, avatarColor: s.value })}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${formData.avatarColor === s.value ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#060911] scale-110" : "opacity-70 hover:opacity-100"}`}
                  style={{ background: s.value }} title={s.name}>
                  {formData.avatarColor === s.value && <Check size={14} color="#04121a" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name *</label>
              <input type="text" required value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inp} placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Username</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 text-sm">@</span>
                <input type="text" value={(formData.username || "").replace(/^@/, "")} onChange={e => setFormData({ ...formData, username: e.target.value.replace(/^@/, "") })} className={`${inp} pl-7`} placeholder="yourhandle" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address *</label>
              <input type="email" required value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inp} placeholder="you@university.edu" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone Number</label>
              <input type="text" value={formData.phone || ""} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inp} placeholder="+91 98765 43210" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree / Major</label>
              <input type="text" value={formData.degree || ""} onChange={e => setFormData({ ...formData, degree: e.target.value })} className={inp} placeholder="B.Tech Computer Science" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Academic Year</label>
              <input type="text" value={formData.year || ""} onChange={e => setFormData({ ...formData, year: e.target.value })} className={inp} placeholder="3rd Year" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Career</label>
              <select value={formData.targetCareer || ""} onChange={e => setFormData({ ...formData, targetCareer: e.target.value })} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors">
                {ONBOARD_CAREERS.map(c => <option key={c} value={c} className="bg-[#0a0f1c] text-white">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Location</label>
              <input type="text" value={formData.location || ""} onChange={e => setFormData({ ...formData, location: e.target.value })} className={inp} placeholder="City, Country" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Bio / Professional Headline</label>
            <textarea rows={3} value={formData.bio || ""} onChange={e => setFormData({ ...formData, bio: e.target.value })} className={`${inp} resize-none`} placeholder="Tell us about your learning goals and tech passions..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">GitHub Profile URL</label>
              <input type="text" value={formData.github || ""} onChange={e => setFormData({ ...formData, github: e.target.value })} className={inp} placeholder="github.com/yourusername" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">LinkedIn Profile URL</label>
              <input type="text" value={formData.linkedin || ""} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className={inp} placeholder="linkedin.com/in/yourusername" />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20">
              <Check size={15} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── ImagePreviewModal ────────────────────────────────────────────
export function ImagePreviewModal({ open, imageSrc, fileInfo, onConfirm, onCancel }) {
  if (!open || !imageSrc) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md lp-fade-up">
      <div className="w-full max-w-md lp-glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)" }}>
              <Camera size={16} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="lp-display text-base font-semibold text-white">Preview Profile Picture</h3>
              <p className="text-xs text-slate-400">Confirm circular crop for your profile</p>
            </div>
          </div>
          <button type="button" onClick={onCancel} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="relative w-36 h-36 rounded-full p-1 ring-4 ring-cyan-400/40 shadow-2xl overflow-hidden bg-black/40">
            <img src={imageSrc} alt="Profile preview" className="w-full h-full object-cover rounded-full select-none" />
          </div>
          {fileInfo && (
            <div className="text-center text-xs text-slate-300 space-y-0.5">
              <p className="font-medium truncate max-w-xs">{fileInfo.name}</p>
              <p className="text-slate-400">{fileInfo.size}</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
          <button type="button" onClick={onConfirm} className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20">
            <Check size={15} /> Save Picture
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ProfileView ──────────────────────────────────────────────────
export function ProfileView({ student, onUpdateStudent, onBack }) {
  const [showAssessment, setShowAssessment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingFileInfo, setPendingFileInfo] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const profile = student || {};

  // Computed from real user skills
  const skillGroups = useMemo(() => buildSkillGroups(profile.skills), [profile.skills]);
  const radarData   = useMemo(() => buildRadarData(profile.skills), [profile.skills]);
  const hasSkills   = skillGroups.length > 0;

  // Assessment data from real profile
  const assessmentScore   = profile.assessmentScore ?? null;
  const assessmentAnswers = profile.assessmentAnswers || null;
  const strongAreas       = assessmentAnswers?.strong   || [];
  const weakAreas         = assessmentAnswers?.weak     || [];

  const openEdit = () => setIsEditing(true);

  const handleTriggerFileSelect = () => {
    setUploadError(null);
    if (fileInputRef.current) { fileInputRef.current.value = ""; fileInputRef.current.click(); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg","image/jpg","image/png","image/webp"].includes(file.type.toLowerCase())) {
      setUploadError("Please select a valid image file (JPG, PNG, or WEBP)."); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size exceeds 5MB. Please choose a smaller image."); return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (result) {
        setPendingImage(result);
        const size = file.size < 1024*1024 ? `${(file.size/1024).toFixed(1)} KB` : `${(file.size/(1024*1024)).toFixed(2)} MB`;
        setPendingFileInfo({ name: file.name, size });
        setPreviewOpen(true);
        setUploadError(null);
      }
    };
    reader.onerror = () => setUploadError("Failed to read image file.");
    reader.readAsDataURL(file);
  };

  const handleConfirmImage = () => {
    if (pendingImage && onUpdateStudent) {
      onUpdateStudent({ ...profile, profilePicture: pendingImage }, "Profile picture updated successfully");
    }
    setPreviewOpen(false); setPendingImage(null); setPendingFileInfo(null);
  };

  if (showAssessment) {
    return (
      <div className="space-y-6">
        <button onClick={() => setShowAssessment(false)} className="flex items-center gap-1.5 text-sm cursor-pointer hover:text-white transition-colors" style={{ color: "var(--text-dim)" }}>
          <ArrowLeft size={15} /> Back to profile
        </button>
        <AssessmentView />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} className="hidden" />

      {/* Top nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button type="button" onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">Account & Portfolio</span>
            <h1 className="lp-display text-2xl font-bold text-white">Profile</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm">
            <Search size={14} className="text-slate-400" />
            <input type="text" placeholder="Search profile..." className="bg-transparent text-sm text-white placeholder-slate-400 outline-none w-36 md:w-48" />
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ring-2 ring-cyan-400/40 overflow-hidden"
            style={{ background: profile.avatarColor || "linear-gradient(135deg,#22d3ee,#8b5cf6)", color: "#04121a" }}>
            {profile.profilePicture
              ? <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover rounded-full" />
              : <span>{profile.name ? profile.name.charAt(0).toUpperCase() : "U"}</span>}
          </div>
        </div>
      </div>

      {/* Hero Card */}
      <GlassCard strong className="p-6 md:p-8 relative overflow-hidden" hover>
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%)" }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative group shrink-0 self-start sm:self-center">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-2xl transition-transform group-hover:scale-105 overflow-hidden relative border-2 border-white/15"
                style={{ background: profile.avatarColor || "linear-gradient(135deg,#22d3ee,#8b5cf6)", color: "#04121a" }}>
                {profile.profilePicture
                  ? <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
                  : <span>{profile.name ? profile.name.charAt(0).toUpperCase() : "U"}</span>}
              </div>
              <button type="button" onClick={handleTriggerFileSelect}
                className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-[#0a0f1c] border border-white/20 flex items-center justify-center text-cyan-400 hover:text-white hover:border-cyan-400 transition-colors shadow-lg cursor-pointer">
                <Camera size={15} />
              </button>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#060911]" />
            </div>

            {/* Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="lp-display text-2xl md:text-3xl font-semibold tracking-tight text-white">{profile.name || "—"}</h2>
                {profile.username && <span className="text-sm font-medium text-cyan-400">@{profile.username}</span>}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)", color: "#67e8f9" }}>
                  <ShieldCheck size={12} /> Verified Learner
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
                  <Mail size={14} className="text-cyan-400" />{profile.email}
                </a>
                {(profile.degree || profile.year) && (
                  <><span>•</span><span>{[profile.degree, profile.year].filter(Boolean).join(" · ")}</span></>
                )}
                {profile.location && (
                  <><span>•</span>
                  <span className="flex items-center gap-1"><MapPin size={13} className="text-violet-400" />{profile.location}</span></>
                )}
              </div>

              {profile.bio && <p className="text-xs md:text-sm max-w-2xl pt-1 text-slate-300 leading-relaxed">{profile.bio}</p>}

              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                {profile.targetCareer && <Pill tone="violet">Target: {profile.targetCareer}</Pill>}
                {profile.careerReadiness != null && (
                  <Pill tone="green">{profile.careerReadiness}% Readiness</Pill>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="button" onClick={handleTriggerFileSelect}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 flex items-center gap-1.5 transition-colors cursor-pointer">
                  <Camera size={12} /> {profile.profilePicture ? "Change Picture" : "Add Picture"}
                </button>
                {profile.profilePicture && (
                  <button type="button" onClick={() => onUpdateStudent?.({ ...profile, profilePicture: null }, "Profile picture removed")}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer">
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <button type="button" onClick={openEdit}
              className="lp-btn-primary px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer">
              <Edit3 size={15} /> Edit Profile
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle size={14} />{uploadError}
          </div>
        )}
      </GlassCard>

      {/* Academic & Contact grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Academic */}
        <GlassCard className="p-6" hover>
          <SectionHeader title="Academic profile" />
          <div className="space-y-2.5 text-sm">
            {[
              { label: "Full name",        value: profile.name },
              { label: "Username",         value: profile.username ? `@${profile.username}` : null, cyan: true },
              { label: "Degree program",   value: profile.degree },
              { label: "Current standing", value: profile.year },
              { label: "Target career",    value: profile.targetCareer, cyan: true },
            ].map(({ label, value, cyan }) => (
              <div key={label} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "var(--text-dim)" }}>{label}</span>
                {value
                  ? <span className={`font-medium ${cyan ? "text-cyan-300" : "text-white"}`}>{value}</span>
                  : <EmptyField label={label.toLowerCase()} onEdit={openEdit} />}
              </div>
            ))}
            <div className="flex justify-between py-1.5">
              <span style={{ color: "var(--text-dim)" }}>Enrollment status</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium"><CheckCircle2 size={13} /> Active Student</span>
            </div>
          </div>
        </GlassCard>

        {/* Contact */}
        <GlassCard className="p-6" hover>
          <SectionHeader title="Contact & Social links" />
          <div className="space-y-2.5 text-sm">
            {/* Email - always present */}
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}><Mail size={14} className="text-cyan-400" /> Email</span>
              <a href={`mailto:${profile.email}`} className="text-white hover:text-cyan-300 transition-colors font-medium">{profile.email}</a>
            </div>
            {/* Phone */}
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}><Phone size={14} className="text-violet-400" /> Phone</span>
              {profile.phone
                ? <span className="font-medium text-white">{profile.phone}</span>
                : <EmptyField label="phone number" onEdit={openEdit} />}
            </div>
            {/* Location */}
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}><MapPin size={14} className="text-amber-400" /> Location</span>
              {profile.location
                ? <span className="font-medium text-white">{profile.location}</span>
                : <EmptyField label="location" onEdit={openEdit} />}
            </div>
            {/* GitHub */}
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}><Globe size={14} className="text-slate-300" /> GitHub</span>
              {profile.github
                ? <a href={profile.github.startsWith("http") ? profile.github : `https://${profile.github}`} target="_blank" rel="noreferrer"
                    className="font-medium text-cyan-400 flex items-center gap-1 hover:underline">
                    {profile.github} <ExternalLink size={11} />
                  </a>
                : <EmptyField label="GitHub URL" onEdit={openEdit} />}
            </div>
            {/* LinkedIn */}
            <div className="flex justify-between items-center py-1.5">
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}><Globe size={14} className="text-blue-400" /> LinkedIn</span>
              {profile.linkedin
                ? <a href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noreferrer"
                    className="font-medium text-blue-400 flex items-center gap-1 hover:underline">
                    {profile.linkedin} <ExternalLink size={11} />
                  </a>
                : <EmptyField label="LinkedIn URL" onEdit={openEdit} />}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Skills selected during onboarding + Interests */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills */}
        <GlassCard className="p-6" hover>
          <SectionHeader title="Skills" subtitle="Selected during onboarding or updated in settings" />
          {profile.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map(s => <Pill key={s} tone="cyan">{s}</Pill>)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
              <BookOpen size={32} className="text-slate-600" />
              <p className="text-sm text-slate-500">No skills added yet.</p>
              <p className="text-xs text-slate-600">Complete onboarding or update your profile to add skills.</p>
            </div>
          )}
        </GlassCard>

        {/* Interests */}
        <GlassCard className="p-6" hover>
          <SectionHeader title="Areas of Interest" subtitle="Chosen during onboarding" />
          {profile.interests?.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map(i => <Pill key={i} tone="violet">{i}</Pill>)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
              <Briefcase size={32} className="text-slate-600" />
              <p className="text-sm text-slate-500">No interests selected yet.</p>
              <p className="text-xs text-slate-600">Complete onboarding to add your areas of interest.</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Technical skills radar (only if skills exist) */}
      {hasSkills && (
        <GlassCard className="p-6" hover>
          <SectionHeader title="Technical skill breakdown" subtitle="Computed from your selected skills" />
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-5">
              {skillGroups.map((g, gi) => (
                <div key={g.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{g.name}</span>
                    <span className="text-sm" style={{ color: "#67e8f9" }}>{g.level}%</span>
                  </div>
                  <ProgressBar value={g.level} tone="cyan" height={8} delay={gi * 80} />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {g.matched.map(s => <span key={s} className="text-[10px] text-slate-400">{s}</span>).reduce((a, b, i) => [...a, i > 0 ? <span key={`sep-${i}`} className="text-[10px] text-slate-600">·</span> : null, b], [])}
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2" style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="rgba(255,255,255,0.12)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#8b93a7", fontSize: 10 }} />
                  <RechartsRadar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.28} />
                  <RTooltip contentStyle={{ background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Assessments */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <SectionHeader title="Assessments" subtitle="Latest knowledge validation results" />
          <button onClick={() => setShowAssessment(true)} className="lp-btn-primary px-4 py-2 rounded-lg text-sm cursor-pointer">
            Take new assessment
          </button>
        </div>
        {assessmentScore != null ? (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ProgressRing value={assessmentScore} size={96} stroke={8} sublabel="last score" />
            <div className="flex-1 grid sm:grid-cols-2 gap-4">
              {strongAreas.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}><CheckCircle2 size={13} /> Strong</p>
                  <div className="flex flex-wrap gap-1.5">{strongAreas.map(s => <Pill key={s} tone="green">{s}</Pill>)}</div>
                </div>
              )}
              {weakAreas.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#fbbf24" }}><AlertTriangle size={13} /> Needs improvement</p>
                  <div className="flex flex-wrap gap-1.5">{weakAreas.map(s => <Pill key={s} tone="amber">{s}</Pill>)}</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <Award size={36} className="text-slate-600" />
            <p className="text-sm text-slate-500">No assessment taken yet.</p>
            <p className="text-xs text-slate-600">Take your first assessment to see your knowledge profile here.</p>
          </div>
        )}
      </GlassCard>

      {/* Career aspirations */}
      <GlassCard strong className="p-6" hover>
        <SectionHeader title="Career aspirations" />
        <div className="flex flex-wrap items-center gap-8">
          <div>
            <p className="lp-display text-xl font-semibold text-white">{profile.targetCareer || "—"}</p>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Target career</p>
          </div>
          {profile.careerReadiness != null && (
            <div>
              <p className="lp-display text-xl font-semibold" style={{ color: "#c4b5fd" }}>{profile.careerReadiness}%</p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>Readiness</p>
            </div>
          )}
          {!profile.careerReadiness && (
            <div className="flex items-center gap-2 text-slate-500 text-sm italic">
              <Plus size={14} />
              <span>Complete onboarding to see your readiness score</span>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Edit Modal */}
      <EditProfileModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        student={profile}
        onSave={(updated) => onUpdateStudent?.(updated, "Profile updated successfully")}
      />
      <ImagePreviewModal
        open={previewOpen}
        imageSrc={pendingImage}
        fileInfo={pendingFileInfo}
        onConfirm={handleConfirmImage}
        onCancel={() => { setPreviewOpen(false); setPendingImage(null); setPendingFileInfo(null); }}
      />
    </div>
  );
}

export default ProfileView;
