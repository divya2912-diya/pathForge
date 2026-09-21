import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send } from "lucide-react";
import { getCurrentUser } from "../data/authStore";

export function AIAssistant({ open, setOpen }) {
  const user = getCurrentUser();
  const userName = user?.name?.split(" ")[0] || "there";
  const [messages, setMessages] = useState([
    { from: "ai", text: `Hi ${userName} 👋\n\nI'm your AI Mentor. I can help you understand concepts, build study plans, and guide your learning journey.\n\nWhat would you like to work on today?` },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const reply = (text) => {
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { from: "ai", text }]);
      setTyping(false);
    }, 900);
  };

  const send = (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { from: "user", text }]);
    setInput("");
    const canned = {
      "Explain this": "Probability measures how likely an event is, from 0 (impossible) to 1 (certain). For independent events A and B, P(A ∩ B) = P(A) × P(B) — this shows up constantly in ML for Bayesian models and Naive Bayes classifiers.",
      "Create study plan": "Here's a 3-day plan:\nDay 1 — Core probability rules & Bayes' theorem (2h)\nDay 2 — Distributions: binomial, normal, Poisson (2h)\nDay 3 — Practice problems + a short quiz to confirm mastery (1.5h)",
      "Test my knowledge": "Sure — I've queued a short 4-question probability check into your Assessment tab. Head there whenever you're ready.",
      "Recommend resources": "Try 'Probability & Statistics for ML' (93% match, 8h) — it's already in your Resources tab and maps directly to this gap.",
      "Analyze my progress": "You're at 64% overall learning progress, 12-day streak. Statistics is 45% complete — finishing it unlocks Machine Learning Foundations.",
    };
    reply(canned[text] || "Good question — based on your profile, I'd suggest starting with your current roadmap milestone: Statistics & Probability. Want a study plan for it?");
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="lp-btn-primary fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer">
        <Bot size={22} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[92vw] max-w-sm h-[70vh] max-h-[560px] lp-glass-strong rounded-2xl flex flex-col overflow-hidden lp-fade-up shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#22d3ee,#8b5cf6)" }}><Bot size={15} color="#04121a" /></div>
          <div>
            <p className="text-sm font-semibold leading-tight">AI Mentor</p>
            <p className="text-xs leading-tight" style={{ color: "#6ee7b7" }}>Online</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="cursor-pointer"><X size={18} style={{ color: "var(--text-dim)" }} /></button>
      </div>

      <div className="flex-1 overflow-y-auto lp-scrollbar px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line"
              style={m.from === "user"
                ? { background: "linear-gradient(100deg,#22d3ee,#3b82f6)", color: "#04121a" }
                : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#eef1f7" }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl text-sm flex items-center gap-1" style={{ background: "rgba(255,255,255,0.06)" }}>
              <span className="lp-float-3" style={{ animationDuration: ".9s" }}>●</span>
              <span className="lp-float-3" style={{ animationDuration: ".9s", animationDelay: ".15s" }}>●</span>
              <span className="lp-float-3" style={{ animationDuration: ".9s", animationDelay: ".3s" }}>●</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {["Explain this", "Create study plan", "Test my knowledge", "Recommend resources", "Analyze my progress"].map(q => (
          <button key={q} onClick={() => send(q)} className="text-xs px-2.5 py-1.5 rounded-full cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7cede" }}>{q}</button>
        ))}
      </div>
      <div className="p-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="Ask your AI mentor..." className="flex-1 bg-transparent text-sm outline-none px-2" style={{ color: "#eef1f7" }} />
        <button onClick={() => send(input)} className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 cursor-pointer" style={{ background: "linear-gradient(135deg,#22d3ee,#8b5cf6)" }}>
          <Send size={14} color="#04121a" />
        </button>
      </div>
    </div>
  );
}

export default AIAssistant;
