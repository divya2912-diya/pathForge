// ============================================================
//  PathForge — Chat Service
//  Calls Google Gemini API. Key is stored in .env only —
//  never exposed in the UI.
// ============================================================

const GEMINI_MODEL = "gemini-2.0-flash";

/**
 * Read the API key from the build-time env variable.
 * This is set in .env as VITE_GEMINI_API_KEY and bundled
 * at build time — it is NOT accessible via any UI.
 */
function getApiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY || "";
}

/**
 * Build the system prompt that instructs Gemini how to behave.
 * Personalised with the student's profile data.
 */
function buildSystemPrompt(student) {
  const name = student?.name?.split(" ")[0] || "there";
  const career = student?.targetCareer || "Software Engineer";
  const degree = student?.degree || "";
  const year = student?.year || "";
  const skills = (student?.userSkillsList || student?.skills || [])
    .map((s) => (typeof s === "string" ? s : s?.name || ""))
    .filter(Boolean)
    .slice(0, 12)
    .join(", ");

  return `You are PathForge AI, an expert career mentor and technical tutor embedded in the PathForge learning platform.

STUDENT PROFILE:
- Name: ${name}
- Degree: ${degree} (${year})
- Target Career: ${career}
- Current Skills: ${skills || "Not specified yet"}

YOUR ROLE:
1. Answer ANY question the student asks — technical concepts, coding problems, career advice, project ideas, interview prep, study plans, or general learning doubts.
2. Always ground your advice in their target career (${career}) and current context.
3. Be concise, clear, and practical. Avoid unnecessary filler text.
4. Use markdown formatting: **bold**, bullet points (•), numbered lists, and \`\`\`code blocks\`\`\` where relevant.
5. If a question is completely unrelated to learning, tech, or career (e.g. casual chat), keep your answer brief and redirect gently.
6. Never mention your own API, model name, or internal configuration.
7. Address the student by first name (${name}) occasionally to feel personal.`;
}

/**
 * Main function: send message history + student context to Gemini,
 * return the AI's reply as a string.
 *
 * @param {Array<{from: "user"|"ai", text: string}>} messages - Full conversation history
 * @param {Object} student - Student profile object from Supabase
 * @returns {Promise<string>} - The AI reply text
 */
export async function sendMessage(messages, student) {
  const apiKey = getApiKey();

  // No key configured — return a helpful prompt to the admin
  if (!apiKey || apiKey.trim() === "") {
    return buildOfflineReply(messages[messages.length - 1]?.text || "", student);
  }

  const systemPrompt = buildSystemPrompt(student);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  // Map conversation history to Gemini's format
  const contents = messages.map((m) => ({
    role: m.from === "user" ? "user" : "model",
    parts: [{ text: m.text || "" }],
  }));

  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.9,
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", res.status, errText);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "I didn't get a response. Please try rephrasing your question.";
  } catch (err) {
    console.error("Chat service error:", err);
    return "Something went wrong. Please check your connection and try again.";
  }
}

/**
 * Basic offline reply when no API key is set.
 * Gives a useful answer for common questions so the UI is never blank.
 */
function buildOfflineReply(query = "", student) {
  const q = query.toLowerCase();
  const career = student?.targetCareer || "Software Engineer";
  const name = student?.name?.split(" ")[0] || "there";

  if (q.includes("react") || q.includes("hook") || q.includes("component")) {
    return `### React Fundamentals\n\n**React** is a JavaScript library for building UIs from reusable components.\n\n**Key hooks:**\n• \`useState\` — local component state\n• \`useEffect\` — side effects (data fetch, subscriptions)\n• \`useRef\` — DOM references, mutable values\n• \`useContext\` — consume shared context\n\nFor **${career}**, React is often paired with Next.js or Vite for production apps.`;
  }
  if (q.includes("python") || q.includes("django") || q.includes("fastapi")) {
    return `### Python & Backend Development\n\n**Python** is the top language for AI/ML, data science, and backend APIs.\n\n**Essential areas:**\n• Data structures: lists, dicts, sets, tuples\n• OOP: classes, decorators, generators\n• Web: **FastAPI** (modern, async) or **Django** (full-featured)\n• ML: NumPy, Pandas, Scikit-learn, PyTorch\n\nGreat fit for your **${career}** target!`;
  }
  if (q.includes("sql") || q.includes("database") || q.includes("postgres")) {
    return `### Databases & SQL\n\n**Relational databases** power most production applications.\n\n**Must-know concepts:**\n• SELECT, JOIN, GROUP BY, subqueries\n• Indexing for query performance\n• Transactions & ACID properties\n• ORMs: SQLAlchemy (Python), Prisma (JS)\n\nFor ${career}, understanding query optimisation is a key interview topic.`;
  }
  if (q.includes("system design") || q.includes("architecture")) {
    return `### System Design Basics\n\n**Core pillars:**\n• **Scalability** — horizontal vs vertical scaling, load balancers\n• **Caching** — Redis, CDN edge caching\n• **Databases** — SQL vs NoSQL trade-offs, sharding\n• **Queues** — Kafka, RabbitMQ for async processing\n• **APIs** — REST vs GraphQL vs gRPC\n\nStart with the [System Design Primer](https://github.com/donnemartin/system-design-primer) — it's the gold standard resource.`;
  }
  if (q.includes("study plan") || q.includes("roadmap") || q.includes("learn")) {
    return `### Suggested Study Plan for ${name}\n\n**Target: ${career}**\n\n**Week 1–2:** Core fundamentals (data structures, algorithms basics)\n**Week 3–4:** Primary language deep-dive (Python / JavaScript)\n**Week 5–6:** Framework & tooling (React, FastAPI, or relevant stack)\n**Week 7–8:** Build a portfolio project end-to-end\n**Ongoing:** LeetCode 2–3 problems/day, mock interviews\n\nConsistency beats intensity — 2 focused hours daily > 8 hours on weekends.`;
  }
  if (q.includes("interview") || q.includes("job") || q.includes("placement")) {
    return `### Interview Preparation Guide\n\n**Technical Round:**\n• DSA: Arrays, strings, trees, graphs, DP\n• System design (for senior roles)\n• Language-specific concepts\n\n**Behavioural Round:**\n• STAR method: Situation, Task, Action, Result\n• Prepare 5–6 strong project stories\n\n**For ${career} roles specifically:**\n• Be ready to explain ML pipelines, model evaluation, or full-stack architecture depending on the company.\n\nWant me to run a mock interview question?`;
  }

  return `Hi ${name}! 👋\n\nI'm your PathForge AI mentor. Ask me anything about:\n• **Concepts** — explain any tech topic\n• **Code** — debug or review your code\n• **Career** — job prep, interview tips, roadmaps\n• **Projects** — ideas tailored to **${career}**\n• **Study plans** — weekly learning schedules\n\nWhat would you like to explore today?`;
}
