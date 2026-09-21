import React, { useState } from "react";
import { ArrowLeft, ChevronRight, Check } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { ONBOARD_STEPS, ONBOARD_CAREERS } from "../../data/mockData";

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs mb-1.5 block" style={{ color: "var(--text-dim)" }}>{label}</span>
      {children}
    </label>
  );
}

export function OnboardingFlow({ onComplete, onBack, student }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    degree: student?.degree || "B.Tech Computer Science",
    year: student?.year || "1st Year",
    skills: student?.skills || [],
    projects: student?.projects || "",
    interests: student?.interests || [],
    career: student?.targetCareer || "Software Engineer",
    pace: student?.pace || "Balanced",
  });

  const toggle = (key, val) => {
    setData(d => ({
      ...d,
      [key]: d[key].includes(val) ? d[key].filter(x => x !== val) : [...d[key], val]
    }));
  };

  const next = () => step < ONBOARD_STEPS.length - 1 ? setStep(step + 1) : onComplete(data);

  const SKILLS_LIST = [
    "Python", "Java", "C++", "C", "JavaScript", "TypeScript",
    "SQL", "Machine Learning", "Statistics", "Git", "Docker",
    "React", "Node.js", "AWS", "Linux", "HTML/CSS",
  ];

  const INTERESTS_LIST = [
    "Artificial Intelligence", "Backend Development", "Cloud & DevOps",
    "Cybersecurity", "Product Design", "Data Analytics",
    "Frontend Development", "Mobile Development", "Open Source",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <div
        className="absolute -top-20 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.1), transparent 70%)" }}
      />
      <div className="w-full max-w-2xl relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm mb-6 cursor-pointer"
          style={{ color: "var(--text-dim)" }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* Welcome message with student's name */}
        {student?.name && step === 0 && (
          <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <p className="text-xs text-cyan-300">
              👋 Hi <strong>{student.name.split(" ")[0]}</strong>! Let's build your personalized learning roadmap. This takes about 2 minutes.
            </p>
          </div>
        )}

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {ONBOARD_STEPS.map((s, i) => (
            <div
              key={s}
              className="flex-1 h-1.5 rounded-full"
              style={{
                background: i <= step
                  ? "linear-gradient(90deg,#22d3ee,#8b5cf6)"
                  : "rgba(255,255,255,0.08)",
                transition: "background .4s",
              }}
            />
          ))}
        </div>

        <p className="text-xs mb-1" style={{ color: "#67e8f9" }}>
          Step {step + 1} of {ONBOARD_STEPS.length}
        </p>
        <h2 className="lp-display text-2xl font-semibold mb-6">{ONBOARD_STEPS[step]}</h2>

        <GlassCard strong className="p-7 lp-fade-up" key={step}>

          {/* Step 0: Academic Background */}
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Degree program">
                <select
                  className="lp-input"
                  value={data.degree}
                  onChange={e => setData({ ...data, degree: e.target.value })}
                >
                  {["B.Tech Computer Science", "B.Tech IT", "B.Sc Data Science", "BCA", "MCA", "M.Tech", "B.Sc CS", "Other"].map(o => (
                    <option key={o} className="bg-[#0a0f1c]">{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Current year">
                <select
                  className="lp-input"
                  value={data.year}
                  onChange={e => setData({ ...data, year: e.target.value })}
                >
                  {["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"].map(o => (
                    <option key={o} className="bg-[#0a0f1c]">{o}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {/* Step 1: Current Skills */}
          {step === 1 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-dim)" }}>
                Select the skills you already have some experience with.
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS_LIST.map(s => (
                  <button
                    key={s}
                    onClick={() => toggle("skills", s)}
                    className="px-3.5 py-1.5 rounded-full text-sm transition-all cursor-pointer flex items-center gap-1.5"
                    style={
                      data.skills.includes(s)
                        ? { background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7cede" }
                    }
                  >
                    {data.skills.includes(s) && <Check size={12} />}
                    {s}
                  </button>
                ))}
              </div>
              {data.skills.length > 0 && (
                <p className="text-xs mt-3 text-cyan-400">
                  {data.skills.length} skill{data.skills.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          )}

          {/* Step 2: Projects & Certifications */}
          {step === 2 && (
            <div className="space-y-4">
              <Field label="Describe your past projects (one per line or comma-separated)">
                <textarea
                  className="lp-input"
                  rows={4}
                  value={data.projects}
                  onChange={e => setData({ ...data, projects: e.target.value })}
                  placeholder="e.g. AI Chatbot, Face Recognition Attendance System, Movie Recommendation Engine"
                />
              </Field>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                This helps us understand your practical experience. You can also mention certifications here.
              </p>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-dim)" }}>
                What areas are you most curious about or passionate about?
              </p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_LIST.map(s => (
                  <button
                    key={s}
                    onClick={() => toggle("interests", s)}
                    className="px-3.5 py-1.5 rounded-full text-sm transition-all cursor-pointer flex items-center gap-1.5"
                    style={
                      data.interests.includes(s)
                        ? { background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "#c4b5fd" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7cede" }
                    }
                  >
                    {data.interests.includes(s) && <Check size={12} />}
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Target Career */}
          {step === 4 && (
            <div>
              <p className="text-sm mb-4" style={{ color: "var(--text-dim)" }}>
                Choose the career path you want to pursue. Your entire roadmap will be tailored to this goal.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {ONBOARD_CAREERS.map(c => (
                  <button
                    key={c}
                    onClick={() => setData({ ...data, career: c })}
                    className="text-left px-4 py-3.5 rounded-xl text-sm flex items-center justify-between transition-all cursor-pointer"
                    style={
                      data.career === c
                        ? { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)" }
                        : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }
                    }
                  >
                    <span>{c}</span>
                    {data.career === c && <Check size={16} color="#67e8f9" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Learning Preferences */}
          {step === 5 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-dim)" }}>
                How much time can you dedicate to learning each week?
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Relaxed", sub: "~3 hrs/week", value: "Relaxed" },
                  { label: "Balanced", sub: "~6 hrs/week", value: "Balanced" },
                  { label: "Intensive", sub: "~10+ hrs/week", value: "Intensive" },
                ].map(p => (
                  <button
                    key={p.value}
                    onClick={() => setData({ ...data, pace: p.value })}
                    className="py-4 px-3 rounded-xl text-sm transition-all cursor-pointer text-center"
                    style={
                      data.pace === p.value
                        ? { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" }
                        : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }
                    }
                  >
                    <p className="font-medium">{p.label}</p>
                    <p className="text-xs mt-1 opacity-70">{p.sub}</p>
                  </button>
                ))}
              </div>

              {/* Summary before submitting */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <p className="text-xs font-semibold text-slate-300 mb-3">Your profile summary</p>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-slate-400">Degree</span>
                  <span className="text-white truncate">{data.degree}</span>
                  <span className="text-slate-400">Year</span>
                  <span className="text-white">{data.year}</span>
                  <span className="text-slate-400">Target Career</span>
                  <span className="text-cyan-300 font-medium">{data.career}</span>
                  <span className="text-slate-400">Skills</span>
                  <span className="text-white">{data.skills.length} selected</span>
                  <span className="text-slate-400">Pace</span>
                  <span className="text-white">{data.pace}</span>
                </div>
              </div>
            </div>
          )}
        </GlassCard>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            className={`lp-btn-ghost px-5 py-2.5 rounded-lg text-sm cursor-pointer ${step === 0 ? "opacity-30 pointer-events-none" : ""}`}
          >
            Previous
          </button>
          <button
            id={`btn-onboard-step-${step}`}
            onClick={next}
            className="lp-btn-primary px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer"
          >
            {step === ONBOARD_STEPS.length - 1 ? "Analyze my profile" : "Continue"} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingFlow;
