import React, { useState, useEffect } from "react";
import { Sparkles, Clock, CheckCircle2, AlertTriangle, Check, XCircle, RefreshCw } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import ProgressRing from "../ui/ProgressRing";
import { QUIZ } from "../../data/mockData";

export function AssessmentView() {
  const [phase, setPhase] = useState("intro"); // intro | quiz | results
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (phase !== "quiz") return;
    if (seconds === 0) { handleNext(null); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, phase]);

  const start = () => { setPhase("quiz"); setQi(0); setAnswers([]); setSeconds(30); };

  const handleNext = (choice) => {
    const updated = [...answers, choice];
    setAnswers(updated);
    if (qi + 1 < QUIZ.length) { setQi(qi + 1); setSeconds(30); }
    else setPhase("results");
  };

  const score = answers.filter((a, i) => a === QUIZ[i]?.answer).length;
  const pct = Math.round((score / QUIZ.length) * 100);
  const topicResults = {};
  QUIZ.forEach((q, i) => {
    topicResults[q.topic] = topicResults[q.topic] || { correct: 0, total: 0 };
    topicResults[q.topic].total++;
    if (answers[i] === q.answer) topicResults[q.topic].correct++;
  });

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto">
        <SectionHeader eyebrow="Adaptive assessment" title="Knowledge validation check" subtitle="6 questions · MCQ & conceptual · difficulty adapts to your profile" />
        <GlassCard strong className="p-8 text-center">
          <Sparkles size={30} color="#67e8f9" className="mx-auto mb-4" />
          <p className="text-sm mb-6" style={{ color: "var(--text-dim)" }}>
            This assessment covers Python, OOP, SQL, Probability and Machine Learning — the topics most relevant to your current roadmap stage.
            You'll have 30 seconds per question.
          </p>
          <button onClick={start} className="lp-btn-primary px-7 py-3 rounded-xl text-sm cursor-pointer">Start assessment</button>
        </GlassCard>
      </div>
    );
  }

  if (phase === "quiz") {
    const q = QUIZ[qi];
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>Question {qi + 1} of {QUIZ.length}</span>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: seconds <= 10 ? "#f87171" : "#67e8f9" }}>
            <Clock size={13} /> {seconds}s
          </div>
        </div>
        <div className="h-1.5 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div style={{ width: `${((qi) / QUIZ.length) * 100}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#22d3ee,#8b5cf6)", transition: "width .4s" }} />
        </div>
        <GlassCard strong className="p-7 lp-fade-up" key={qi}>
          <div className="flex items-center gap-2 mb-4">
            <Pill tone="violet">{q.topic}</Pill>
            <Pill tone={q.difficulty === "Hard" ? "red" : q.difficulty === "Medium" ? "amber" : "green"}>{q.difficulty}</Pill>
          </div>
          <p className="text-base font-medium mb-6">{q.q}</p>
          <div className="space-y-2.5">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => handleNext(i)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all lp-btn-ghost cursor-pointer">
                {opt}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader eyebrow="Results" title="Assessment complete" />
      <GlassCard strong className="p-8 flex flex-col items-center text-center">
        <ProgressRing value={pct} size={140} stroke={11} label={`${pct}%`} sublabel="knowledge score" tone={pct >= 70 ? "#34d399" : pct >= 40 ? "#fbbf24" : "#f87171"} />
        <p className="text-sm mt-4" style={{ color: "var(--text-dim)" }}>{score} of {QUIZ.length} answered correctly</p>
      </GlassCard>
      <div className="grid sm:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}><CheckCircle2 size={14} /> Strong areas</p>
          <div className="space-y-2">
            {Object.entries(topicResults).filter(([, v]) => v.correct === v.total).map(([topic]) => (
              <div key={topic} className="flex items-center gap-2 text-sm"><Check size={14} color="#34d399" /> {topic}</div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "#fbbf24" }}><AlertTriangle size={14} /> Needs improvement</p>
          <div className="space-y-2">
            {Object.entries(topicResults).filter(([, v]) => v.correct < v.total).map(([topic, v]) => (
              <div key={topic} className="flex items-center gap-2 text-sm"><XCircle size={14} color="#fbbf24" /> {topic} ({v.correct}/{v.total})</div>
            ))}
          </div>
        </GlassCard>
      </div>
      <GlassCard className="p-5 flex items-center gap-3">
        <RefreshCw size={16} color="#67e8f9" className="shrink-0" />
        <p className="text-sm" style={{ color: "#c7cede" }}>Your learning path has been updated — Probability now appears earlier in your roadmap.</p>
      </GlassCard>
      <button onClick={() => setPhase("intro")} className="lp-btn-ghost px-5 py-2.5 rounded-lg text-sm cursor-pointer">Retake assessment</button>
    </div>
  );
}

export default AssessmentView;
