import React, { useState, useEffect } from "react";
import { Sparkles, Clock, CheckCircle2, AlertTriangle, Check, XCircle, RefreshCw, ArrowRight, Bot, Compass } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import ProgressRing from "../ui/ProgressRing";
import { QUIZ } from "../../data/mockData";
import { recordStyleInteraction } from "../../services/learningStyleService";
import { updateCurrentUser } from "../../data/supabaseAuth";

export function AssessmentView({ student, onUpdateStudent, go }) {
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

  const start = () => { 
    setPhase("quiz"); 
    setQi(0); 
    setAnswers([]); 
    setSeconds(30); 
  };

  const handleNext = (choice) => {
    const updated = [...answers, choice];
    setAnswers(updated);
    if (qi + 1 < QUIZ.length) { 
      setQi(qi + 1); 
      setSeconds(30); 
    } else {
      finishAssessment(updated);
    }
  };

  const finishAssessment = async (finalAnswers) => {
    setPhase("results");
    const score = finalAnswers.filter((a, i) => a === QUIZ[i]?.answer).length;
    const pct = Math.round((score / QUIZ.length) * 100);

    const topicResults = {};
    const strengths = [];
    const weakTopics = [];

    QUIZ.forEach((q, i) => {
      topicResults[q.topic] = topicResults[q.topic] || { correct: 0, total: 0 };
      topicResults[q.topic].total++;
      if (finalAnswers[i] === q.answer) topicResults[q.topic].correct++;
    });

    Object.entries(topicResults).forEach(([topic, res]) => {
      if (res.correct === res.total) strengths.push(topic);
      else weakTopics.push(topic);
    });

    const newAssessment = {
      id: `ass_${Date.now()}`,
      title: "Core Skill Knowledge Validation",
      score: pct,
      correctCount: score,
      totalQuestions: QUIZ.length,
      topic: "Core Skills",
      timestamp: new Date().toISOString(),
      strengths,
      weakTopics
    };

    const existingAssessments = Array.isArray(student?.assessments) ? student.assessments : [];
    const updatedAssessments = [newAssessment, ...existingAssessments];

    const existingActivity = Array.isArray(student?.learningActivity) ? student.learningActivity : [];
    const updatedActivity = [
      {
        id: `act_${Date.now()}`,
        activity_type: "quiz",
        duration_seconds: (QUIZ.length - qi) * 20 + 60,
        started_at: new Date().toISOString()
      },
      ...existingActivity
    ];

    // Record style interaction for practice/quiz
    recordStyleInteraction("quiz", student, onUpdateStudent);

    // Update student state locally & in Supabase
    if (onUpdateStudent) {
      onUpdateStudent({
        assessments: updatedAssessments,
        learningActivity: updatedActivity
      }, "Assessment results saved & skill gaps updated!");
    }

    await updateCurrentUser({
      assessments: updatedAssessments
    });
  };

  const score = answers.filter((a, i) => a === QUIZ[i]?.answer).length;
  const pct = Math.round((score / QUIZ.length) * 100);

  const topicResults = {};
  QUIZ.forEach((q, i) => {
    topicResults[q.topic] = topicResults[q.topic] || { correct: 0, total: 0 };
    topicResults[q.topic].total++;
    if (answers[i] === q.answer) topicResults[q.topic].correct++;
  });

  const weakTopics = Object.entries(topicResults).filter(([, v]) => v.correct < v.total).map(([t]) => t);
  const strengths = Object.entries(topicResults).filter(([, v]) => v.correct === v.total).map(([t]) => t);

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <SectionHeader 
          eyebrow="Adaptive Knowledge Assessment" 
          title="Skill & Knowledge Assessment" 
          subtitle="6 questions · MCQ & Conceptual · Analyzes skill gaps for your target career" 
        />
        <GlassCard strong className="p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Sparkles size={28} />
          </div>
          <h3 className="text-xl font-bold text-white">Target Career Validation Quiz</h3>
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-dim)" }}>
            This quiz covers Python, Object-Oriented Programming (OOP), SQL, Probability, and Machine Learning — testing the key skills required for <strong>{student?.targetCareer || "Software Engineer"}</strong>.
          </p>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-left max-w-md mx-auto space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Clock size={14} /> 30 Seconds Per Question
            </div>
            <p>• Immediate feedback & topic breakdown upon completion</p>
            <p>• Automatically updates your skill gaps, analytics dashboard & AI mentor context</p>
          </div>
          <button 
            onClick={start} 
            className="lp-btn-primary px-8 py-3.5 rounded-xl text-sm font-bold cursor-pointer inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            Start Assessment Now <ArrowRight size={16} />
          </button>
        </GlassCard>
      </div>
    );
  }

  if (phase === "quiz") {
    const q = QUIZ[qi];
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400">Question {qi + 1} of {QUIZ.length}</span>
          <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: seconds <= 10 ? "#f87171" : "#67e8f9" }}>
            <Clock size={13} /> {seconds}s remaining
          </div>
        </div>
        <div className="h-2 rounded-full mb-6 bg-white/10 overflow-hidden">
          <div 
            style={{ 
              width: `${((qi + 1) / QUIZ.length) * 100}%`, 
              height: "100%", 
              borderRadius: 999, 
              background: "linear-gradient(90deg, #22d3ee, #8b5cf6)", 
              transition: "width .4s ease" 
            }} 
          />
        </div>
        <GlassCard strong className="p-7 lp-fade-up space-y-5" key={qi}>
          <div className="flex items-center gap-2">
            <Pill tone="violet">{q.topic}</Pill>
            <Pill tone={q.difficulty === "Hard" ? "red" : q.difficulty === "Medium" ? "amber" : "green"}>{q.difficulty}</Pill>
          </div>
          <p className="text-lg font-bold text-white leading-relaxed">{q.q}</p>
          <div className="space-y-3 pt-2">
            {q.options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleNext(i)}
                className="w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all bg-white/[0.03] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-white cursor-pointer flex items-center justify-between group"
              >
                <span>{opt}</span>
                <span className="w-6 h-6 rounded-full border border-white/20 group-hover:border-cyan-400 text-[11px] flex items-center justify-center font-bold text-slate-400 group-hover:text-cyan-300">
                  {String.fromCharCode(65 + i)}
                </span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader eyebrow="Results & Skill Gap Analysis" title="Assessment Complete!" />

      {/* Score Overview */}
      <GlassCard strong className="p-8 flex flex-col items-center text-center space-y-4">
        <ProgressRing value={pct} size={140} stroke={11} label={`${pct}%`} sublabel="knowledge score" tone={pct >= 70 ? "#34d399" : pct >= 40 ? "#fbbf24" : "#f87171"} />
        <div>
          <h3 className="text-xl font-bold text-white">{score} of {QUIZ.length} Correct</h3>
          <p className="text-xs text-slate-400 mt-1">
            {pct >= 70 ? "Excellent work! Your core foundations are solid." : "Good effort! Let's close your remaining skill gaps."}
          </p>
        </div>
      </GlassCard>

      {/* Strengths & Weak Topics */}
      <div className="grid sm:grid-cols-2 gap-4">
        <GlassCard className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 size={15} /> Verified Strengths ({strengths.length})
          </p>
          {strengths.length > 0 ? (
            <div className="space-y-2">
              {strengths.map((topic) => (
                <div key={topic} className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <Check size={14} className="text-emerald-400 shrink-0" /> {topic}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No 100% mastered topics in this attempt.</p>
          )}
        </GlassCard>

        <GlassCard className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-300">
            <AlertTriangle size={15} /> Skill Gaps Detected ({weakTopics.length})
          </p>
          {weakTopics.length > 0 ? (
            <div className="space-y-2">
              {weakTopics.map((topic) => (
                <div key={topic} className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <XCircle size={14} className="text-amber-400 shrink-0" /> {topic} ({topicResults[topic]?.correct}/{topicResults[topic]?.total})
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-300 font-semibold">🎉 All tested topics answered perfectly!</p>
          )}
        </GlassCard>
      </div>

      {/* Explainable Recommendation */}
      <GlassCard strong className="p-5 flex items-start gap-3 bg-cyan-500/[0.04] border-cyan-500/20">
        <Bot size={20} className="text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">AI Mentor Recommendation</p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {weakTopics.length > 0 
              ? `Based on your score of ${pct}%, your primary skill gaps are in ${weakTopics.join(", ")}. We have adjusted your learning roadmap to prioritize these topics.`
              : `Great performance! With a score of ${pct}%, you are ready to advance to more complex project implementations.`}
          </p>
        </div>
      </GlassCard>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button 
          onClick={start} 
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw size={14} /> Retake Assessment
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => go?.("career")} 
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Compass size={14} /> View Career Match
          </button>
          <button 
            onClick={() => go?.("roadmap")} 
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            Go to Roadmap <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssessmentView;
