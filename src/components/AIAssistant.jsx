import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { getCurrentUser, updateCurrentUser } from "../data/supabaseAuth";
import { buildUserContext, callAIProvider, generateAdaptiveQuiz } from "../lib/aiMentorService";

/**
 * Render Markdown-like text with clickable links
 */
function FormattedMessageText({ text }) {
  if (!text) return null;

  // Split by markdown link pattern [label](url)
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

  return (
    <span>
      {parts.map((part, i) => {
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-cyan-300 hover:text-cyan-200 underline my-1 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30"
            >
              {label} <ExternalLink size={11} />
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export function AIAssistant({ open, setOpen, student: studentProp }) {
  const [studentContext, setStudentContext] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);

  // Fetch initial user context & greeting on open
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      const ctx = await buildUserContext(studentProp);
      if (mounted) {
        setStudentContext(ctx);
        const userName = ctx?.profile?.name?.split(" ")[0] || "there";
        const career = ctx?.profile?.targetCareer || "Software Engineer";
        const topGap = ctx?.skillGaps?.[0];

        if (messages.length === 0) {
          setMessages([
            {
              from: "ai",
              text: `Hi ${userName} 👋\n\nI'm your PathForge AI Mentor. I have loaded your profile for **${career}**.\n\n${
                topGap
                  ? `Your top identified skill gap is **${topGap}**.`
                  : "You're currently on track with your core skills!"
              }\n\nWhat would you like to work on today?`,
            },
          ]);
        }
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [open, studentProp]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, activeQuiz, quizIndex]);

  // Send message or trigger quick action
  const send = async (rawText) => {
    const text = rawText?.trim();
    if (!text || typing) return;

    // Reset input
    setInput("");

    // Append user message
    const updatedMessages = [...messages, { from: "user", text }];
    setMessages(updatedMessages);
    setTyping(true);

    // Re-build fresh user context
    const freshCtx = await buildUserContext(studentProp);
    setStudentContext(freshCtx);

    // Special handler: "Test my knowledge"
    if (text.toLowerCase().includes("test my knowledge")) {
      const quiz = generateAdaptiveQuiz(
        freshCtx?.profile?.targetCareer || "Software Engineer",
        freshCtx?.skillGaps?.[0] || "Core Skills"
      );
      setActiveQuiz(quiz);
      setQuizIndex(0);
      setQuizScore(0);
      setQuizAnswers([]);
      setTyping(false);
      setMessages(prev => [
        ...prev,
        {
          from: "ai",
          text: `Starting an adaptive 5-question technical check on **${quiz[0].topic}**! Select your answers below:`,
        },
      ]);
      return;
    }

    // Call AI provider with message history & context
    try {
      const aiReply = await callAIProvider(updatedMessages, freshCtx);
      setMessages(prev => [...prev, { from: "ai", text: aiReply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { from: "ai", text: "AI Mentor is temporarily unavailable. Please try again." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  // Handle quiz option selection
  const handleQuizSelect = async (optionIdx) => {
    if (!activeQuiz) return;
    const currentQ = activeQuiz[quizIndex];
    const isCorrect = optionIdx === currentQ.answer;

    const nextScore = isCorrect ? quizScore + 1 : quizScore;
    const nextAnswers = [...quizAnswers, { question: currentQ.question, selected: optionIdx, isCorrect }];

    setQuizScore(nextScore);
    setQuizAnswers(nextAnswers);

    if (quizIndex < activeQuiz.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      // Quiz finished
      const finalScorePct = Math.round((nextScore / activeQuiz.length) * 100);
      const topic = currentQ.topic;

      // Save assessment result to Supabase
      const newAssessment = {
        name: `${topic} Skill Check`,
        score: finalScorePct,
        date: new Date().toLocaleDateString(),
        topic,
      };

      const existingAssessments = studentContext?.assessments || [];
      await updateCurrentUser({
        assessments: [newAssessment, ...existingAssessments],
        assessmentScore: finalScorePct,
      });

      const summaryText =
        `### Quiz Complete! 🎉\n\n` +
        `**Score:** ${nextScore}/${activeQuiz.length} (${finalScorePct}%)\n` +
        `**Topic:** ${topic}\n\n` +
        `**Assessment Summary:**\n` +
        `${finalScorePct >= 80 ? "✓ Strong technical mastery!" : "⚠️ Needs further practice."}\n\n` +
        `Your score of **${finalScorePct}%** has been saved to your PathForge assessments.`;

      setMessages(prev => [...prev, { from: "ai", text: summaryText }]);
      setActiveQuiz(null);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="lp-btn-primary fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 transition-transform"
        aria-label="Open AI Mentor"
      >
        <Bot size={22} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[92vw] max-w-sm h-[70vh] max-h-[560px] lp-glass-strong rounded-2xl flex flex-col overflow-hidden lp-fade-up shadow-2xl border border-white/10">
      
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5 bg-slate-900/80"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
            style={{ background: "linear-gradient(135deg,#22d3ee,#8b5cf6)" }}
          >
            <Bot size={16} color="#04121a" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-white">AI Mentor</p>
            <p className="text-xs leading-tight font-medium" style={{ color: "#6ee7b7" }}>
              Online · {studentContext?.profile?.targetCareer || "Ready"}
            </p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="cursor-pointer text-slate-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto lp-scrollbar px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[88%] px-3.5 py-2.5 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-line shadow-sm"
              style={
                m.from === "user"
                  ? { background: "linear-gradient(100deg,#22d3ee,#3b82f6)", color: "#04121a", fontWeight: 600 }
                  : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#eef1f7" }
              }
            >
              <FormattedMessageText text={m.text} />
            </div>
          </div>
        ))}

        {/* Active Quiz Card inside chat */}
        {activeQuiz && activeQuiz[quizIndex] && (
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-3 my-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              <span>Question {quizIndex + 1} of {activeQuiz.length}</span>
              <span>{activeQuiz[quizIndex].topic}</span>
            </div>

            <p className="text-xs font-semibold text-white leading-snug">
              {activeQuiz[quizIndex].question}
            </p>

            <div className="space-y-1.5 pt-1">
              {activeQuiz[quizIndex].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleQuizSelect(oIdx)}
                  className="w-full text-left p-2.5 rounded-xl text-xs bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-white transition-all cursor-pointer font-medium"
                >
                  <span className="font-bold text-cyan-300 mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 bg-white/5 border border-white/10 text-cyan-300">
              <span className="animate-pulse font-medium">AI Mentor is thinking</span>
              <span className="lp-float-3" style={{ animationDuration: ".9s" }}>●</span>
              <span className="lp-float-3" style={{ animationDuration: ".9s", animationDelay: ".15s" }}>●</span>
              <span className="lp-float-3" style={{ animationDuration: ".9s", animationDelay: ".3s" }}>●</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Actions Pills */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {["Explain this", "Create study plan", "Test my knowledge", "Recommend resources", "Analyze my progress"].map(q => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={typing}
            className="text-[11px] px-2.5 py-1 rounded-full cursor-pointer transition-all border disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#c7cede" }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="p-3 flex items-center gap-2 bg-slate-900/90" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !typing && send(input)}
          placeholder="Ask your AI mentor..."
          disabled={typing}
          className="flex-1 bg-transparent text-xs text-white outline-none px-2 placeholder-slate-500"
        />
        <button
          onClick={() => send(input)}
          disabled={typing || !input.trim()}
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 transition-all"
          style={{ background: "linear-gradient(135deg,#22d3ee,#8b5cf6)" }}
        >
          <Send size={13} color="#04121a" />
        </button>
      </div>

    </div>
  );
}

export default AIAssistant;
