import React, { useState, useRef } from "react";
import {
  ArrowLeft, ChevronRight, Check, Plus, Trash2, FileText, UploadCloud,
  Github, FolderKanban, Award, X, Search, Sparkles, CheckCircle2, AlertCircle, Edit3
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import ModalShell from "../ui/ModalShell";
import { ONBOARD_STEPS, ONBOARD_CAREERS } from "../../data/mockData";
import { extractTextFromPDF } from "../../utils/pdfParser";

export function OnboardingFlow({ onComplete, onBack, student }) {
  const [step, setStep] = useState(0);

  // Form State
  const [targetCareer, setTargetCareer] = useState(student?.targetCareer || "Full Stack Developer");
  const [customCareer, setCustomCareer] = useState("");
  
  // Skills State: Array of string names & Object array for proficiency [{ name, proficiency }]
  const [selectedSkills, setSelectedSkills] = useState(student?.skills || []);
  const [userSkillsList, setUserSkillsList] = useState(
    student?.userSkillsList || (student?.skills || []).map(s => ({ name: s, proficiency: "Intermediate" }))
  );
  const [skillSearch, setSkillSearch] = useState("");
  const [newCustomSkill, setNewCustomSkill] = useState("");

  // Step 3 Evidence State
  // 1. Resume
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeInfo, setResumeInfo] = useState(student?.resumeInfo || null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const fileInputRef = useRef(null);

  // 2. GitHub
  const [githubUrl, setGithubUrl] = useState(student?.github || "");

  // 3. Projects
  const [projectsList, setProjectsList] = useState(student?.projectsList || []);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    name: "", description: "", technologies: "", githubUrl: "", liveUrl: ""
  });

  // 4. Certifications
  const [certificationsList, setCertificationsList] = useState(student?.certificationsList || []);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({
    name: "", issuer: "", issueDate: "", credentialUrl: ""
  });

  // Step 4 Preferences State
  const [hoursPerWeek, setHoursPerWeek] = useState(student?.learningPreferences?.hoursPerWeek || "5–10 hours");
  const [learningStyle, setLearningStyle] = useState(student?.learningPreferences?.learningStyle || "Hands-on Projects");
  const [targetTimeline, setTargetTimeline] = useState(student?.learningPreferences?.targetTimeline || "3–6 months");

  // Pre-populated skills
  const ALL_SKILLS = [
    "Python", "Java", "C", "C++", "JavaScript", "TypeScript",
    "HTML/CSS", "React", "Node.js", "SQL", "MongoDB", "PostgreSQL",
    "Git", "Docker", "AWS", "Azure", "Linux", "Machine Learning",
    "Deep Learning", "Data Analysis", "Django", "Spring Boot"
  ];

  // ── Skill Handlers ──────────────────────────────────────────
  const toggleSkill = (skillName) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(prev => prev.filter(s => s !== skillName));
      setUserSkillsList(prev => prev.filter(s => s.name !== skillName));
    } else {
      setSelectedSkills(prev => [...prev, skillName]);
      setUserSkillsList(prev => [...prev, { name: skillName, proficiency: "Intermediate" }]);
    }
  };

  const updateProficiency = (skillName, newLevel) => {
    setUserSkillsList(prev => {
      const idx = prev.findIndex(s => s.name === skillName);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], proficiency: newLevel };
        return next;
      }
      return [...prev, { name: skillName, proficiency: newLevel }];
    });
  };

  const addCustomSkill = () => {
    const trimmed = newCustomSkill.trim();
    if (!trimmed) return;
    if (!selectedSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedSkills(prev => [...prev, trimmed]);
      setUserSkillsList(prev => [...prev, { name: trimmed, proficiency: "Intermediate" }]);
    }
    setNewCustomSkill("");
  };

  const getProficiency = (skillName) => {
    const found = userSkillsList.find(s => s.name === skillName);
    return found?.proficiency || "Intermediate";
  };

  // ── Resume Parsing Handler ──────────────────────────────────
  const handleResumeFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext)) {
      alert("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    setResumeFile(file);
    setIsParsingResume(true);

    try {
      let text = "";
      if (ext === "pdf") {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }

      const textLower = text.toLowerCase();
      // Scan against pre-populated skills
      const detected = ALL_SKILLS.filter(s => textLower.includes(s.toLowerCase()));

      setExtractedSkills(detected);
      setResumeInfo({
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(0) + " KB",
        uploadStatus: "Parsed successfully",
        extractedSkills: detected,
      });
    } catch (err) {
      console.error("Resume parse error:", err);
      setResumeInfo({
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(0) + " KB",
        uploadStatus: "Uploaded",
        extractedSkills: [],
      });
    } finally {
      setIsParsingResume(false);
    }
  };

  const importExtractedSkills = () => {
    if (extractedSkills.length === 0) return;
    const newSkills = [...selectedSkills];
    const newList = [...userSkillsList];

    extractedSkills.forEach(s => {
      if (!newSkills.includes(s)) {
        newSkills.push(s);
        newList.push({ name: s, proficiency: "Intermediate" });
      }
    });

    setSelectedSkills(newSkills);
    setUserSkillsList(newList);
  };

  // ── Project Handlers ────────────────────────────────────────
  const openAddProjectModal = () => {
    setEditingProject(null);
    setProjectForm({ name: "", description: "", technologies: "", githubUrl: "", liveUrl: "" });
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      name: proj.name || proj.title || "",
      description: proj.description || "",
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies || "",
      githubUrl: proj.githubUrl || proj.source_url || "",
      liveUrl: proj.liveUrl || proj.demo_url || "",
    });
    setProjectModalOpen(true);
  };

  const saveProject = (e) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;

    const techArr = projectForm.technologies
      ? projectForm.technologies.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    const newProj = {
      id: editingProject?.id || Date.now().toString(),
      name: projectForm.name.trim(),
      title: projectForm.name.trim(),
      description: projectForm.description.trim(),
      technologies: techArr,
      skills: techArr,
      githubUrl: projectForm.githubUrl.trim(),
      source_url: projectForm.githubUrl.trim(),
      liveUrl: projectForm.liveUrl.trim(),
      demo_url: projectForm.liveUrl.trim(),
    };

    if (editingProject) {
      setProjectsList(prev => prev.map(p => (p.id === editingProject.id ? newProj : p)));
    } else {
      setProjectsList(prev => [...prev, newProj]);
    }

    setProjectModalOpen(false);
  };

  const deleteProject = (id) => {
    setProjectsList(prev => prev.filter(p => p.id !== id));
  };

  // ── Certification Handlers ──────────────────────────────────
  const openAddCertModal = () => {
    setEditingCert(null);
    setCertForm({ name: "", issuer: "", issueDate: "", credentialUrl: "" });
    setCertModalOpen(true);
  };

  const openEditCertModal = (cert) => {
    setEditingCert(cert);
    setCertForm({
      name: cert.name || cert.title || "",
      issuer: cert.issuer || cert.provider || "",
      issueDate: cert.issueDate || "",
      credentialUrl: cert.credentialUrl || cert.official_url || "",
    });
    setCertModalOpen(true);
  };

  const saveCert = (e) => {
    e.preventDefault();
    if (!certForm.name.trim()) return;

    const newCert = {
      id: editingCert?.id || Date.now().toString(),
      name: certForm.name.trim(),
      title: certForm.name.trim(),
      issuer: certForm.issuer.trim(),
      provider: certForm.issuer.trim(),
      issueDate: certForm.issueDate.trim(),
      credentialUrl: certForm.credentialUrl.trim(),
      official_url: certForm.credentialUrl.trim(),
    };

    if (editingCert) {
      setCertificationsList(prev => prev.map(c => (c.id === editingCert.id ? newCert : c)));
    } else {
      setCertificationsList(prev => [...prev, newCert]);
    }

    setCertModalOpen(false);
  };

  const deleteCert = (id) => {
    setCertificationsList(prev => prev.filter(c => c.id !== id));
  };

  // ── Submit Handlers ─────────────────────────────────────────
  const finalCareer = targetCareer === "Other / Custom Career" ? (customCareer.trim() || "Software Engineer") : targetCareer;

  const handleNext = () => {
    if (step < ONBOARD_STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Step 4 Complete: Trigger payload
      onComplete({
        career: finalCareer,
        targetCareer: finalCareer,
        skills: selectedSkills,
        userSkillsList,
        projectsList,
        certificationsList,
        github: githubUrl.trim(),
        resumeInfo,
        learningPreferences: {
          hoursPerWeek,
          learningStyle,
          targetTimeline,
        },
        pace: hoursPerWeek,
      });
    }
  };

  // Filter skills by search query
  const filteredSkills = ALL_SKILLS.filter(s =>
    s.toLowerCase().includes(skillSearch.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-10 relative">
      {/* Radial glow background */}
      <div
        className="absolute -top-20 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.1), transparent 70%)" }}
      />

      <div className="w-full max-w-3xl relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs mb-5 cursor-pointer text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Welcome Greeting */}
        {student?.name && step === 0 && (
          <div className="mb-6 p-3.5 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/20 flex items-center gap-2 text-xs text-cyan-300">
            <Sparkles size={16} className="shrink-0 text-cyan-400" />
            <span>
              👋 Hi <strong>{student.name.split(" ")[0]}</strong>! Let's build your personalized career profile and roadmap.
            </span>
          </div>
        )}

        {/* Progress Bar Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            {ONBOARD_STEPS.map((s, i) => (
              <div
                key={s}
                className="flex-1 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background:
                    i <= step
                      ? "linear-gradient(90deg, #22d3ee, #8b5cf6)"
                      : "rgba(255,255,255,0.08)",
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-cyan-400 uppercase tracking-wider">
              Step {step + 1} of {ONBOARD_STEPS.length}
            </span>
            <span>{ONBOARD_STEPS[step]}</span>
          </div>
        </div>

        {/* Card Content Container */}
        <GlassCard strong className="p-6 md:p-8 lp-fade-up" key={step}>
          
          {/* ============================================================ */}
          {/* STEP 1 — CAREER GOAL                                         */}
          {/* ============================================================ */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="lp-display text-2xl font-bold mb-1 text-white">
                  What career are you targeting?
                </h2>
                <p className="text-xs text-slate-400">
                  Choose the role you want PathForge to help you prepare for.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {ONBOARD_CAREERS.map((c) => {
                  const isSelected = targetCareer === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setTargetCareer(c)}
                      className="text-left p-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer border"
                      style={
                        isSelected
                          ? { background: "rgba(34,211,238,0.12)", borderColor: "rgba(34,211,238,0.4)", color: "#67e8f9" }
                          : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "#eef1f7" }
                      }
                    >
                      <span className="text-sm font-medium">{c}</span>
                      {isSelected && <Check size={16} className="text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {targetCareer === "Other / Custom Career" && (
                <div className="pt-2 animate-fade-in">
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                    Specify Custom Career Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Embedded Systems Engineer, Game Developer..."
                    value={customCareer}
                    onChange={(e) => setCustomCareer(e.target.value)}
                    className="w-full bg-[#0a0f1c] border border-cyan-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2 — CURRENT SKILLS                                      */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="lp-display text-2xl font-bold mb-1 text-white">
                  What skills do you already have?
                </h2>
                <p className="text-xs text-slate-400">
                  Select the technologies you have experience with.
                </p>
              </div>

              {/* Search & Custom Skill Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search skills (e.g. React, Python, Docker)..."
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom skill..."
                    value={newCustomSkill}
                    onChange={(e) => setNewCustomSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                    className="bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-36 sm:w-44"
                  />
                  <button
                    onClick={addCustomSkill}
                    className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Selectable Skill Chips */}
              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1 hide-scrollbar">
                {filteredSkills.map((s) => {
                  const isSelected = selectedSkills.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border"
                      style={
                        isSelected
                          ? { background: "rgba(34,211,238,0.15)", borderColor: "rgba(34,211,238,0.4)", color: "#67e8f9" }
                          : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "#c7cede" }
                      }
                    >
                      {isSelected && <Check size={13} />}
                      {s}
                    </button>
                  );
                })}
              </div>

              {/* Selected Skills List with Proficiency Selectors */}
              {selectedSkills.length > 0 ? (
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-cyan-400 uppercase tracking-wider">
                      Selected Skills & Proficiency ({selectedSkills.length})
                    </span>
                    <span className="text-slate-500">Adjust proficiency levels below</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {selectedSkills.map((s) => {
                      const prof = getProficiency(s);
                      return (
                        <div
                          key={s}
                          className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.07] flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="font-semibold text-white truncate max-w-[120px]">{s}</span>
                          
                          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-lg border border-white/5">
                            {["Beginner", "Intermediate", "Advanced"].map((level) => (
                              <button
                                key={level}
                                onClick={() => updateProficiency(s, level)}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                                  prof === level
                                    ? "bg-cyan-500 text-[#060911] font-bold"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                {level.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4 bg-white/[0.01] rounded-xl border border-white/5">
                  No skills selected yet. Click skills above or add custom ones.
                </p>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3 — EXPERIENCE & EVIDENCE                               */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="lp-display text-2xl font-bold mb-1 text-white">
                  Show us what you've already built
                </h2>
                <p className="text-xs text-slate-400">
                  Use your real projects, resume and certifications to help PathForge understand your experience.
                </p>
              </div>

              <div className="space-y-4">
                {/* 1. RESUME SECTION */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">Resume</h3>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Optional</span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleResumeFileSelect}
                  />

                  {resumeInfo ? (
                    <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-semibold text-white flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          {resumeInfo.fileName}
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          {resumeInfo.fileSize} · Status: <span className="text-cyan-300 font-medium">{resumeInfo.uploadStatus}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {extractedSkills.length > 0 && (
                          <button
                            onClick={importExtractedSkills}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#060911] font-bold text-xs cursor-pointer transition-colors shadow-sm"
                          >
                            Import {extractedSkills.length} Skills
                          </button>
                        )}
                        <button
                          onClick={() => { setResumeFile(null); setResumeInfo(null); setExtractedSkills([]); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                          title="Remove resume"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-6 rounded-xl border-2 border-dashed border-white/15 hover:border-cyan-500/50 bg-white/[0.01] hover:bg-cyan-500/[0.03] transition-all cursor-pointer text-center"
                    >
                      <UploadCloud size={24} className="mx-auto text-cyan-400 mb-2" />
                      <p className="text-xs font-semibold text-white mb-1">
                        {isParsingResume ? "Parsing resume file..." : "Upload your Resume (PDF or DOCX)"}
                      </p>
                      <p className="text-[11px] text-slate-500">Extracts skills & experience automatically</p>
                    </div>
                  )}
                </div>

                {/* 2. GITHUB SECTION */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                  <div className="flex items-center gap-2">
                    <Github size={18} className="text-purple-400" />
                    <h3 className="text-sm font-bold text-white">GitHub Profile</h3>
                  </div>

                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                  <p className="text-[11px] text-slate-500">Your GitHub profile URL will be saved to your PathForge profile.</p>
                </div>

                {/* 3. PROJECTS SECTION */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderKanban size={18} className="text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">Projects ({projectsList.length})</h3>
                    </div>
                    <button
                      onClick={openAddProjectModal}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus size={13} /> Add Project
                    </button>
                  </div>

                  {projectsList.length > 0 ? (
                    <div className="space-y-2">
                      {projectsList.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-3 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-white">{p.name || p.title}</p>
                            <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">{p.description}</p>
                            {p.technologies && p.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {(Array.isArray(p.technologies) ? p.technologies : [p.technologies]).map((t, i) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-300 font-medium">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => openEditProjectModal(p)} className="p-1 text-slate-400 hover:text-cyan-300 rounded cursor-pointer">
                              <Edit3 size={13} />
                            </button>
                            <button onClick={() => deleteProject(p.id)} className="p-1 text-slate-400 hover:text-rose-400 rounded cursor-pointer">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-2">No projects added yet. Click "+ Add Project" above.</p>
                  )}
                </div>

                {/* 4. CERTIFICATIONS SECTION */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award size={18} className="text-amber-400" />
                      <h3 className="text-sm font-bold text-white">Certifications ({certificationsList.length})</h3>
                    </div>
                    <button
                      onClick={openAddCertModal}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus size={13} /> Add Certification
                    </button>
                  </div>

                  {certificationsList.length > 0 ? (
                    <div className="space-y-2">
                      {certificationsList.map((c) => (
                        <div
                          key={c.id}
                          className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-3 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-white">{c.name || c.title}</p>
                            <p className="text-amber-300/80 text-[11px] font-medium mt-0.5">{c.issuer || c.provider}</p>
                            {c.issueDate && <p className="text-slate-500 text-[10px]">Issued: {c.issueDate}</p>}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => openEditCertModal(c)} className="p-1 text-slate-400 hover:text-cyan-300 rounded cursor-pointer">
                              <Edit3 size={13} />
                            </button>
                            <button onClick={() => deleteCert(c.id)} className="p-1 text-slate-400 hover:text-rose-400 rounded cursor-pointer">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-2">No certifications added yet. Click "+ Add Certification" above.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4 — LEARNING PREFERENCES                                */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="lp-display text-2xl font-bold mb-1 text-white">
                  How do you want to reach your goal?
                </h2>
                <p className="text-xs text-slate-400">
                  Tell us about your learning availability and preferred style.
                </p>
              </div>

              {/* 1. Hours per week */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  1. Hours available per week
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {["3–5 hours", "5–10 hours", "10–15 hours", "15+ hours"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setHoursPerWeek(opt)}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center border ${
                        hoursPerWeek === opt
                          ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300"
                          : "bg-white/[0.03] border-white/10 text-slate-300 hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Preferred learning style */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  2. Preferred learning style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {["Hands-on Projects", "Courses", "Documentation", "Practice Problems", "Mixed"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setLearningStyle(opt)}
                      className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center border ${
                        learningStyle === opt
                          ? "bg-purple-500/15 border-purple-500/50 text-purple-300"
                          : "bg-white/[0.03] border-white/10 text-slate-300 hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Target timeline */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  3. Target timeline
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {["1–3 months", "3–6 months", "6–12 months", "No fixed deadline"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setTargetTimeline(opt)}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center border ${
                        targetTimeline === opt
                          ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300"
                          : "bg-white/[0.03] border-white/10 text-slate-300 hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Summary Box */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2.5 pt-4">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Profile Summary</p>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-slate-400">Target Role</span>
                  <span className="text-cyan-300 font-semibold truncate">{finalCareer}</span>

                  <span className="text-slate-400">Skills Selected</span>
                  <span className="text-white font-medium">{selectedSkills.length} skills</span>

                  <span className="text-slate-400">Projects Added</span>
                  <span className="text-white font-medium">{projectsList.length} projects</span>

                  <span className="text-slate-400">Certifications</span>
                  <span className="text-white font-medium">{certificationsList.length} certs</span>

                  <span className="text-slate-400">Commitment</span>
                  <span className="text-white font-medium">{hoursPerWeek}</span>
                </div>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            className={`lp-btn-ghost px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-opacity ${
              step === 0 ? "opacity-30 pointer-events-none" : ""
            }`}
          >
            Previous
          </button>
          
          <button
            id={`btn-onboard-step-${step}`}
            onClick={handleNext}
            className="lp-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            {step === ONBOARD_STEPS.length - 1 ? "Analyze my profile" : "Continue"}{" "}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── PROJECT MODAL ───────────────────────────────────────── */}
      <ModalShell
        open={projectModalOpen}
        title={editingProject ? "Edit Project" : "Add Project"}
        icon={FolderKanban}
        onClose={() => setProjectModalOpen(false)}
      >
        <form onSubmit={saveProject} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. AI Resume Analyzer"
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Project Description</label>
            <textarea
              rows={3}
              placeholder="Brief summary of what you built and key technical highlights..."
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Technologies Used (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, PostgreSQL, Docker"
              value={projectForm.technologies}
              onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">GitHub URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={projectForm.githubUrl}
                onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://myproject.com"
                value={projectForm.liveUrl}
                onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={() => setProjectModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl font-semibold text-slate-300 hover:text-white border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-[#060911] shadow-lg shadow-cyan-500/20"
            >
              {editingProject ? "Save Changes" : "Add Project"}
            </button>
          </div>
        </form>
      </ModalShell>

      {/* ── CERTIFICATION MODAL ─────────────────────────────────── */}
      <ModalShell
        open={certModalOpen}
        title={editingCert ? "Edit Certification" : "Add Certification"}
        icon={Award}
        onClose={() => setCertModalOpen(false)}
      >
        <form onSubmit={saveCert} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Certification Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Certified Cloud Practitioner"
              value={certForm.name}
              onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Issuing Organization *</label>
            <input
              type="text"
              required
              placeholder="e.g. Amazon Web Services, Coursera, Meta"
              value={certForm.issuer}
              onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Issue Date</label>
              <input
                type="text"
                placeholder="e.g. March 2026"
                value={certForm.issueDate}
                onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Credential URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={certForm.credentialUrl}
                onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={() => setCertModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl font-semibold text-slate-300 hover:text-white border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-[#060911] shadow-lg shadow-amber-500/20"
            >
              {editingCert ? "Save Changes" : "Add Certification"}
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}

export default OnboardingFlow;
