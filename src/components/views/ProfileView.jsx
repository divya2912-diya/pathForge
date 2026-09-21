import React, { useState, useRef, useMemo } from "react";
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Award, Mail, Edit3, Camera,
  MapPin, ExternalLink, Phone, Globe, ShieldCheck, Check, X,
  FolderKanban, Trash2, Search, Plus, BookOpen, Briefcase, GraduationCap,
  Sparkles, Code, Link as LinkIcon, Calendar, Layers, CheckSquare, Clock, AlertCircle
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
import {
  computeUserSkillGroups,
  computeUserRadarData,
  calculateDynamicReadiness,
  SKILL_REQUIREMENTS
} from "../../data/userProfile";

// Helper: URL format validation
function isValidUrl(url) {
  if (!url || !url.trim()) return true;
  const str = url.trim();
  try {
    const parsed = new URL(str.startsWith("http://") || str.startsWith("https://") ? str : `https://${str}`);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ── Reusable Modal Backdrop ──────────────────────────────────────
function ModalShell({ open, title, subtitle, icon: Icon, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md lp-fade-up">
      <div className="w-full max-w-xl lp-glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)" }}>
                <Icon size={16} className="text-cyan-400" />
              </div>
            )}
            <div>
              <h3 className="lp-display text-base font-semibold text-white">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto lp-scrollbar p-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirmation Dialog ──────────────────────────────────
function DeleteConfirmModal({ open, title, itemName, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md lp-fade-up">
      <div className="w-full max-w-sm lp-glass-strong rounded-2xl border border-rose-500/30 shadow-2xl p-6 space-y-4 text-center">
        <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <Trash2 size={24} />
        </div>
        <div className="space-y-1">
          <h3 className="lp-display text-base font-semibold text-white">{title || "Confirm Deletion"}</h3>
          <p className="text-xs text-slate-300">
            Are you sure you want to delete <span className="font-semibold text-white">"{itemName}"</span>? This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white shadow-lg transition-colors cursor-pointer">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 1. Academic & Personal Profile Modal ─────────────────────────
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
    <ModalShell open={open} title="Edit Academic & General Profile" subtitle="Update your student background information" icon={Edit3} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Avatar Theme</label>
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
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree / Program</label>
            <input type="text" value={formData.degree || ""} onChange={e => setFormData({ ...formData, degree: e.target.value })} className={inp} placeholder="e.g. B.Tech Computer Science" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Academic Standing / Year</label>
            <input type="text" value={formData.year || ""} onChange={e => setFormData({ ...formData, year: e.target.value })} className={inp} placeholder="e.g. 3rd Year" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Career Goal</label>
            <select value={formData.targetCareer || ""} onChange={e => setFormData({ ...formData, targetCareer: e.target.value })} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors">
              {ONBOARD_CAREERS.map(c => <option key={c} value={c} className="bg-[#0a0f1c] text-white">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Enrollment Status</label>
            <select value={formData.enrollmentStatus || "Active Student"} onChange={e => setFormData({ ...formData, enrollmentStatus: e.target.value })} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors">
              {["Active Student", "Graduated", "On Leave", "Self-Taught Learner"].map(s => <option key={s} value={s} className="bg-[#0a0f1c] text-white">{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Bio / Professional Headline</label>
          <textarea rows={3} value={formData.bio || ""} onChange={e => setFormData({ ...formData, bio: e.target.value })} className={`${inp} resize-none`} placeholder="Describe your technical interests, learning goals, or background..." />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20">
            <Check size={15} /> Save Academic Profile
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ── 2. Contact & Social Links Modal ─────────────────────────────
function EditContactModal({ open, onClose, student, onSave }) {
  const [formData, setFormData] = useState({});
  const [err, setErr] = useState("");

  React.useEffect(() => {
    if (student) setFormData({
      phone: student.phone || "",
      location: student.location || "",
      github: student.github || "",
      linkedin: student.linkedin || "",
      portfolio: student.portfolio || "",
    });
  }, [student, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    if (formData.github && !isValidUrl(formData.github)) { setErr("Invalid GitHub URL format."); return; }
    if (formData.linkedin && !isValidUrl(formData.linkedin)) { setErr("Invalid LinkedIn URL format."); return; }
    if (formData.portfolio && !isValidUrl(formData.portfolio)) { setErr("Invalid Portfolio URL format."); return; }

    onSave(formData);
    onClose();
  };

  const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors";

  return (
    <ModalShell open={open} title="Edit Contact & Social Links" subtitle="Update your contact channels and professional links" icon={Globe} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {err && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={14} /> {err}
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone Number</label>
            <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inp} placeholder="+1 555-0199 or +91 9876543210" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Location</label>
            <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className={inp} placeholder="City, Country" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">GitHub Profile URL</label>
          <input type="text" value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} className={inp} placeholder="https://github.com/yourusername" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">LinkedIn Profile URL</label>
          <input type="text" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className={inp} placeholder="https://linkedin.com/in/yourusername" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Personal Portfolio / Website</label>
          <input type="text" value={formData.portfolio} onChange={e => setFormData({ ...formData, portfolio: e.target.value })} className={inp} placeholder="https://yourportfolio.com" />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20">
            <Check size={15} /> Save Links
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ── 3. Manage Skill Modal ────────────────────────────────────────
function SkillModal({ open, onClose, skillToEdit, onSave }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Programming");
  const [proficiency, setProficiency] = useState("Intermediate");

  React.useEffect(() => {
    if (skillToEdit) {
      setName(skillToEdit.name || "");
      setCategory(skillToEdit.category || "Programming");
      setProficiency(skillToEdit.proficiency || "Intermediate");
    } else {
      setName(""); setCategory("Programming"); setProficiency("Intermediate");
    }
  }, [skillToEdit, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ id: skillToEdit?.id || Date.now().toString(), name: name.trim(), category, proficiency });
    onClose();
  };

  const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors";

  return (
    <ModalShell open={open} title={skillToEdit ? "Edit Technical Skill" : "Add Technical Skill"} subtitle="Define skill name, category, and proficiency" icon={Code} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Skill Name *</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inp} placeholder="e.g. Python, Docker, PostgreSQL, React" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors">
            {["Programming", "Data & Databases", "Web & Frameworks", "Tools & Systems", "AI / Machine Learning", "Other"].map(c => (
              <option key={c} value={c} className="bg-[#0a0f1c] text-white">{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Proficiency Level</label>
          <select value={proficiency} onChange={e => setProficiency(e.target.value)} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors">
            <option value="Beginner" className="bg-[#0a0f1c] text-white">Beginner (25%)</option>
            <option value="Intermediate" className="bg-[#0a0f1c] text-white">Intermediate (50%)</option>
            <option value="Advanced" className="bg-[#0a0f1c] text-white">Advanced (75%)</option>
            <option value="Expert" className="bg-[#0a0f1c] text-white">Expert (100%)</option>
          </select>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20">
            <Check size={15} /> {skillToEdit ? "Save Skill" : "Add Skill"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ── 4. Manage Learning Record Modal ──────────────────────────────
function LearningModal({ open, onClose, recordToEdit, onSave }) {
  const [courseName, setCourseName] = useState("");
  const [provider, setProvider] = useState("");
  const [courseType, setCourseType] = useState("Course");
  const [completionYear, setCompletionYear] = useState("");
  const [description, setDescription] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [err, setErr] = useState("");

  React.useEffect(() => {
    if (recordToEdit) {
      setCourseName(recordToEdit.courseName || "");
      setProvider(recordToEdit.provider || "");
      setCourseType(recordToEdit.courseType || "Course");
      setCompletionYear(recordToEdit.completionYear || "");
      setDescription(recordToEdit.description || "");
      setCertificateUrl(recordToEdit.certificateUrl || "");
    } else {
      setCourseName(""); setProvider(""); setCourseType("Course"); setCompletionYear(""); setDescription(""); setCertificateUrl("");
    }
    setErr("");
  }, [recordToEdit, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    if (!courseName.trim()) { setErr("Course name is required."); return; }
    if (certificateUrl && !isValidUrl(certificateUrl)) { setErr("Invalid certificate URL format."); return; }

    onSave({
      id: recordToEdit?.id || Date.now().toString(),
      courseName: courseName.trim(),
      provider: provider.trim(),
      courseType,
      completionYear: completionYear.trim(),
      description: description.trim(),
      certificateUrl: certificateUrl.trim(),
    });
    onClose();
  };

  const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors";

  return (
    <ModalShell open={open} title={recordToEdit ? "Edit Learning Record" : "Add Previous Learning"} subtitle="Document completed courses, degrees, or self-paced learning" icon={BookOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {err && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"><AlertCircle size={14} />{err}</div>}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Course / Learning Title *</label>
          <input type="text" required value={courseName} onChange={e => setCourseName(e.target.value)} className={inp} placeholder="e.g. Data Structures & Algorithms, Machine Learning Specialization" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Provider / Institution</label>
            <input type="text" value={provider} onChange={e => setProvider(e.target.value)} className={inp} placeholder="e.g. Coursera, MIT OpenCourseWare, EduSkills" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Type</label>
            <select value={courseType} onChange={e => setCourseType(e.target.value)} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors">
              {["Course", "University Coursework", "Self-Paced", "Bootcamp", "Workshop"].map(t => <option key={t} value={t} className="bg-[#0a0f1c] text-white">{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Completion Year / Date</label>
          <input type="text" value={completionYear} onChange={e => setCompletionYear(e.target.value)} className={inp} placeholder="e.g. 2026 or Completed 2025" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Short Description</label>
          <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className={`${inp} resize-none`} placeholder="Topics covered, skills learned, key achievements..." />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Certificate URL (Optional)</label>
          <input type="text" value={certificateUrl} onChange={e => setCertificateUrl(e.target.value)} className={inp} placeholder="https://certificate-link.com/view" />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20">
            <Check size={15} /> {recordToEdit ? "Save Record" : "Add Record"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ── 5. Manage Certification Modal ───────────────────────────────
function CertModal({ open, onClose, certToEdit, onSave }) {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [err, setErr] = useState("");

  React.useEffect(() => {
    if (certToEdit) {
      setName(certToEdit.name || "");
      setIssuer(certToEdit.issuer || "");
      setIssueDate(certToEdit.issueDate || "");
      setCredentialId(certToEdit.credentialId || "");
      setCredentialUrl(certToEdit.credentialUrl || "");
    } else {
      setName(""); setIssuer(""); setIssueDate(""); setCredentialId(""); setCredentialUrl("");
    }
    setErr("");
  }, [certToEdit, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) { setErr("Certification name is required."); return; }
    if (credentialUrl && !isValidUrl(credentialUrl)) { setErr("Invalid Credential URL format."); return; }

    onSave({
      id: certToEdit?.id || Date.now().toString(),
      name: name.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate.trim(),
      credentialId: credentialId.trim(),
      credentialUrl: credentialUrl.trim(),
    });
    onClose();
  };

  const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors";

  return (
    <ModalShell open={open} title={certToEdit ? "Edit Certification" : "Add Certification"} subtitle="Add industry certifications and credentials" icon={Award} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {err && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"><AlertCircle size={14} />{err}</div>}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Certification Name *</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inp} placeholder="e.g. AWS Certified Developer, TensorFlow Certificate" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Issuing Organization</label>
            <input type="text" value={issuer} onChange={e => setIssuer(e.target.value)} className={inp} placeholder="e.g. Amazon Web Services, DeepLearning.AI" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Issue Date / Year</label>
            <input type="text" value={issueDate} onChange={e => setIssueDate(e.target.value)} className={inp} placeholder="e.g. 2026 or Mar 2025" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Credential ID (Optional)</label>
            <input type="text" value={credentialId} onChange={e => setCredentialId(e.target.value)} className={inp} placeholder="e.g. AWS-12345678" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Credential URL (Optional)</label>
            <input type="text" value={credentialUrl} onChange={e => setCredentialUrl(e.target.value)} className={inp} placeholder="https://credential-check.com/verify" />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20">
            <Check size={15} /> {certToEdit ? "Save Certification" : "Add Certification"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ── 6. Manage Project Modal ──────────────────────────────────────
function ProjectModal({ open, onClose, projectToEdit, onSave }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [detailedDesc, setDetailedDesc] = useState("");
  const [tech, setTech] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [status, setStatus] = useState("Completed");
  const [err, setErr] = useState("");

  React.useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || projectToEdit.title || "");
      setDesc(projectToEdit.desc || projectToEdit.description || "");
      setDetailedDesc(projectToEdit.detailedDesc || "");
      setTech(Array.isArray(projectToEdit.skills || projectToEdit.technologies) ? (projectToEdit.skills || projectToEdit.technologies).join(", ") : (projectToEdit.tech || ""));
      setGithubUrl(projectToEdit.githubUrl || projectToEdit.github || "");
      setLiveUrl(projectToEdit.liveUrl || projectToEdit.live || "");
      setCategory(projectToEdit.category || "Web Development");
      setStatus(projectToEdit.status || "Completed");
    } else {
      setName(""); setDesc(""); setDetailedDesc(""); setTech(""); setGithubUrl(""); setLiveUrl(""); setCategory("Web Development"); setStatus("Completed");
    }
    setErr("");
  }, [projectToEdit, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) { setErr("Project title is required."); return; }
    if (githubUrl && !isValidUrl(githubUrl)) { setErr("Invalid GitHub Repository URL."); return; }
    if (liveUrl && !isValidUrl(liveUrl)) { setErr("Invalid Live Demo URL."); return; }

    const techArray = tech.split(",").map(t => t.trim()).filter(Boolean);

    onSave({
      id: projectToEdit?.id || Date.now().toString(),
      name: name.trim(),
      title: name.trim(),
      desc: desc.trim(),
      description: desc.trim(),
      detailedDesc: detailedDesc.trim(),
      skills: techArray,
      technologies: techArray,
      tech: tech.trim(),
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim(),
      category,
      status,
    });
    onClose();
  };

  const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors";

  return (
    <ModalShell open={open} title={projectToEdit ? "Edit Project" : "Add Personal Project"} subtitle="Showcase portfolio projects you have built" icon={FolderKanban} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {err && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"><AlertCircle size={14} />{err}</div>}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Project Name *</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inp} placeholder="e.g. AI Resume Analyzer, E-Commerce Platform" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors">
              {["Web Development", "Mobile App", "AI / Machine Learning", "Cloud / DevOps", "Systems", "Other"].map(c => <option key={c} value={c} className="bg-[#0a0f1c] text-white">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Project Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors">
              <option value="Completed" className="bg-[#0a0f1c] text-white">Completed</option>
              <option value="In Progress" className="bg-[#0a0f1c] text-white">In Progress</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Short Summary / Tagline</label>
          <input type="text" value={desc} onChange={e => setDesc(e.target.value)} className={inp} placeholder="Brief summary of what the project does..." />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Technologies / Tech Stack (comma separated)</label>
          <input type="text" value={tech} onChange={e => setTech(e.target.value)} className={inp} placeholder="e.g. React, Python, FastAPI, Docker, PostgreSQL" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">GitHub Repository URL</label>
            <input type="text" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className={inp} placeholder="https://github.com/user/project" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Live Demo URL</label>
            <input type="text" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className={inp} placeholder="https://myproject.vercel.app" />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20">
            <Check size={15} /> {projectToEdit ? "Save Project" : "Add Project"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ── 7. Manage Interest Modal ──────────────────────────────────────
function InterestModal({ open, onClose, onAdd }) {
  const [interest, setInterest] = useState("");
  const suggestions = ["Artificial Intelligence", "Backend Development", "Cloud & DevOps", "Cybersecurity", "Data Science", "Web Development", "Mobile Apps", "UI/UX Design", "System Architecture", "NLP"];

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (interest.trim()) {
      onAdd(interest.trim());
      setInterest("");
      onClose();
    }
  };

  const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors";

  return (
    <ModalShell open={open} title="Add Area of Interest" subtitle="Tag tech areas you are passionate about exploring" icon={Briefcase} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Interest / Domain Name</label>
          <input type="text" required value={interest} onChange={e => setInterest(e.target.value)} className={inp} placeholder="e.g. Cloud Computing, Deep Learning" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Or select from quick suggestions:</label>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map(s => (
              <button key={s} type="button" onClick={() => { onAdd(s); onClose(); }} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors cursor-pointer">
                + {s}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20">
            <Check size={15} /> Add Interest
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ── Image Preview Crop Modal ─────────────────────────────────────
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

// ── Main ProfileView ─────────────────────────────────────────────
export function ProfileView({ student, onUpdateStudent, onBack }) {
  const [showAssessment, setShowAssessment] = useState(false);
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Skill state
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState(null);

  // Learning state
  const [learningModalOpen, setLearningModalOpen] = useState(false);
  const [learningToEdit, setLearningToEdit] = useState(null);

  // Certification state
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certToEdit, setCertToEdit] = useState(null);

  // Project state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  // Interest state
  const [interestModalOpen, setInterestModalOpen] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'skill'|'learning'|'cert'|'project'|'interest', item }

  // Avatar state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingFileInfo, setPendingFileInfo] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const profile = student || {};

  // Compute real dynamic skill groups & radar data strictly from user data
  const userSkillsList = useMemo(() => profile.userSkillsList || [], [profile.userSkillsList]);
  const plainSkills     = useMemo(() => profile.skills || [], [profile.skills]);
  const skillGroups     = useMemo(() => computeUserSkillGroups(userSkillsList, plainSkills), [userSkillsList, plainSkills]);
  const radarData       = useMemo(() => computeUserRadarData(userSkillsList, plainSkills), [userSkillsList, plainSkills]);
  const hasSkills       = skillGroups.length > 0;

  // Real assessment data
  const assessmentScore   = profile.assessmentScore ?? null;
  const assessmentAnswers = profile.assessmentAnswers || null;
  const strongAreas       = assessmentAnswers?.strong || [];
  const weakAreas         = assessmentAnswers?.weak   || [];

  // Real readiness computation
  const computedReadiness = useMemo(() => calculateDynamicReadiness(profile), [profile]);

  // ── Helper updates ──────────────────────────────────────────────
  const handleSaveSkill = (skillObj) => {
    const list = [...userSkillsList];
    const idx = list.findIndex(s => s.id === skillObj.id);
    if (idx >= 0) list[idx] = skillObj;
    else list.push(skillObj);

    // Keep plain string array in sync
    const plain = Array.from(new Set([...plainSkills, skillObj.name]));
    onUpdateStudent?.({ ...profile, userSkillsList: list, skills: plain }, "Technical skill saved successfully");
  };

  const handleDeleteSkill = (skillId) => {
    const list = userSkillsList.filter(s => s.id !== skillId);
    const targetItem = userSkillsList.find(s => s.id === skillId);
    const plain = plainSkills.filter(s => s.toLowerCase() !== (targetItem?.name || "").toLowerCase());
    onUpdateStudent?.({ ...profile, userSkillsList: list, skills: plain }, "Skill deleted");
  };

  const handleSaveLearning = (recordObj) => {
    const list = [...(profile.learningRecords || [])];
    const idx = list.findIndex(r => r.id === recordObj.id);
    if (idx >= 0) list[idx] = recordObj;
    else list.push(recordObj);
    onUpdateStudent?.({ ...profile, learningRecords: list }, "Learning record saved successfully");
  };

  const handleDeleteLearning = (recordId) => {
    const list = (profile.learningRecords || []).filter(r => r.id !== recordId);
    onUpdateStudent?.({ ...profile, learningRecords: list }, "Learning record deleted");
  };

  const handleSaveCert = (certObj) => {
    const list = [...(profile.certificationsList || [])];
    const idx = list.findIndex(c => c.id === certObj.id);
    if (idx >= 0) list[idx] = certObj;
    else list.push(certObj);
    onUpdateStudent?.({ ...profile, certificationsList: list }, "Certification saved successfully");
  };

  const handleDeleteCert = (certId) => {
    const list = (profile.certificationsList || []).filter(c => c.id !== certId);
    onUpdateStudent?.({ ...profile, certificationsList: list }, "Certification deleted");
  };

  const handleSaveProject = (projObj) => {
    const list = [...(profile.projectsList || [])];
    const idx = list.findIndex(p => p.id === projObj.id);
    if (idx >= 0) list[idx] = projObj;
    else list.push(projObj);
    onUpdateStudent?.({ ...profile, projectsList: list }, "Project saved successfully");
  };

  const handleDeleteProject = (projId) => {
    const list = (profile.projectsList || []).filter(p => p.id !== projId);
    onUpdateStudent?.({ ...profile, projectsList: list }, "Project deleted");
  };

  const handleAddInterest = (interestName) => {
    const existing = profile.interests || [];
    if (existing.some(i => i.toLowerCase() === interestName.toLowerCase())) return;
    onUpdateStudent?.({ ...profile, interests: [...existing, interestName] }, "Interest added");
  };

  const handleDeleteInterest = (interestName) => {
    const list = (profile.interests || []).filter(i => i !== interestName);
    onUpdateStudent?.({ ...profile, interests: list }, "Interest removed");
  };

  // Avatar file select
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
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image size exceeds 8MB. Please choose a smaller image."); return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result;
      if (!src) return;

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const dim = 250;
          canvas.width = dim;
          canvas.height = dim;
          const ctx = canvas.getContext("2d");

          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;

          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, dim, dim);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.88);

          setPendingImage(compressedDataUrl);
          const sizeKB = `${(compressedDataUrl.length * 0.75 / 1024).toFixed(1)} KB`;
          setPendingFileInfo({ name: file.name, size: sizeKB });
          setPreviewOpen(true);
          setUploadError(null);
        } catch {
          setPendingImage(src);
          setPendingFileInfo({ name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` });
          setPreviewOpen(true);
        }
      };
      img.onerror = () => setUploadError("Failed to process image.");
      img.src = src;
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

  // Delete modal confirm action
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { type, item } = deleteTarget;
    if (type === "skill") handleDeleteSkill(item.id);
    else if (type === "learning") handleDeleteLearning(item.id);
    else if (type === "cert") handleDeleteCert(item.id);
    else if (type === "project") handleDeleteProject(item.id);
    else if (type === "interest") handleDeleteInterest(item);
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  // If viewing active Assessment quiz
  if (showAssessment) {
    return (
      <div className="space-y-6">
        <button onClick={() => setShowAssessment(false)} className="flex items-center gap-1.5 text-sm cursor-pointer hover:text-white transition-colors" style={{ color: "var(--text-dim)" }}>
          <ArrowLeft size={15} /> Back to profile
        </button>
        <AssessmentView
          onSaveResult={(res) => {
            onUpdateStudent?.({ ...profile, ...res }, "Assessment score saved successfully");
            setShowAssessment(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} className="hidden" />

      {/* Top Header / Navigation */}
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
                <h2 className="lp-display text-2xl md:text-3xl font-semibold tracking-tight text-white">{profile.name || "Student"}</h2>
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
                {computedReadiness != null ? (
                  <Pill tone="green">{computedReadiness}% Readiness</Pill>
                ) : (
                  <span className="text-xs text-slate-400 italic">Add details to compute readiness</span>
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
            <button type="button" onClick={() => setIsEditingAcademic(true)}
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

      {/* Academic & Contact Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Academic Profile Card */}
        <GlassCard className="p-6" hover>
          <div className="flex items-center justify-between mb-4">
            <SectionHeader title="Academic profile" />
            <button type="button" onClick={() => setIsEditingAcademic(true)} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer">
              <Edit3 size={13} /> Edit
            </button>
          </div>
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
                {value ? (
                  <span className={`font-medium ${cyan ? "text-cyan-300" : "text-white"}`}>{value}</span>
                ) : (
                  <button type="button" onClick={() => setIsEditingAcademic(true)} className="text-xs text-slate-500 hover:text-cyan-400 italic flex items-center gap-1">
                    <Plus size={12} /> Add {label.toLowerCase()}
                  </button>
                )}
              </div>
            ))}
            <div className="flex justify-between py-1.5">
              <span style={{ color: "var(--text-dim)" }}>Enrollment status</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 size={13} /> {profile.enrollmentStatus || "Active Student"}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Contact & Social Links Card */}
        <GlassCard className="p-6" hover>
          <div className="flex items-center justify-between mb-4">
            <SectionHeader title="Contact & Social links" />
            <button type="button" onClick={() => setIsEditingContact(true)} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer">
              <Edit3 size={13} /> Edit Links
            </button>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}><Mail size={14} className="text-cyan-400" /> Email</span>
              <a href={`mailto:${profile.email}`} className="text-white hover:text-cyan-300 transition-colors font-medium">{profile.email || "Not added"}</a>
            </div>
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}><Phone size={14} className="text-violet-400" /> Phone</span>
              {profile.phone ? (
                <span className="font-medium text-white">{profile.phone}</span>
              ) : (
                <span className="text-xs text-slate-500 italic">Not added</span>
              )}
            </div>
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}><MapPin size={14} className="text-amber-400" /> Location</span>
              {profile.location ? (
                <span className="font-medium text-white">{profile.location}</span>
              ) : (
                <span className="text-xs text-slate-500 italic">Not added</span>
              )}
            </div>
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}><Globe size={14} className="text-slate-300" /> GitHub</span>
              {profile.github ? (
                <a href={profile.github.startsWith("http") ? profile.github : `https://${profile.github}`} target="_blank" rel="noreferrer"
                  className="font-medium text-cyan-400 flex items-center gap-1 hover:underline">
                  {profile.github.replace(/^https?:\/\//, "")} <ExternalLink size={11} />
                </a>
              ) : (
                <span className="text-xs text-slate-500 italic">Not added</span>
              )}
            </div>
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}><Globe size={14} className="text-blue-400" /> LinkedIn</span>
              {profile.linkedin ? (
                <a href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noreferrer"
                  className="font-medium text-blue-400 flex items-center gap-1 hover:underline">
                  {profile.linkedin.replace(/^https?:\/\//, "")} <ExternalLink size={11} />
                </a>
              ) : (
                <span className="text-xs text-slate-500 italic">Not added</span>
              )}
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}><LinkIcon size={14} className="text-emerald-400" /> Portfolio</span>
              {profile.portfolio ? (
                <a href={profile.portfolio.startsWith("http") ? profile.portfolio : `https://${profile.portfolio}`} target="_blank" rel="noreferrer"
                  className="font-medium text-emerald-400 flex items-center gap-1 hover:underline">
                  {profile.portfolio.replace(/^https?:\/\//, "")} <ExternalLink size={11} />
                </a>
              ) : (
                <span className="text-xs text-slate-500 italic">Not added</span>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Skills Management & Dynamic Technical Breakdown */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <SectionHeader title="Technical skills" subtitle="Managed by student & evaluated dynamically" />
          <button type="button" onClick={() => { setSkillToEdit(null); setSkillModalOpen(true); }} className="lp-btn-primary px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Add Skill
          </button>
        </div>

        {hasSkills ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {userSkillsList.map(s => (
                <div key={s.id || s.name} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-white">
                  <span className="font-medium text-cyan-300">{s.name}</span>
                  <span className="text-[10px] text-slate-400">({s.proficiency || "Intermediate"})</span>
                  <button type="button" onClick={() => { setSkillToEdit(s); setSkillModalOpen(true); }} className="text-slate-400 hover:text-cyan-400 ml-1">
                    <Edit3 size={11} />
                  </button>
                  <button type="button" onClick={() => { setDeleteTarget({ type: "skill", item: s }); setDeleteModalOpen(true); }} className="text-slate-400 hover:text-rose-400">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-6 pt-4 border-t border-white/10">
              <div className="lg:col-span-3 space-y-5">
                {skillGroups.map((g, gi) => (
                  <div key={g.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{g.name}</span>
                      <span className="text-sm font-semibold" style={{ color: "#67e8f9" }}>{g.level}%</span>
                    </div>
                    <ProgressBar value={g.level} tone="cyan" height={8} delay={gi * 80} />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {g.matched.map(s => <span key={s} className="text-[10px] text-slate-400">{s}</span>).reduce((a, b, i) => [...a, i > 0 ? <span key={`sep-${i}`} className="text-[10px] text-slate-600">·</span> : null, b], [])}
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-2 flex flex-col items-center justify-center" style={{ width: "100%", height: 230 }}>
                {radarData ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData} outerRadius="75%">
                      <PolarGrid stroke="rgba(255,255,255,0.12)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#8b93a7", fontSize: 10 }} />
                      <RechartsRadar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.28} />
                      <RTooltip contentStyle={{ background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-xs text-slate-500">Not enough category data for radar visualization</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <BookOpen size={36} className="text-slate-600" />
            <p className="text-sm text-slate-400 font-medium">No skills added yet.</p>
            <p className="text-xs text-slate-500 max-w-sm">Complete your profile and add your technical skills to generate your skill radar profile.</p>
            <button type="button" onClick={() => { setSkillToEdit(null); setSkillModalOpen(true); }} className="lp-btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer mt-1">
              <Plus size={14} /> Add Skill
            </button>
          </div>
        )}
      </GlassCard>

      {/* Areas of Interest Card */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <SectionHeader title="Areas of interest" subtitle="Specialization domains & tech topics" />
          <button type="button" onClick={() => setInterestModalOpen(true)} className="lp-btn-primary px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Add Interest
          </button>
        </div>

        {profile.interests?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.interests.map(i => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs text-violet-300">
                <span>{i}</span>
                <button type="button" onClick={() => { setDeleteTarget({ type: "interest", item: i }); setDeleteModalOpen(true); }} className="hover:text-rose-400 transition-colors">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <Briefcase size={32} className="text-slate-600" />
            <p className="text-sm text-slate-400 font-medium">No interests added yet.</p>
            <p className="text-xs text-slate-500">Click "+ Add Interest" to list your tech domain interests.</p>
          </div>
        )}
      </GlassCard>

      {/* Previous Learning Card */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <SectionHeader title="Previous learning" subtitle="Document completed courses, degrees, or workshops" />
          <button type="button" onClick={() => { setLearningToEdit(null); setLearningModalOpen(true); }} className="lp-btn-primary px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Add Learning
          </button>
        </div>

        {profile.learningRecords?.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.learningRecords.map(rec => (
              <div key={rec.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-400/30 transition-all space-y-2 relative group">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{rec.courseName}</h4>
                    <p className="text-xs text-cyan-400">{rec.provider || "Self-Paced"}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => { setLearningToEdit(rec); setLearningModalOpen(true); }} className="p-1 text-slate-400 hover:text-cyan-300">
                      <Edit3 size={13} />
                    </button>
                    <button type="button" onClick={() => { setDeleteTarget({ type: "learning", item: rec }); setDeleteModalOpen(true); }} className="p-1 text-slate-400 hover:text-rose-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Pill tone="violet">{rec.courseType || "Course"}</Pill>
                  {rec.completionYear && <span>{rec.completionYear}</span>}
                </div>

                {rec.description && <p className="text-xs text-slate-300 leading-relaxed pt-1">{rec.description}</p>}

                {rec.certificateUrl && (
                  <a href={rec.certificateUrl.startsWith("http") ? rec.certificateUrl : `https://${rec.certificateUrl}`} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline pt-1">
                    <ExternalLink size={12} /> View Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <BookOpen size={32} className="text-slate-600" />
            <p className="text-sm text-slate-400 font-medium">No learning records added yet.</p>
            <p className="text-xs text-slate-500">Add completed coursework or self-paced study records.</p>
          </div>
        )}
      </GlassCard>

      {/* Certifications Card */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <SectionHeader title="Certifications & credentials" subtitle="Verified industry certs" />
          <button type="button" onClick={() => { setCertToEdit(null); setCertModalOpen(true); }} className="lp-btn-primary px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Add Certification
          </button>
        </div>

        {profile.certificationsList?.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.certificationsList.map(cert => (
              <div key={cert.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-400/30 transition-all space-y-2 relative group">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{cert.name}</h4>
                    <p className="text-xs text-violet-400">{cert.issuer || "Issuing Organization"}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => { setCertToEdit(cert); setCertModalOpen(true); }} className="p-1 text-slate-400 hover:text-cyan-300">
                      <Edit3 size={13} />
                    </button>
                    <button type="button" onClick={() => { setDeleteTarget({ type: "cert", item: cert }); setDeleteModalOpen(true); }} className="p-1 text-slate-400 hover:text-rose-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                  {cert.issueDate && <span>Issued: {cert.issueDate}</span>}
                  {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                </div>

                {cert.credentialUrl && (
                  <a href={cert.credentialUrl.startsWith("http") ? cert.credentialUrl : `https://${cert.credentialUrl}`} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline pt-1">
                    <ExternalLink size={12} /> View Credential
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <Award size={36} className="text-slate-600" />
            <p className="text-sm text-slate-400 font-medium">No certifications added yet.</p>
            <p className="text-xs text-slate-500">Add your credentials or certificates to boost your profile score.</p>
          </div>
        )}
      </GlassCard>

      {/* Projects Portfolio Card */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <SectionHeader title="Projects portfolio" subtitle="Real applications & code repositories" />
          <button type="button" onClick={() => { setProjectToEdit(null); setProjectModalOpen(true); }} className="lp-btn-primary px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Add Project
          </button>
        </div>

        {profile.projectsList?.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.projectsList.map(p => {
              const pSkills = p.skills || p.technologies || [];
              return (
                <div key={p.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-400/30 transition-all space-y-3 relative group flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-semibold text-white">{p.name || p.title}</h4>
                          <Pill tone={p.status === "In Progress" ? "amber" : "green"}>{p.status || "Completed"}</Pill>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{p.category || "Web Development"}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => { setProjectToEdit(p); setProjectModalOpen(true); }} className="p-1 text-slate-400 hover:text-cyan-300">
                          <Edit3 size={14} />
                        </button>
                        <button type="button" onClick={() => { setDeleteTarget({ type: "project", item: p }); setDeleteModalOpen(true); }} className="p-1 text-slate-400 hover:text-rose-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {(p.desc || p.description) && (
                      <p className="text-xs text-slate-300 leading-relaxed">{p.desc || p.description}</p>
                    )}

                    {pSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {pSkills.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">{t}</span>)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-white/10 text-xs">
                    {(p.githubUrl || p.github) && (
                      <a href={(p.githubUrl || p.github).startsWith("http") ? (p.githubUrl || p.github) : `https://${p.githubUrl || p.github}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-cyan-400 hover:underline">
                        <Globe size={12} /> Repository
                      </a>
                    )}
                    {(p.liveUrl || p.live) && (
                      <a href={(p.liveUrl || p.live).startsWith("http") ? (p.liveUrl || p.live) : `https://${p.liveUrl || p.live}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-emerald-400 hover:underline">
                        <ExternalLink size={12} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <FolderKanban size={38} className="text-slate-600" />
            <p className="text-sm text-slate-400 font-medium">No projects added yet.</p>
            <p className="text-xs text-slate-500">Showcase your portfolio applications to boost your hiring readiness.</p>
            <button type="button" onClick={() => { setProjectToEdit(null); setProjectModalOpen(true); }} className="lp-btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer mt-1">
              <Plus size={14} /> Add Project
            </button>
          </div>
        )}
      </GlassCard>

      {/* Assessments Card */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <SectionHeader title="Assessments" subtitle="Real knowledge validation results" />
          <button onClick={() => setShowAssessment(true)} className="lp-btn-primary px-4 py-2 rounded-lg text-sm cursor-pointer">
            {assessmentScore != null ? "Retake assessment" : "Take assessment"}
          </button>
        </div>
        {assessmentScore != null ? (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ProgressRing value={assessmentScore} size={96} stroke={8} sublabel="last score" />
            <div className="flex-1 grid sm:grid-cols-2 gap-4">
              {strongAreas.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}><CheckCircle2 size={13} /> Strong areas</p>
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
            <p className="text-sm text-slate-400 font-medium">No assessments completed yet.</p>
            <p className="text-xs text-slate-500">Take an assessment to record your actual knowledge validation score.</p>
            <button onClick={() => setShowAssessment(true)} className="lp-btn-primary px-4 py-2 rounded-xl text-xs cursor-pointer mt-1">Start Assessment</button>
          </div>
        )}
      </GlassCard>

      {/* Career Aspirations Card */}
      <GlassCard strong className="p-6" hover>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Career aspirations" />
          <button type="button" onClick={() => setIsEditingAcademic(true)} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer">
            <Edit3 size={13} /> Edit Career Goals
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-8">
          <div>
            <p className="lp-display text-xl font-semibold text-white">{profile.targetCareer || "Software Engineer"}</p>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Target career</p>
          </div>
          {computedReadiness != null ? (
            <div>
              <p className="lp-display text-xl font-semibold text-cyan-300">{computedReadiness}%</p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>Dynamic Readiness</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-sm italic">
              <Plus size={14} />
              <span>Complete your profile to calculate career readiness.</span>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Modals */}
      <EditProfileModal open={isEditingAcademic} onClose={() => setIsEditingAcademic(false)} student={profile} onSave={updated => onUpdateStudent?.(updated, "Academic profile updated")} />
      <EditContactModal open={isEditingContact} onClose={() => setIsEditingContact(false)} student={profile} onSave={updated => onUpdateStudent?.(updated, "Contact links updated")} />
      <SkillModal open={skillModalOpen} onClose={() => setSkillModalOpen(false)} skillToEdit={skillToEdit} onSave={handleSaveSkill} />
      <LearningModal open={learningModalOpen} onClose={() => setLearningModalOpen(false)} recordToEdit={learningToEdit} onSave={handleSaveLearning} />
      <CertModal open={certModalOpen} onClose={() => setCertModalOpen(false)} certToEdit={certToEdit} onSave={handleSaveCert} />
      <ProjectModal open={projectModalOpen} onClose={() => setProjectModalOpen(false)} projectToEdit={projectToEdit} onSave={handleSaveProject} />
      <InterestModal open={interestModalOpen} onClose={() => setInterestModalOpen(false)} onAdd={handleAddInterest} />
      <ImagePreviewModal open={previewOpen} imageSrc={pendingImage} fileInfo={pendingFileInfo} onConfirm={handleConfirmImage} onCancel={() => { setPreviewOpen(false); setPendingImage(null); setPendingFileInfo(null); }} />
      <DeleteConfirmModal open={deleteModalOpen} title="Delete Item" itemName={deleteTarget?.item?.name || deleteTarget?.item?.title || deleteTarget?.item?.courseName || deleteTarget?.item} onClose={() => { setDeleteModalOpen(false); setDeleteTarget(null); }} onConfirm={handleConfirmDelete} />
    </div>
  );
}

export default ProfileView;
