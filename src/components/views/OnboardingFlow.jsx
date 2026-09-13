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

export function OnboardingFlow({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    degree: "B.Tech Computer Science", year: "3rd Year",
    skills: ["Python", "Java", "SQL"],
    projects: "AI Chatbot, Smart Attendance System",
    interests: ["Artificial Intelligence", "Backend Development"],
    career: "AI/ML Engineer",
    pace: "Balanced",
  });

  const toggle = (key, val) => {
    setData(d => ({ ...d, [key]: d[key].includes(val) ? d[key].filter(x => x !== val) : [...d[key], val] }));
  };

  const next = () => step < ONBOARD_STEPS.length - 1 ? setStep(step + 1) : onComplete(data);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <div className="absolute -top-20 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.1), transparent 70%)" }} />
      <div className="w-full max-w-2xl relative z-10">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-6 cursor-pointer" style={{ color: "var(--text-dim)" }}>
          <ArrowLeft size={15} /> Back
        </button>

        <div className="flex items-center gap-2 mb-8">
          {ONBOARD_STEPS.map((s, i) => (
            <div key={s} className="flex-1 h-1.5 rounded-full" style={{
              background: i <= step ? "linear-gradient(90deg,#22d3ee,#8b5cf6)" : "rgba(255,255,255,0.08)",
              transition: "background .4s",
            }} />
          ))}
        </div>
        <p className="text-xs mb-1" style={{ color: "#67e8f9" }}>Step {step + 1} of {ONBOARD_STEPS.length}</p>
        <h2 className="lp-display text-2xl font-semibold mb-6">{ONBOARD_STEPS[step]}</h2>

        <GlassCard strong className="p-7 lp-fade-up" key={step}>
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Degree program">
                <select className="lp-input" value={data.degree} onChange={e => setData({ ...data, degree: e.target.value })}>
                  {["B.Tech Computer Science", "B.Tech IT", "B.Sc Data Science", "BCA"].map(o => <option key={o} className="bg-[#0a0f1c]">{o}</option>)}
                </select>
              </Field>
              <Field label="Current year">
                <select className="lp-input" value={data.year} onChange={e => setData({ ...data, year: e.target.value })}>
                  {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(o => <option key={o} className="bg-[#0a0f1c]">{o}</option>)}
                </select>
              </Field>
            </div>
          )}
          {step === 1 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-dim)" }}>Select skills you already have some experience with.</p>
              <div className="flex flex-wrap gap-2">
                {["Python", "Java", "C++", "SQL", "JavaScript", "Machine Learning", "Statistics", "Git"].map(s => (
                  <button key={s} onClick={() => toggle("skills", s)}
                    className="px-3.5 py-1.5 rounded-full text-sm transition-all cursor-pointer"
                    style={data.skills.includes(s)
                      ? { background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7cede" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <Field label="List your past projects or certifications">
              <textarea className="lp-input" rows={4} value={data.projects} onChange={e => setData({ ...data, projects: e.target.value })} />
            </Field>
          )}
          {step === 3 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-dim)" }}>What are you most curious about?</p>
              <div className="flex flex-wrap gap-2">
                {["Artificial Intelligence", "Backend Development", "Cloud & DevOps", "Cybersecurity", "Product Design", "Data Analytics"].map(s => (
                  <button key={s} onClick={() => toggle("interests", s)}
                    className="px-3.5 py-1.5 rounded-full text-sm transition-all cursor-pointer"
                    style={data.interests.includes(s)
                      ? { background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "#c4b5fd" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7cede" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {ONBOARD_CAREERS.map(c => (
                <button key={c} onClick={() => setData({ ...data, career: c })}
                  className="text-left px-4 py-3.5 rounded-xl text-sm flex items-center justify-between transition-all cursor-pointer"
                  style={data.career === c
                    ? { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)" }
                    : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}>
                  {c}
                  {data.career === c && <Check size={16} color="#67e8f9" />}
                </button>
              ))}
            </div>
          )}
          {step === 5 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-dim)" }}>Pick your preferred learning pace.</p>
              <div className="grid grid-cols-3 gap-3">
                {["Relaxed", "Balanced", "Intensive"].map(p => (
                  <button key={p} onClick={() => setData({ ...data, pace: p })}
                    className="py-3.5 rounded-xl text-sm transition-all cursor-pointer"
                    style={data.pace === p
                      ? { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" }
                      : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        <div className="flex justify-between mt-6">
          <button onClick={() => step > 0 && setStep(step - 1)} className={`lp-btn-ghost px-5 py-2.5 rounded-lg text-sm cursor-pointer ${step === 0 ? "opacity-30 pointer-events-none" : ""}`}>
            Previous
          </button>
          <button onClick={next} className="lp-btn-primary px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer">
            {step === ONBOARD_STEPS.length - 1 ? "Analyze my profile" : "Continue"} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingFlow;
