import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send, ExternalLink, Settings, Key, Check, AlertCircle, Sparkles } from "lucide-react";
import { getCurrentUser, updateCurrentUser } from "../data/supabaseAuth";
import {
  buildUserContext,
  callAIProvider,
  generateAdaptiveQuiz,
  AI_MODELS,
  getStoredApiKey,
  saveApiKey,
  getStoredModel,
  saveModel,
} from "../lib/aiMentorService";

/**
 * Render Markdown-like text with code blocks and clickable links
 */
function FormattedMessageText({ text }) {
  if (!text) return null;

  // Split code blocks first ```code```
  const blocks = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {blocks.map((block, bIdx) => {
        if (block.startsWith("```") && block.endsWith("```")) {
          const content = block.slice(3, -3).replace(/^[a-zA-Z0-9-]+\n/, "");
          return (
            <pre
              key={bIdx}
              className="p-3 my-2 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-cyan-300 font-mono text-[11px] overflow-x-auto lp-scrollbar"
            >
              <code>{content.trim()}</code>
            </pre>
          );
        }

        const lines = block.split("\n");
        return (
          <div key={bIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              let trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-1" />;

              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={lIdx} className="font-bold text-cyan-300 text-xs md:text-sm pt-1 pb-0.5">
                    {trimmed.replace(/^### /, "")}
                  </h4>
                );
              }

              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={lIdx} className="font-bold text-cyan-200 text-sm pt-1.5 pb-0.5">
                    {trimmed.replace(/^## /, "")}
                  </h3>
                );
              }

              if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                const bulletText = trimmed.replace(/^[\u2022\-\*]\s*/, "");
                return (
                  <div key={lIdx} className="flex items-start gap-1.5 pl-1 my-0.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span><InlineText text={bulletText} /></span>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="my-0.5">
                  <InlineText text={line} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function InlineText({ text }) {
  if (!text) return null;
  const linkParts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

  return (
    <span>
      {linkParts.map((part, i) => {
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-cyan-300 hover:text-cyan-200 underline my-0.5 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30 text-[11px]"
            >
              {label} <ExternalLink size={10} />
            </a>
          );
        }

        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={i}>
            {boldParts.map((bp, j) => {
              if (bp.startsWith("**") && bp.endsWith("**")) {
                return (
                  <strong key={j} className="font-bold text-cyan-200">
                    {bp.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={j}>{bp}</span>;
            })}
          </span>
        );
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

  // Settings & Gemini Model state
  const [selectedModel, setSelectedModel] = useState(getStoredModel());
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getStoredApiKey());
  const [keySavedToast, setKeySavedToast] = useState(false);

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);

  useEffect(() => {
    setApiKeyInput(getStoredApiKey());
  }, [open]);

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
          const hasKey = !!getStoredApiKey();
          setMessages([
            {
              from: "ai",
              text: `Hi ${userName} 👋\n\nI'm your **Gemini AI Agent**. I have analyzed your profile for **${career}**.\n\n${
                topGap
                  ? `Your top identified skill gap is **${topGap}**.`
                  : "You're currently on track with your core skills!"
              }\n\n${
                hasKey
                  ? "✓ Gemini AI API connection is active."
                  : "ℹ️ Add your Gemini API key in settings anytime for maximum AI agent power."
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

  const handleModelChange = (newModelId) => {
    setSelectedModel(newModelId);
    saveModel(newModelId);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    saveApiKey(apiKeyInput);
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 2500);
  };

  const send = async (rawText) => {
    const text = rawText?.trim();
    if (!text || typing) return;

    setInput("");
    setShowSettings(false);

    const updatedMessages = [...messages, { from: "user", text }];
    setMessages(updatedMessages);
    setTyping(true);

    const freshCtx = await buildUserContext(studentProp);
    setStudentContext(freshCtx);

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

    try {
      const aiReply = await callAIProvider(updatedMessages, freshCtx, selectedModel);
      setMessages(prev => [...prev, { from: "ai", text: aiReply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { from: "ai", text: "Gemini AI Agent is temporarily unavailable. Please try again." },
      ]);
    } finally {
      setTyping(false);
    }
  };

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
      const finalScorePct = Math.round((nextScore / activeQuiz.length) * 100);
      const topic = currentQ.topic;

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
        aria-label="Open Gemini AI Agent"
      >
        <Bot size={22} />
      </button>
    );
  }

  const activeApiKey = getStoredApiKey();

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[94vw] max-w-md h-[75vh] max-h-[620px] lp-glass-strong rounded-2xl flex flex-col overflow-hidden lp-fade-up shadow-2xl border border-cyan-500/20">
      
      {/* Header */}
      <div
        className="flex items-center justify-between px-3.5 py-3 bg-slate-950/90"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md relative shrink-0"
            style={{ background: "linear-gradient(135deg,#22d3ee,#8b5cf6)" }}
          >
            <Bot size={17} color="#04121a" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs md:text-sm font-bold text-white leading-tight">Gemini AI Agent</p>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-medium">● Online</span>
              <span>·</span>
              <span className="truncate max-w-[120px] text-slate-300">
                {studentContext?.profile?.targetCareer || "Ready"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              showSettings ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"
            }`}
            title="Gemini API Settings"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Model Bar */}
      <div className="px-3.5 py-1.5 bg-slate-900/90 border-b border-white/5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Sparkles size={12} className="text-cyan-400 shrink-0" />
          <span>Model:</span>
          <select
            value={selectedModel}
            onChange={(e) => handleModelChange(e.target.value)}
            className="bg-slate-950/80 text-cyan-300 text-[11px] py-0.5 px-2 rounded border border-white/10 outline-none cursor-pointer"
          >
            {AI_MODELS.map((m) => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowSettings(true)}
          className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
            activeApiKey
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-300 border-amber-500/30"
          }`}
        >
          <Key size={10} />
          {activeApiKey ? "Gemini Key Active" : "Add Key"}
        </button>
      </div>

      {/* Quick API Key Settings Drawer (Collapsible) */}
      {showSettings && (
        <div className="p-3.5 bg-slate-950/95 border-b border-cyan-500/20 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Key size={13} className="text-cyan-400" />
              Google Gemini API Key
            </p>
            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Paste your Google Gemini API Key below to power real-time AI responses.
          </p>
          <form onSubmit={handleSaveApiKey} className="space-y-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste Google Gemini API Key..."
              className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg py-1.5 px-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-mono"
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {activeApiKey ? "Key active" : "No key saved yet"}
              </span>
              <div className="flex gap-1.5">
                {activeApiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      saveApiKey("");
                      setApiKeyInput("");
                    }}
                    className="px-2 py-1 rounded text-[11px] bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30 cursor-pointer"
                  >
                    Clear Key
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1 rounded text-[11px] bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 cursor-pointer transition-colors"
                >
                  Save Key
                </button>
              </div>
            </div>
          </form>

          {keySavedToast && (
            <div className="p-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-1 font-medium">
              <Check size={12} /> Gemini API Key saved!
            </div>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto lp-scrollbar px-3.5 py-3.5 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[90%] px-3.5 py-2.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm"
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
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2.5 my-2">
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
                  className="w-full text-left p-2 rounded-xl text-xs bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-white transition-all cursor-pointer font-medium"
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
              <span className="animate-pulse font-medium">Gemini AI Agent is thinking ({selectedModel})</span>
              <span className="lp-float-3" style={{ animationDuration: ".9s" }}>●</span>
              <span className="lp-float-3" style={{ animationDuration: ".9s", animationDelay: ".15s" }}>●</span>
              <span className="lp-float-3" style={{ animationDuration: ".9s", animationDelay: ".3s" }}>●</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Actions Pills */}
      <div className="px-3 pb-2 flex flex-wrap gap-1.5">
        {[
          "Explain this",
          "Create study plan",
          "Test my knowledge",
          "Recommend resources",
          "Analyze progress",
          "Mock interview",
          "Suggest project idea",
        ].map(q => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={typing}
            className="text-[10px] px-2.5 py-1 rounded-full cursor-pointer transition-all border disabled:opacity-50 hover:border-cyan-400 hover:text-cyan-300"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#c7cede" }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="p-3 flex items-center gap-2 bg-slate-950/90" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !typing && send(input)}
          placeholder="Ask your Gemini AI agent..."
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
