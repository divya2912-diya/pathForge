import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Award, Mail, Edit3, Camera,
  MapPin, ExternalLink, Phone, Globe, ShieldCheck, Check, X,
  FolderKanban, Trash2, Search
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
import {
  STUDENT, PREVIOUS_LEARNING, SKILL_GROUPS, RADAR_DATA, STRENGTHS, GAPS,
  OWNED_PROJECTS, OWNED_CERTIFICATIONS, INTERESTS, ONBOARD_CAREERS
} from "../../data/mockData";

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
          <button type="button" onClick={onCancel} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="relative w-36 h-36 rounded-full p-1 ring-4 ring-cyan-400/40 shadow-2xl overflow-hidden bg-black/40 flex items-center justify-center">
            <img
              src={imageSrc}
              alt="Profile preview"
              className="w-full h-full object-cover rounded-full select-none"
            />
          </div>
          {fileInfo && (
            <div className="text-center text-xs text-slate-300 space-y-0.5">
              <p className="font-medium truncate max-w-xs">{fileInfo.name}</p>
              <p className="text-slate-400">{fileInfo.size}</p>
            </div>
          )}
          <p className="text-[11px] text-center text-cyan-300/80 max-w-xs">
            This image will be displayed across your profile, navigation header, and landing page.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Check size={15} /> Save Picture
          </button>
        </div>
      </div>
    </div>
  );
}

export function EditProfileModal({ open, onClose, student, onSave }) {
  const [formData, setFormData] = useState(student || STUDENT);

  useEffect(() => {
    if (student) setFormData(student);
  }, [student, open]);

  if (!open) return null;

  const avatarStyles = [
    { name: "Cyan / Violet", value: "linear-gradient(135deg, #22d3ee, #8b5cf6)" },
    { name: "Blue / Orange", value: "linear-gradient(135deg, #3b82f6, #f97316)" },
    { name: "Emerald / Cyan", value: "linear-gradient(135deg, #10b981, #06b6d4)" },
    { name: "Violet / Pink", value: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
    { name: "Amber / Fire", value: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

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
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Avatar Theme (Fallback for photo)</label>
            <div className="flex items-center gap-3">
              {avatarStyles.map((s) => (
                <button
                  type="button"
                  key={s.name}
                  onClick={() => setFormData({ ...formData, avatarColor: s.value })}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    formData.avatarColor === s.value ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#060911] scale-110" : "opacity-70 hover:opacity-100"
                  }`}
                  style={{ background: s.value }}
                  title={s.name}
                >
                  {formData.avatarColor === s.value && <Check size={14} color="#04121a" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. Alex Chen"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Username *</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 text-sm">@</span>
                <input
                  type="text"
                  required
                  value={(formData.username || "").replace(/^@/, "")}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/^@/, "") })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="alexchen"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. alex.chen@university.edu"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone Number</label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. +1 (555) 234-5678"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree / Major</label>
              <input
                type="text"
                value={formData.degree || ""}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Academic Year</label>
              <input
                type="text"
                value={formData.year || ""}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. 3rd Year"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Career</label>
              <select
                value={formData.targetCareer || ""}
                onChange={(e) => setFormData({ ...formData, targetCareer: e.target.value })}
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
              >
                {ONBOARD_CAREERS.map((c) => (
                  <option key={c} value={c} className="bg-[#0a0f1c] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Location</label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. San Francisco, CA"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Bio / Professional Headline</label>
            <textarea
              rows={3}
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your learning goals and tech passions..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">GitHub Profile</label>
              <input
                type="text"
                value={formData.github || ""}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="github.com/username"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">LinkedIn Profile</label>
              <input
                type="text"
                value={formData.linkedin || ""}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="linkedin.com/in/username"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Check size={15} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProfileView({ student = STUDENT, onUpdateStudent, onBack }) {
  const [showAssessment, setShowAssessment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingFileInfo, setPendingFileInfo] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const fileInputRef = useRef(null);
  const profile = student || STUDENT;

  const handleTriggerFileSelect = () => {
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError("Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("Image size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result) {
        setPendingImage(result);
        const formattedSize = file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
        setPendingFileInfo({ name: file.name, size: formattedSize });
        setPreviewOpen(true);
        setUploadError(null);
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmImage = () => {
    if (pendingImage) {
      const updated = { ...profile, profilePicture: pendingImage };
      if (onUpdateStudent) {
        onUpdateStudent(updated, "Profile picture updated successfully");
      }
    }
    setPreviewOpen(false);
    setPendingImage(null);
    setPendingFileInfo(null);
  };

  const handleCancelImage = () => {
    setPreviewOpen(false);
    setPendingImage(null);
    setPendingFileInfo(null);
  };

  const handleRemovePicture = () => {
    const updated = { ...profile, profilePicture: null };
    if (onUpdateStudent) {
      onUpdateStudent(updated, "Profile picture removed");
    }
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
      {/* Hidden file input for picture upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">Account & Portfolio</span>
            </div>
            <h1 className="lp-display text-2xl font-bold text-white">Profile</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search profile..."
              className="bg-transparent text-sm text-white placeholder-slate-400 outline-none w-36 md:w-48"
            />
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ring-2 ring-cyan-400/40 overflow-hidden"
            style={{ background: profile.avatarColor || "linear-gradient(135deg,#22d3ee,#8b5cf6)", color: "#04121a" }}
          >
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span>{profile.name ? profile.name.charAt(0) : "A"}</span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Header Hero Card */}
      <GlassCard strong className="p-6 md:p-8 relative overflow-hidden" hover>
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%)" }} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar with status and edit overlay */}
            <div className="relative group shrink-0 self-start sm:self-center">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-2xl transition-transform group-hover:scale-105 overflow-hidden relative border-2 border-white/15"
                style={{ background: profile.avatarColor || "linear-gradient(135deg,#22d3ee,#8b5cf6)", color: "#04121a" }}
              >
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{profile.name ? profile.name.charAt(0) : "A"}</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleTriggerFileSelect}
                title="Upload Profile Picture"
                className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-[#0a0f1c] border border-white/20 flex items-center justify-center text-cyan-400 hover:text-white hover:border-cyan-400 transition-colors shadow-lg cursor-pointer"
              >
                <Camera size={15} />
              </button>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#060911]" title="Active status: Online" />
            </div>

            {/* Main Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="lp-display text-2xl md:text-3xl font-semibold tracking-tight text-white">{profile.name}</h2>
                <span className="text-sm font-medium text-cyan-400">@{profile.username || "alexchen"}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)", color: "#67e8f9" }}>
                  <ShieldCheck size={12} /> Verified Learner
                </span>
              </div>

              {/* Email and Meta */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
                  <Mail size={14} className="text-cyan-400" />
                  <span>{profile.email}</span>
                </a>
                <span>•</span>
                <span>{profile.degree} · {profile.year}</span>
                {profile.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-violet-400" />
                      <span>{profile.location}</span>
                    </span>
                  </>
                )}
              </div>

              {/* Bio summary */}
              {profile.bio && (
                <p className="text-xs md:text-sm max-w-2xl pt-1 text-slate-300 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Career Goal & Readiness Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                <Pill tone="violet">Target: {profile.targetCareer}</Pill>
                <Pill tone="cyan">94% career match</Pill>
                <Pill tone="green">72% Readiness</Pill>
              </div>

              {/* Picture Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleTriggerFileSelect}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera size={12} /> {profile.profilePicture ? "Change Picture" : "Add Picture"}
                </button>
                {profile.profilePicture && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} /> Remove Picture
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile Action Button */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="lp-btn-primary px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle size={14} />
            <span>{uploadError}</span>
          </div>
        )}
      </GlassCard>

      {/* Profile Overview Description */}
      <p className="text-sm max-w-4xl" style={{ color: "var(--text-dim)" }}>
        This profile combines your academic background, previous learning, technical skills, projects, certifications, interests, assessments and
        career aspirations to generate your adaptive learning pathway, recommend personalized resources, identify skill gaps, validate conceptual
        understanding and drive your AI career guidance.
      </p>

      {/* Grid: Academic & Contact Profile */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover>
          <SectionHeader title="Academic profile" />
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "var(--text-dim)" }}>Full name</span>
              <span className="font-medium text-white">{profile.name}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "var(--text-dim)" }}>Username</span>
              <span className="font-medium text-cyan-300">@{profile.username || "alexchen"}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "var(--text-dim)" }}>Degree program</span>
              <span className="font-medium text-white">{profile.degree}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "var(--text-dim)" }}>Current standing</span>
              <span className="font-medium text-white">{profile.year}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "var(--text-dim)" }}>Target career</span>
              <span className="font-medium text-cyan-300">{profile.targetCareer}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span style={{ color: "var(--text-dim)" }}>Enrollment status</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 size={13} /> Active Student
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover>
          <SectionHeader title="Contact & Social links" />
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
                <Mail size={14} className="text-cyan-400" /> Email
              </span>
              <a href={`mailto:${profile.email}`} className="text-white hover:text-cyan-300 transition-colors font-medium">
                {profile.email}
              </a>
            </div>
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
                <Phone size={14} className="text-violet-400" /> Phone
              </span>
              <span className="font-medium text-white">{profile.phone || "+1 (555) 234-5678"}</span>
            </div>
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
                <MapPin size={14} className="text-amber-400" /> Location
              </span>
              <span className="font-medium text-white">{profile.location || "San Francisco, CA"}</span>
            </div>
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
                <Globe size={14} className="text-slate-300" /> GitHub
              </span>
              <span className="font-medium text-cyan-400 flex items-center gap-1 cursor-pointer hover:underline">
                {profile.github || "github.com/alexchen-dev"} <ExternalLink size={11} />
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
                <Globe size={14} className="text-blue-400" /> LinkedIn
              </span>
              <span className="font-medium text-blue-400 flex items-center gap-1 cursor-pointer hover:underline">
                {profile.linkedin || "linkedin.com/in/alexchen-ai"} <ExternalLink size={11} />
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Grid: Previous Learning & Technical Skills */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover>
          <SectionHeader title="Previous learning" subtitle="Completed coursework and foundational credits" />
          <div className="space-y-2.5">
            {PREVIOUS_LEARNING.map(c => (
              <div key={c.title} className="flex items-start gap-2.5">
                <CheckCircle2 size={15} color="#34d399" className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">{c.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>{c.provider} · {c.when}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover>
          <SectionHeader title="Certifications & Interests" />
          <div className="space-y-3 mb-5">
            {OWNED_CERTIFICATIONS.map(c => (
              <div key={c.title} className="flex items-center gap-2.5">
                <Award size={15} color="#c4b5fd" className="shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">{c.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>{c.provider}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs font-medium text-slate-300 mb-2">Areas of Interest</p>
          <div className="flex flex-wrap gap-1.5">
            {INTERESTS.map(i => <Pill key={i} tone="violet">{i}</Pill>)}
          </div>
        </GlassCard>
      </div>

      {/* Technical Skills with Radar Chart */}
      <GlassCard className="p-6" hover>
        <SectionHeader title="Technical skills" subtitle="Detected from courses, projects, certifications and assessments" />
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            {SKILL_GROUPS.map((g, gi) => (
              <div key={g.name} className="mb-5 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{g.name}</span>
                  <span className="text-sm" style={{ color: "#67e8f9" }}>{g.level}%</span>
                </div>
                <ProgressBar value={g.level} tone="cyan" height={8} delay={gi * 80} />
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="text-xs mr-1 flex items-center gap-1" style={{ color: "#6ee7b7" }}><CheckCircle2 size={13} /></span>
              {STRENGTHS.map(s => <Pill key={s} tone="green">{s}</Pill>)}
              {GAPS.map(s => <Pill key={s} tone="amber">{s}</Pill>)}
            </div>
          </div>
          <div className="lg:col-span-2" style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <RadarChart data={RADAR_DATA} outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.12)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#8b93a7", fontSize: 10 }} />
                <RechartsRadar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.28} />
                <RTooltip contentStyle={{ background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* Projects */}
      <GlassCard className="p-6" hover>
        <SectionHeader title="Projects portfolio" subtitle="Shipped applications and repositories" />
        <div className="grid md:grid-cols-3 gap-4">
          {OWNED_PROJECTS.map(p => (
            <div key={p.title} className="p-4 rounded-xl lp-glass flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-white mb-1.5">{p.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>{p.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-cyan-400">
                <span>Verified repository</span>
                <FolderKanban size={13} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Assessments */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <SectionHeader title="Assessments" subtitle="Latest knowledge validation results" />
          <button onClick={() => setShowAssessment(true)} className="lp-btn-primary px-4 py-2 rounded-lg text-sm cursor-pointer">
            Take new assessment
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing value={78} size={96} stroke={8} sublabel="last score" />
          <div className="flex-1 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}><CheckCircle2 size={13} /> Strong</p>
              <div className="flex flex-wrap gap-1.5">{["Python", "OOP"].map(s => <Pill key={s} tone="green">{s}</Pill>)}</div>
            </div>
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#fbbf24" }}><AlertTriangle size={13} /> Needs improvement</p>
              <div className="flex flex-wrap gap-1.5">{["SQL joins", "Probability"].map(s => <Pill key={s} tone="amber">{s}</Pill>)}</div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Career Aspirations */}
      <GlassCard strong className="p-6" hover>
        <SectionHeader title="Career aspirations" />
        <div className="flex flex-wrap items-center gap-8">
          <div><p className="lp-display text-xl font-semibold text-white">{profile.targetCareer}</p><p className="text-xs" style={{ color: "var(--text-dim)" }}>Target career</p></div>
          <div><p className="lp-display text-xl font-semibold" style={{ color: "#67e8f9" }}>94%</p><p className="text-xs" style={{ color: "var(--text-dim)" }}>Career match</p></div>
          <div><p className="lp-display text-xl font-semibold" style={{ color: "#c4b5fd" }}>72%</p><p className="text-xs" style={{ color: "var(--text-dim)" }}>Readiness</p></div>
        </div>
      </GlassCard>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        student={profile}
        onSave={(updated) => {
          if (onUpdateStudent) onUpdateStudent(updated, "Profile updated successfully");
        }}
      />

      {/* Image Preview & Confirmation Modal */}
      <ImagePreviewModal
        open={previewOpen}
        imageSrc={pendingImage}
        fileInfo={pendingFileInfo}
        onConfirm={handleConfirmImage}
        onCancel={handleCancelImage}
      />
    </div>
  );
}

export default ProfileView;
