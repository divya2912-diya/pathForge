import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bot, X, Send, User, Copy, Check, StopCircle, ExternalLink } from "lucide-react";
import { sendMessage } from "../lib/chatService";

// ─── Markdown Renderer ────────────────────────────────────────────────────────

function InlineText({ text }) {
  if (!text) return null;

  // Links [label](url)
  const linkParts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <span>
      {linkParts.map((part, i) => {
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          return (
            <a key={i} href={url} target="_blank" rel="noreferrer" className="cw-link">
              {label} <ExternalLink size={11} className="inline mb-0.5" />
            </a>
          );
        }
        // Bold **text**
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={i}>
            {boldParts.map((bp, j) => {
              if (bp.startsWith("**") && bp.endsWith("**"))
                return <strong key={j} className="font-semibold text-white">{bp.slice(2, -2)}</strong>;
              // Inline code `code`
              const codeParts = bp.split(/(`[^`]+`)/g);
              return (
                <span key={j}>
                  {codeParts.map((cp, k) => {
                    if (cp.startsWith("`") && cp.endsWith("`"))
                      return <code key={k} className="cw-inline-code">{cp.slice(1, -1)}</code>;
                    return <span key={k}>{cp}</span>;
                  })}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

function FormattedMessage({ text }) {
  if (!text) return null;

  const blocks = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="cw-msg-body">
      {blocks.map((block, bIdx) => {
        // Code block
        if (block.startsWith("```") && block.endsWith("```")) {
          const inner = block.slice(3, -3);
          const langMatch = inner.match(/^([a-zA-Z0-9-]+)\n/);
          const lang = langMatch ? langMatch[1] : "";
          const code = inner.replace(/^[a-zA-Z0-9-]+\n/, "").trim();
          return (
            <div key={bIdx} className="cw-code-block">
              {lang && <div className="cw-code-lang">{lang}</div>}
              <pre><code>{code}</code></pre>
            </div>
          );
        }

        return (
          <div key={bIdx}>
            {block.split("\n").map((line, lIdx) => {
              const t = line.trim();
              if (!t) return <div key={lIdx} className="cw-gap" />;

              if (t.startsWith("### "))
                return <p key={lIdx} className="cw-h3"><InlineText text={t.slice(4)} /></p>;
              if (t.startsWith("## "))
                return <p key={lIdx} className="cw-h2"><InlineText text={t.slice(3)} /></p>;
              if (t.startsWith("# "))
                return <p key={lIdx} className="cw-h1"><InlineText text={t.slice(2)} /></p>;

              if (/^\d+\.\s/.test(t)) {
                const num = t.match(/^(\d+)/)[1];
                const content = t.replace(/^\d+\.\s/, "");
                return (
                  <div key={lIdx} className="cw-numbered">
                    <span className="cw-num">{num}</span>
                    <span><InlineText text={content} /></span>
                  </div>
                );
              }

              if (/^[•\-\*]\s/.test(t)) {
                const content = t.replace(/^[•\-\*]\s*/, "");
                return (
                  <div key={lIdx} className="cw-bullet">
                    <span className="cw-dot" />
                    <span><InlineText text={content} /></span>
                  </div>
                );
              }

              return <p key={lIdx} className="cw-para"><InlineText text={line} /></p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── Typing Dots ─────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="cw-typing">
      <span /><span /><span />
    </div>
  );
}

// ─── Single Message Bubble ────────────────────────────────────────────────────

function Bubble({ msg }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.from === "user";

  const copy = () => {
    navigator.clipboard?.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`cw-row ${isUser ? "cw-row--user" : "cw-row--ai"}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="cw-av cw-av--ai"><Bot size={14} /></div>
      )}

      <div className={`cw-bwrap ${isUser ? "cw-bwrap--user" : ""}`}>
        {/* Time label for AI */}
        {!isUser && (
          <div className="cw-meta">
            <span className="cw-meta-name">PathForge AI</span>
            <span className="cw-meta-time">{msg.time}</span>
          </div>
        )}

        {/* Bubble */}
        <div className={`cw-bubble ${isUser ? "cw-bubble--user" : "cw-bubble--ai"}`}>
          <FormattedMessage text={msg.text} />
        </div>

        {/* Copy button (AI only, hover) */}
        {!isUser && (
          <button onClick={copy} className="cw-copy-btn">
            {copied
              ? <><Check size={11} /> Copied</>
              : <><Copy size={11} /> Copy</>}
          </button>
        )}

        {/* Time for user */}
        {isUser && <div className="cw-user-time">{msg.time}</div>}
      </div>

      {isUser && (
        <div className="cw-av cw-av--user"><User size={13} /></div>
      )}
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export function ChatWidget({ student }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      const name = student?.name?.split(" ")[0] || "there";
      const career = student?.targetCareer || "your career";
      setMessages([
        {
          from: "ai",
          time: now(),
          text: `Hi ${name}! 👋\n\nI'm your **PathForge AI mentor**. Ask me anything — coding concepts, career advice, interview prep, study plans, or project ideas for **${career}**.\n\nWhat's on your mind?`,
        },
      ]);
    }
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 120);
  }, [open]);

  const send = useCallback(async (rawText) => {
    const text = (rawText || input).trim();
    if (!text || loading) return;

    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMsg = { from: "user", text, time: now() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const reply = await sendMessage(nextMessages, student);
      setMessages((prev) => [...prev, { from: "ai", text: reply, time: now() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Something went wrong. Please try again.", time: now() },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, student]);

  // ── FAB (closed state) ──
  if (!open) {
    return (
      <>
        <div className="cw-fab-wrap">
          {/* Outer glow ring */}
          <span className="cw-fab-ring cw-fab-ring-1" />
          <span className="cw-fab-ring cw-fab-ring-2" />

          {/* Floating label */}
          <div className="cw-fab-label">Ask AI ✨</div>

          {/* Main FAB button */}
          <button
            onClick={() => setOpen(true)}
            className="cw-fab"
            aria-label="Open PathForge AI"
            title="Ask PathForge AI"
          >
            {/* Shimmer sweep */}
            <span className="cw-fab-shimmer" />
            <Bot size={24} className="cw-fab-icon" />
            {/* Online dot */}
            <span className="cw-fab-dot" />
          </button>
        </div>
        <style>{cwStyles}</style>
      </>
    );
  }

  return (
    <>
      {/* Dark backdrop */}
      <div className="cw-backdrop" onClick={() => setOpen(false)} />

      {/* Chat panel */}
      <div className="cw-panel" role="dialog" aria-label="PathForge AI Assistant">

        {/* ── Header ── */}
        <div className="cw-header">
          <div className="cw-header-left">
            <div className="cw-header-av">
              <Bot size={17} />
              <span className="cw-online-dot" />
            </div>
            <div>
              <div className="cw-header-name">PathForge AI</div>
              <div className="cw-header-sub">
                <span className="cw-status-dot" />
                Online · {student?.targetCareer || "Career goal not set"}
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="cw-close-btn"
            aria-label="Close chat"
          >
            <X size={17} />
          </button>
        </div>

        {/* ── Messages ── */}
        <div className="cw-messages">
          {messages.map((m, i) => (
            <Bubble key={i} msg={m} />
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="cw-row cw-row--ai">
              <div className="cw-av cw-av--ai"><Bot size={14} /></div>
              <div className="cw-bwrap">
                <div className="cw-meta">
                  <span className="cw-meta-name">PathForge AI</span>
                  <span className="cw-meta-time">now</span>
                </div>
                <div className="cw-bubble cw-bubble--ai cw-bubble--typing">
                  <TypingDots />
                  <span className="cw-thinking">Thinking…</span>
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* ── Input ── */}
        <div className="cw-input-area">
          {/* Quick Action Chips */}
          <div className="cw-quick-chips">
            <button
              onClick={() => send("What is my current career status and skill match?")}
              disabled={loading}
              className="cw-chip"
              title="What is my status?"
            >
              🎯 My Career Status
            </button>
            <button
              onClick={() => send("Analyze my quiz and assessment performance, identify my weak topics, and give explainable recommendations.")}
              disabled={loading}
              className="cw-chip"
              title="Analyze assessment performance"
            >
              📊 Quiz & Gap Analysis
            </button>
            <button
              onClick={() => send("Suggest internships, application strategies, and interview preparation plans tailored to my target career.")}
              disabled={loading}
              className="cw-chip"
              title="Internship & Interview Prep"
            >
              💼 Internship & Interview Plan
            </button>
            <button
              onClick={() => send("Recommend top certifications and portfolio projects to close my high-priority skill gaps.")}
              disabled={loading}
              className="cw-chip"
              title="Certifications & Projects"
            >
              🎓 Certifications & Projects
            </button>
            <button
              onClick={() => send("Recommend alternative suitable career paths based on my current skills, and explain the dynamic career switch process.")}
              disabled={loading}
              className="cw-chip"
              title="Career Path Switching"
            >
              🔄 Career Path Switcher
            </button>
            <button
              onClick={() => send("Create a personalized study plan matching my VARK learning style preference.")}
              disabled={loading}
              className="cw-chip"
              title="VARK Learning Plan"
            >
              🎨 Learning Style Plan
            </button>
          </div>

          <div className="cw-input-box">
            <textarea
              ref={textareaRef}
              value={input}
              rows={1}
              disabled={loading}
              placeholder="Ask me anything…"
              className="cw-textarea"
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="cw-send-btn"
              aria-label="Send"
            >
              {loading ? <StopCircle size={15} /> : <Send size={15} />}
            </button>
          </div>
          <p className="cw-input-hint">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>

      <style>{cwStyles}</style>
    </>
  );
}

// ─── All Styles (self-contained, no class conflicts) ─────────────────────────

const cwStyles = `
  /* ── FAB Wrapper ── */
  .cw-fab-wrap {
    position: fixed; bottom: 26px; right: 26px; z-index: 40;
    display: flex; align-items: center; justify-content: center;
    animation: cw-fab-bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  /* Glowing orbital rings */
  .cw-fab-ring {
    position: absolute; border-radius: 50%;
    border: 2px solid rgba(34,211,238,0.4);
    pointer-events: none;
  }
  .cw-fab-ring-1 {
    width: 76px; height: 76px;
    animation: cw-ring-spin 3s linear infinite;
    border-top-color: #22d3ee;
    border-right-color: transparent;
    border-bottom-color: #8b5cf6;
    border-left-color: transparent;
  }
  .cw-fab-ring-2 {
    width: 92px; height: 92px;
    animation: cw-ring-spin 5s linear infinite reverse;
    border-top-color: transparent;
    border-right-color: rgba(139,92,246,0.5);
    border-bottom-color: transparent;
    border-left-color: rgba(34,211,238,0.3);
  }

  /* Floating "Ask AI" label */
  .cw-fab-label {
    position: absolute;
    right: 68px; bottom: 14px;
    background: linear-gradient(135deg, rgba(34,211,238,0.15), rgba(139,92,246,0.15));
    border: 1px solid rgba(34,211,238,0.35);
    backdrop-filter: blur(12px);
    color: #67e8f9; font-size: 11.5px; font-weight: 700;
    padding: 5px 11px; border-radius: 20px;
    white-space: nowrap; pointer-events: none;
    animation: cw-label-float 2.8s ease-in-out infinite;
    box-shadow: 0 4px 16px rgba(34,211,238,0.18);
    letter-spacing: 0.02em;
  }
  .cw-fab-label::after {
    content: '';
    position: absolute; right: -6px; top: 50%;
    transform: translateY(-50%);
    width: 0; height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 6px solid rgba(34,211,238,0.35);
  }

  /* Main FAB button */
  .cw-fab {
    position: relative;
    width: 58px; height: 58px; border-radius: 18px;
    background: linear-gradient(135deg, #22d3ee 0%, #8b5cf6 60%, #f472b6 100%);
    border: none; cursor: pointer; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    color: #04121a;
    box-shadow:
      0 0 0 3px rgba(34,211,238,0.2),
      0 8px 32px rgba(34,211,238,0.45),
      0 4px 16px rgba(139,92,246,0.3),
      0 2px 8px rgba(0,0,0,0.5);
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    animation: cw-fab-glow 3s ease-in-out infinite;
  }
  .cw-fab:hover {
    transform: scale(1.12) rotate(-3deg);
    box-shadow:
      0 0 0 4px rgba(34,211,238,0.35),
      0 14px 45px rgba(34,211,238,0.6),
      0 6px 20px rgba(139,92,246,0.4);
  }
  .cw-fab:active { transform: scale(0.96); }

  /* Shimmer sweep across the button */
  .cw-fab-shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(105deg,
      transparent 30%,
      rgba(255,255,255,0.35) 50%,
      transparent 70%
    );
    background-size: 200% 100%;
    animation: cw-shimmer 2.5s ease-in-out infinite;
    border-radius: inherit;
    pointer-events: none;
  }

  /* Bot icon inside FAB */
  .cw-fab-icon { position: relative; z-index: 1; drop-shadow: 0 2px 4px rgba(0,0,0,0.3); }

  /* Online indicator dot */
  .cw-fab-dot {
    position: absolute; top: -3px; right: -3px;
    width: 13px; height: 13px; border-radius: 50%;
    background: #34d399;
    border: 2.5px solid #060911;
    box-shadow: 0 0 8px #34d399, 0 0 16px rgba(52,211,153,0.5);
    animation: cw-pulse 2s infinite;
    z-index: 2;
  }

  /* Backdrop */
  .cw-backdrop {
    position: fixed; inset: 0; z-index: 48;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(5px);
    animation: cw-fade 0.2s ease;
  }

  /* Panel */
  .cw-panel {
    position: fixed;
    bottom: 26px; right: 26px;
    z-index: 49;
    width: min(460px, calc(100vw - 52px));
    height: min(620px, calc(100vh - 52px));
    background: linear-gradient(170deg, #09101f 0%, #070c18 100%);
    border: 1px solid rgba(34,211,238,0.16);
    border-radius: 22px;
    display: flex; flex-direction: column; overflow: hidden;
    box-shadow:
      0 32px 80px rgba(0,0,0,0.65),
      0 0 0 1px rgba(255,255,255,0.04),
      inset 0 1px 0 rgba(255,255,255,0.06);
    animation: cw-up 0.3s cubic-bezier(0.16,1,0.3,1);
  }

  /* Header */
  .cw-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px;
    background: rgba(7,12,24,0.96);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    flex-shrink: 0;
  }
  .cw-header-left { display: flex; align-items: center; gap: 10px; }
  .cw-header-av {
    width: 38px; height: 38px; border-radius: 11px;
    background: linear-gradient(135deg, #22d3ee, #8b5cf6);
    display: flex; align-items: center; justify-content: center;
    color: #04121a; position: relative; flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(34,211,238,0.28);
  }
  .cw-online-dot {
    position: absolute; top: -2px; right: -2px;
    width: 10px; height: 10px; border-radius: 50%;
    background: #34d399; border: 2px solid #07101f;
    animation: cw-pulse 2.2s infinite;
  }
  .cw-header-name {
    font-size: 14px; font-weight: 700; color: #fff; line-height: 1.2;
  }
  .cw-header-sub {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: #64748b; margin-top: 1px;
  }
  .cw-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #34d399; box-shadow: 0 0 5px #34d399;
  }
  .cw-close-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: transparent; border: none;
    color: #64748b; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s;
  }
  .cw-close-btn:hover { background: rgba(239,68,68,0.12); color: #f87171; }

  /* Messages */
  .cw-messages {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: 18px 15px;
    display: flex; flex-direction: column; gap: 16px;
  }
  .cw-messages::-webkit-scrollbar { width: 4px; }
  .cw-messages::-webkit-scrollbar-track { background: transparent; }
  .cw-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 4px; }

  /* Message row */
  .cw-row {
    display: flex; gap: 9px; align-items: flex-start;
    animation: cw-msg 0.22s cubic-bezier(0.16,1,0.3,1);
  }
  .cw-row--user { flex-direction: row-reverse; }

  /* Avatars */
  .cw-av {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 2px;
  }
  .cw-av--ai {
    background: linear-gradient(135deg, #22d3ee, #8b5cf6);
    color: #04121a;
    box-shadow: 0 2px 8px rgba(34,211,238,0.2);
  }
  .cw-av--user {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: #fff;
    box-shadow: 0 2px 8px rgba(59,130,246,0.2);
  }

  /* Bubble wrap */
  .cw-bwrap {
    display: flex; flex-direction: column; gap: 3px;
    max-width: calc(100% - 40px);
  }
  .cw-bwrap--user { align-items: flex-end; }

  /* Meta */
  .cw-meta { display: flex; align-items: center; gap: 5px; padding: 0 1px; }
  .cw-meta-name { font-size: 11px; font-weight: 700; color: #94a3b8; }
  .cw-meta-time { font-size: 10px; color: #475569; }
  .cw-user-time { font-size: 10px; color: #475569; padding: 0 1px; text-align: right; }

  /* Bubbles */
  .cw-bubble {
    padding: 11px 14px; border-radius: 16px;
    font-size: 13px; line-height: 1.65;
  }
  .cw-bubble--ai {
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.08);
    color: #e2e8f0; border-top-left-radius: 4px;
  }
  .cw-bubble--user {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: #fff; font-weight: 500;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 14px rgba(37,99,235,0.28);
  }
  .cw-bubble--typing {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
  }

  /* Copy button */
  .cw-copy-btn {
    display: flex; align-items: center; gap: 3px;
    padding: 2px 8px; border-radius: 5px;
    font-size: 11px; font-weight: 500;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    color: #475569; cursor: pointer; transition: all 0.15s;
    opacity: 0;
    align-self: flex-start;
  }
  .cw-row:hover .cw-copy-btn { opacity: 1; }
  .cw-copy-btn:hover { background: rgba(255,255,255,0.09); color: #94a3b8; }

  /* Message content */
  .cw-msg-body { display: flex; flex-direction: column; gap: 2px; }
  .cw-para { margin: 1px 0; }
  .cw-gap { height: 5px; }
  .cw-h1 { font-size: 15px; font-weight: 800; color: #fff; margin: 7px 0 3px; }
  .cw-h2 { font-size: 13.5px; font-weight: 700; color: #e2e8f0; margin: 5px 0 2px; }
  .cw-h3 { font-size: 12.5px; font-weight: 700; color: #cbd5e1; margin: 4px 0 2px; }
  .cw-bullet {
    display: flex; align-items: flex-start; gap: 7px; margin: 2px 0;
  }
  .cw-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #22d3ee; flex-shrink: 0; margin-top: 7px;
  }
  .cw-numbered { display: flex; align-items: flex-start; gap: 7px; margin: 2px 0; }
  .cw-num {
    min-width: 19px; height: 19px; border-radius: 5px;
    background: rgba(34,211,238,0.14); color: #22d3ee;
    font-size: 10px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 2px;
  }
  .cw-inline-code {
    background: rgba(34,211,238,0.08);
    border: 1px solid rgba(34,211,238,0.18);
    color: #67e8f9; font-family: monospace;
    font-size: 11.5px; padding: 1px 5px; border-radius: 4px;
  }
  .cw-link {
    color: #22d3ee; font-weight: 600; text-decoration: none;
    border-bottom: 1px solid rgba(34,211,238,0.3);
    transition: color 0.15s, border-color 0.15s;
  }
  .cw-link:hover { color: #67e8f9; border-color: rgba(34,211,238,0.65); }
  .cw-code-block {
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 9px; overflow: hidden; margin: 5px 0;
  }
  .cw-code-lang {
    font-size: 10px; color: #475569; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em;
    padding: 5px 11px;
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cw-code-block pre {
    margin: 0; padding: 11px 13px; overflow-x: auto;
    font-size: 11.5px; line-height: 1.6;
    color: #a5f3fc; font-family: 'Fira Code', monospace;
  }

  /* Typing animation */
  .cw-typing { display: flex; gap: 4px; align-items: center; }
  .cw-typing span {
    width: 7px; height: 7px; border-radius: 50%;
    background: linear-gradient(135deg, #22d3ee, #8b5cf6);
    animation: cw-bounce 1.1s infinite;
  }
  .cw-typing span:nth-child(2) { animation-delay: 0.17s; }
  .cw-typing span:nth-child(3) { animation-delay: 0.34s; }
  .cw-thinking { font-size: 12px; color: #475569; font-style: italic; }

  /* Quick Chips */
  .cw-quick-chips {
    display: flex; gap: 6px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 4px;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
  }
  .cw-quick-chips::-webkit-scrollbar { height: 3px; }
  .cw-quick-chips::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 4px; }
  .cw-chip {
    white-space: nowrap; font-size: 11px; font-weight: 600;
    color: #94a3b8; background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px;
    padding: 4px 10px; cursor: pointer; transition: all 0.2s ease;
    display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;
  }
  .cw-chip:hover:not(:disabled) {
    background: rgba(34, 211, 238, 0.12); border-color: rgba(34, 211, 238, 0.35);
    color: #38bdf8; transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(34, 211, 238, 0.15);
  }
  .cw-chip:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Input area */
  .cw-input-area {
    padding: 10px 13px 12px;
    background: rgba(5,9,18,0.92);
    border-top: 1px solid rgba(255,255,255,0.07);
    flex-shrink: 0;
  }
  .cw-input-box {
    display: flex; align-items: flex-end; gap: 9px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 13px; padding: 9px 11px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .cw-input-box:focus-within {
    border-color: rgba(34,211,238,0.32);
    box-shadow: 0 0 0 3px rgba(34,211,238,0.07);
  }
  .cw-textarea {
    flex: 1; background: transparent; border: none; outline: none;
    color: #e2e8f0; font-size: 13px; line-height: 1.5;
    resize: none; font-family: inherit;
    min-height: 22px; max-height: 110px;
  }
  .cw-textarea::placeholder { color: #334155; }
  .cw-textarea:disabled { opacity: 0.5; }
  .cw-send-btn {
    width: 33px; height: 33px; border-radius: 9px; border: none;
    background: linear-gradient(135deg, #22d3ee, #8b5cf6);
    color: #04121a; cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.15s, transform 0.15s;
  }
  .cw-send-btn:hover:not(:disabled) { opacity: 0.88; transform: scale(1.06); }
  .cw-send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .cw-input-hint {
    font-size: 10px; color: #1e2d42; margin-top: 5px; text-align: center;
  }

  /* Animations */
  @keyframes cw-fade { from { opacity:0 } to { opacity:1 } }
  @keyframes cw-up {
    from { opacity:0; transform: translateY(20px) scale(0.97) }
    to { opacity:1; transform: translateY(0) scale(1) }
  }
  @keyframes cw-msg {
    from { opacity:0; transform: translateY(7px) }
    to { opacity:1; transform: translateY(0) }
  }
  @keyframes cw-bounce {
    0%, 60%, 100% { transform: translateY(0) }
    30% { transform: translateY(-6px) }
  }
  @keyframes cw-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.5) }
    50% { box-shadow: 0 0 0 6px rgba(52,211,153,0) }
  }

  /* FAB-specific animations */
  @keyframes cw-ring-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes cw-shimmer {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes cw-label-float {
    0%, 100% { transform: translateY(0px); opacity: 1; }
    50% { transform: translateY(-4px); opacity: 0.85; }
  }
  @keyframes cw-fab-bounceIn {
    0% { opacity: 0; transform: scale(0.5) translateY(30px); }
    70% { transform: scale(1.08) translateY(-4px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes cw-fab-glow {
    0%, 100% {
      box-shadow: 0 0 0 3px rgba(34,211,238,0.2), 0 8px 32px rgba(34,211,238,0.45), 0 4px 16px rgba(139,92,246,0.3);
    }
    50% {
      box-shadow: 0 0 0 5px rgba(34,211,238,0.35), 0 12px 45px rgba(34,211,238,0.65), 0 6px 24px rgba(139,92,246,0.5);
    }
  }

  /* Mobile: fullscreen */
  @media (max-width: 500px) {
    .cw-panel {
      bottom: 0; right: 0; width: 100vw;
      height: 100dvh; border-radius: 0; border: none;
    }
    .cw-backdrop { display: none; }
    .cw-fab-wrap { bottom: 18px; right: 16px; }
    .cw-fab-label { display: none; }
  }
`;

export default ChatWidget;
