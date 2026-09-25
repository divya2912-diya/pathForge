import React, { useState, useRef } from "react";
import {
  UploadCloud, Loader2, AlertTriangle, Sparkles, ChevronRight,
  RefreshCw, FileText, X, CheckCircle2, Target, Briefcase, 
  ExternalLink, Layers, Search, FileCode2, Check, ArrowRight
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ProgressRing from "../ui/ProgressRing";
import ProgressBar from "../ui/ProgressBar";
import Pill from "../ui/Pill";
import { SKILL_REQUIREMENTS } from "../../data/userProfile";
import { extractTextFromPDF } from "../../utils/pdfParser";

function getRequiredSkillsForCareer(targetCareer) {
  if (!targetCareer) return [];
  if (SKILL_REQUIREMENTS[targetCareer]) return SKILL_REQUIREMENTS[targetCareer];
  
  const careerLower = targetCareer.toLowerCase();
  if (careerLower.includes("react") || careerLower.includes("frontend")) {
    return ["JavaScript", "React", "HTML/CSS", "Git", "TypeScript", "REST APIs"];
  }
  if (careerLower.includes("node") || careerLower.includes("backend") || careerLower.includes("python")) {
    return ["Python", "Node.js", "SQL", "REST APIs", "Git", "System Design", "Docker"];
  }
  if (careerLower.includes("ai") || careerLower.includes("ml") || careerLower.includes("data")) {
    return ["Python", "Machine Learning", "Statistics", "SQL", "Deep Learning", "Docker"];
  }
  if (careerLower.includes("full") || careerLower.includes("web")) {
    return ["JavaScript", "React", "Node.js", "SQL", "Git", "HTML/CSS"];
  }
  return ["Problem Solving", "Git", "Data Structures", "System Design", "SQL"];
}

export function ResumeView({ student, onUpdateStudent, go }) {
  const [phase, setPhase] = useState("idle"); // idle | analyzing | results
  const [analysisMode, setAnalysisMode] = useState("career"); // career | job-description
  const [jobDescriptionInput, setJobDescriptionInput] = useState("");
  
  const [fileInfo, setFileInfo] = useState(student?.resumeFile || null);
  const [extractedText, setExtractedText] = useState(student?.resumeText || "");
  const [rawFile, setRawFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(student?.resumeAnalysis || null);
  
  const inputRef = useRef(null);

  const targetCareer = student?.targetCareer;
  const requiredSkills = getRequiredSkillsForCareer(targetCareer);

  // File Handler
  const handleFile = async (file) => {
    if (!file) return;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(file.type) && !["pdf", "doc", "docx"].includes(ext)) {
      alert("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeKB = (file.size / 1024).toFixed(0);
    const info = {
      name: file.name,
      size: file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`,
      type: ext.toUpperCase(),
      updatedAt: new Date().toLocaleDateString()
    };
    
    setRawFile(file);
    setFileInfo(info);

    // Read Text
    try {
      let text = "";
      if (ext === "pdf") {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }
      setExtractedText(text);
      onUpdateStudent?.({ ...student, resumeFile: info, resumeText: text }, "Resume file ready!");
    } catch (err) {
      console.error("Text extraction notice:", err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // Perform Real ATS Analysis
  const analyzeResume = async () => {
    if (!extractedText && !rawFile) {
      alert("Please upload a resume file first.");
      return;
    }
    setPhase("analyzing");

    try {
      let text = extractedText;
      if (!text && rawFile) {
        if (fileInfo?.type === "PDF") text = await extractTextFromPDF(rawFile);
        else text = await rawFile.text();
      }

      const textLower = text.toLowerCase();

      // 1. EXTRACT CONTACT INFO & DETECT SECTIONS
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.]?\d{4}/);
      const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
      const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);
      const portfolioMatch = text.match(/(http|https):\/\/[a-zA-Z0-9./_-]+/i);

      const contactInfo = {
        email: emailMatch ? emailMatch[0] : "Not detected in resume",
        phone: phoneMatch ? phoneMatch[0] : "Not detected in resume",
        linkedin: linkedinMatch ? linkedinMatch[0] : "Not detected in resume",
        github: githubMatch ? githubMatch[0] : "Not detected in resume",
        portfolio: portfolioMatch ? portfolioMatch[0] : "Not detected in resume"
      };

      // 2. SECTION DETECTION
      const sectionKeywords = {
        Education: ["education", "university", "bachelor", "master", "degree", "gpa", "college"],
        Skills: ["skills", "technical skills", "programming", "technologies", "frameworks", "tools"],
        Projects: ["projects", "personal projects", "portfolio projects", "key projects"],
        Experience: ["experience", "work history", "employment", "professional experience"],
        Internships: ["internship", "intern", "trainee"],
        Certifications: ["certifications", "certificates", "credentials", "licenses"],
        Achievements: ["achievements", "awards", "honors", "accomplishments"]
      };

      const detectedSections = [];
      const missingSections = [];

      Object.entries(sectionKeywords).forEach(([section, keywords]) => {
        if (keywords.some(k => textLower.includes(k))) {
          detectedSections.push(section);
        } else {
          missingSections.push(section);
        }
      });

      // 3. TARGET CAREER OR JOB DESCRIPTION SKILL MATCHING
      let targetSkillList = requiredSkills;
      if (analysisMode === "job-description" && jobDescriptionInput.trim()) {
        const jdLower = jobDescriptionInput.toLowerCase();
        // Extract technical keywords from pasted job description
        const commonTech = [
          "JavaScript", "React", "Node.js", "Python", "Java", "C++", "SQL", "PostgreSQL",
          "MongoDB", "Docker", "Kubernetes", "AWS", "Git", "HTML/CSS", "TypeScript",
          "REST APIs", "System Design", "Machine Learning", "Statistics", "Deep Learning",
          "TensorFlow", "PyTorch", "Tableau", "Figma", "Linux", "Networking"
        ];
        targetSkillList = commonTech.filter(tech => jdLower.includes(tech.toLowerCase()));
        if (targetSkillList.length === 0) targetSkillList = requiredSkills;
      }

      const matchedSkills = targetSkillList.filter(s => textLower.includes(s.toLowerCase()));
      const missingSkills = targetSkillList.filter(s => !textLower.includes(s.toLowerCase()));

      // 4. ACTION VERBS & MEASURABLE IMPACT DETECTOR
      const hasMetrics = /\b\d{1,3}%\b|\$\d+/.test(textLower) || /\b(increased|decreased|improved|reduced) by\b/.test(textLower);
      const hasActionVerbs = /\b(developed|led|architected|managed|optimized|implemented|designed|built|engineered)\b/i.test(text);

      // 5. EXPLAINABLE ATS SCORE CALCULATION (0-100%)
      const skillScore = targetSkillList.length > 0 ? (matchedSkills.length / targetSkillList.length) * 50 : 30;
      const sectionScore = (detectedSections.length / Object.keys(sectionKeywords).length) * 20;
      const metricsScore = (hasMetrics ? 10 : 0) + (hasActionVerbs ? 10 : 0);
      const contactScore = (emailMatch || phoneMatch ? 5 : 0) + (githubMatch || linkedinMatch ? 5 : 0);

      const atsScore = Math.min(98, Math.max(25, Math.round(skillScore + sectionScore + metricsScore + contactScore)));

      // 6. DYNAMIC IMPROVEMENT SUGGESTIONS (Strictly grounded in real resume content)
      const suggestions = [];
      if (missingSkills.length > 0) {
        suggestions.push(`Your resume lacks keywords for your ${targetCareer || "target"} role: ${missingSkills.slice(0, 3).join(", ")}.`);
      }
      if (!hasMetrics) {
        suggestions.push("Project descriptions lack measurable outcomes. Add impact metrics like 'Increased performance by 15%' or '$10k saved'.");
      }
      if (!hasActionVerbs) {
        suggestions.push("Start bullet points with strong action verbs (e.g., 'Engineered', 'Architected', 'Optimized').");
      }
      if (!githubMatch && !linkedinMatch) {
        suggestions.push("Your GitHub or LinkedIn profile link was not detected in the header.");
      }
      if (missingSections.includes("Certifications")) {
        suggestions.push("A Certifications section was not detected. Adding relevant technical certifications boosts ATS ranking.");
      }
      if (suggestions.length === 0) {
        suggestions.push("Your resume matches core requirements strongly! Keep your skills and project links updated.");
      }

      const results = {
        atsScore,
        matchedSkills,
        missingSkills,
        detectedSections,
        missingSections,
        contactInfo,
        hasMetrics,
        hasActionVerbs,
        suggestions,
        analyzedTarget: analysisMode === "job-description" ? "Custom Job Description" : targetCareer,
        analyzedAt: new Date().toLocaleString()
      };

      setAnalysisResults(results);
      onUpdateStudent?.({ ...student, resumeAnalysis: results }, "Resume analysis complete!");
      setPhase("results");

    } catch (err) {
      console.error("Resume analysis error:", err);
      alert("Failed to analyze resume text. Please check the file format.");
      setPhase("idle");
    }
  };

  const reset = () => {
    setPhase("idle");
    setAnalysisResults(null);
  };

  const removeFile = (e) => {
    e?.stopPropagation();
    setFileInfo(null);
    setRawFile(null);
    setExtractedText("");
    setAnalysisResults(null);
    onUpdateStudent?.({ ...student, resumeFile: null, resumeText: null, resumeAnalysis: null }, "Resume removed");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <SectionHeader 
            eyebrow="Resume Intelligence & ATS Optimization" 
            title="Resume Analyzer" 
            subtitle="Genuine ATS scoring, contact parsing, and skill-gap analysis against your target career." 
          />
        </div>

        {targetCareer && (
          <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2 shrink-0">
            <Target size={15} /> Target Role: {targetCareer}
          </div>
        )}
      </div>

      {/* ── MISSING TARGET CAREER GUARDRAIL ────────────────────────────── */}
      {!targetCareer && (
        <GlassCard className="p-8 text-center border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
          <AlertTriangle size={44} className="mx-auto text-amber-400 mb-3" />
          <h3 className="text-lg font-bold text-white">Set your target career before analyzing your resume.</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-6">
            PathForge evaluates your uploaded resume skills against industry standards for your specific target role.
          </p>
          <button 
            onClick={() => go?.("profile")} 
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-bold text-xs text-white hover:from-amber-400 shadow-md transition-all cursor-pointer"
          >
            Set Target Career →
          </button>
        </GlassCard>
      )}

      {/* ── ANALYSIS MODE TAB TOGGLE ────────────────────────────────────── */}
      {targetCareer && (
        <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit">
          <button 
            onClick={() => setAnalysisMode("career")} 
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              analysisMode === "career" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Target size={14} /> Analyze Against Target Role ({targetCareer})
          </button>
          <button 
            onClick={() => setAnalysisMode("job-description")} 
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              analysisMode === "job-description" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileCode2 size={14} /> Analyze Against Job Description
          </button>
        </div>
      )}

      {/* ── PASTE JOB DESCRIPTION TEXTAREA (IF MODE IS JOB DESCRIPTION) ─── */}
      {targetCareer && analysisMode === "job-description" && (
        <GlassCard className="p-5 space-y-3 border-cyan-500/20">
          <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} /> Paste Target Job Description
          </label>
          <textarea
            rows={4}
            value={jobDescriptionInput}
            onChange={(e) => setJobDescriptionInput(e.target.value)}
            placeholder="Paste real Job Description text here to compare required skills against your uploaded resume..."
            className="w-full bg-[#060911] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </GlassCard>
      )}

      {/* ── UPLOAD / FILE MANAGEMENT ZONE ──────────────────────────────── */}
      {targetCareer && phase === "idle" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div
            className="rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer"
            style={{
              background: dragOver ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.02)",
              border: `2px dashed ${dragOver ? "rgba(34,211,238,0.6)" : "rgba(255,255,255,0.15)"}`,
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !fileInfo && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              id="resume-file-input"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {fileInfo ? (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  <FileText size={28} />
                </div>
                <div>
                  <p className="font-bold text-white text-base">{fileInfo.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {fileInfo.type} · {fileInfo.size} {fileInfo.updatedAt && `· Added ${fileInfo.updatedAt}`}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} /> Resume file ready for analysis
                </div>
              </div>
            ) : (
              <>
                <UploadCloud size={40} className="mx-auto mb-3 text-cyan-400" />
                <h3 className="text-sm font-bold text-white mb-1">
                  {dragOver ? "Drop your resume here" : "No resume uploaded yet"}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Drag and drop your PDF or DOCX file, or click to browse (up to 5MB)
                </p>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#060911] font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Upload Resume
                </button>
              </>
            )}
          </div>

          {/* Action buttons when file exists */}
          {fileInfo && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Replace Resume
                </button>
                <button
                  onClick={removeFile}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-300 transition-all cursor-pointer"
                >
                  Remove Resume
                </button>
              </div>

              <button
                onClick={analyzeResume}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles size={14} /> Analyze Resume Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── ANALYZING STATE ────────────────────────────────────────────── */}
      {phase === "analyzing" && (
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-20 text-center">
          <Loader2 size={36} className="animate-spin text-cyan-400 mb-4" />
          <h3 className="text-base font-bold text-white mb-1">Performing Genuine ATS Analysis...</h3>
          <p className="text-xs text-slate-400">
            Scanning {fileInfo?.name} against {analysisMode === "job-description" ? "Job Description" : targetCareer} requirements
          </p>
          <div className="mt-6 space-y-2 text-xs text-slate-400 text-left max-w-xs">
            {["Extracting text content...", "Detecting sections & contact links...", "Matching target career keywords...", "Calculating explainable ATS compatibility score..."].map((msg, i) => (
              <p key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {msg}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ── ANALYSIS RESULTS VIEW ──────────────────────────────────────── */}
      {phase === "results" && analysisResults && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Top Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FileText size={14} className="text-cyan-400" />
              Analyzed File: <span className="text-white font-bold">{fileInfo?.name}</span> ({analysisResults.analyzedTarget})
            </div>

            <button
              onClick={reset}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} /> Re-analyze / Change Options
            </button>
          </div>

          {/* ATS Metrics Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <GlassCard strong className="p-6 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">ATS Compatibility</p>
              <ProgressRing value={analysisResults.atsScore} size={95} stroke={8} tone="#22d3ee" />
              <p className="text-xs mt-3 font-semibold text-cyan-300">
                {analysisResults.atsScore >= 75 ? "Strong ATS Match" : analysisResults.atsScore >= 55 ? "Moderate Match" : "High Skill Gaps"}
              </p>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col justify-center">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Matched Keywords</p>
              <p className="lp-display text-2xl font-bold text-white mb-2">
                {analysisResults.matchedSkills.length}<span className="text-xs text-slate-500"> / {analysisResults.matchedSkills.length + analysisResults.missingSkills.length} required</span>
              </p>
              <ProgressBar 
                value={Math.round((analysisResults.matchedSkills.length / Math.max(1, analysisResults.matchedSkills.length + analysisResults.missingSkills.length)) * 100)} 
                tone="cyan" 
                height={6} 
              />
            </GlassCard>

            <GlassCard className="p-6 flex flex-col justify-center">
              <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-1">Missing Keywords</p>
              <p className="lp-display text-2xl font-bold text-amber-400 mb-2">
                {analysisResults.missingSkills.length}<span className="text-xs text-slate-500"> gaps</span>
              </p>
              <ProgressBar 
                value={Math.round((analysisResults.missingSkills.length / Math.max(1, analysisResults.matchedSkills.length + analysisResults.missingSkills.length)) * 100)} 
                tone="amber" 
                height={6} 
              />
            </GlassCard>
          </div>

          {/* Extracted Contact Info Grid */}
          <GlassCard className="p-5 space-y-3">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Search size={14} /> Parsed Contact & Profile Information
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div><span className="text-slate-500 block">Email:</span> <span className="font-semibold text-slate-200">{analysisResults.contactInfo.email}</span></div>
              <div><span className="text-slate-500 block">Phone:</span> <span className="font-semibold text-slate-200">{analysisResults.contactInfo.phone}</span></div>
              <div><span className="text-slate-500 block">LinkedIn:</span> <span className="font-semibold text-slate-200">{analysisResults.contactInfo.linkedin}</span></div>
              <div><span className="text-slate-500 block">GitHub:</span> <span className="font-semibold text-slate-200">{analysisResults.contactInfo.github}</span></div>
              <div><span className="text-slate-500 block">Portfolio:</span> <span className="font-semibold text-slate-200">{analysisResults.contactInfo.portfolio}</span></div>
            </div>
          </GlassCard>

          {/* Section Detection & Skill Breakdown */}
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Detected vs Missing Sections */}
            <GlassCard className="p-5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} className="text-cyan-400" /> Detected Resume Sections
              </h4>
              <div className="space-y-1.5 text-xs">
                {analysisResults.detectedSections.map(sec => (
                  <div key={sec} className="flex items-center gap-2 text-emerald-400 font-medium">
                    <CheckCircle2 size={13} /> {sec} Section
                  </div>
                ))}
                {analysisResults.missingSections.map(sec => (
                  <div key={sec} className="flex items-center gap-2 text-slate-500 font-medium">
                    <X size={13} /> {sec} — Not detected in resume
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Improvement Suggestions */}
            <GlassCard className="p-5 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> Actionable ATS Suggestions
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysisResults.suggestions.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight size={13} className="text-amber-400 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Matched vs Missing Skills Badges */}
          <div className="grid sm:grid-cols-2 gap-4">
            <GlassCard className="p-5">
              <p className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 size={14} /> Matched Skills Found ({analysisResults.matchedSkills.length})
              </p>
              {analysisResults.matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {analysisResults.matchedSkills.map(s => <Pill key={s} tone="green">{s}</Pill>)}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No matching technical skills detected for this target role.</p>
              )}
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle size={14} /> Missing Required Skills ({analysisResults.missingSkills.length})
              </p>
              {analysisResults.missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {analysisResults.missingSkills.map(s => <Pill key={s} tone="amber">{s}</Pill>)}
                </div>
              ) : (
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={14} /> No critical missing skills detected!
                </p>
              )}
            </GlassCard>
          </div>

        </div>
      )}

    </div>
  );
}

export default ResumeView;
