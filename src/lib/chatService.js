// ============================================================
//  PathForge — Chat Service (OpenRouter)
//  Uses OpenRouter API — supports free models like Llama, Mistral.
//  Key is stored in .env only — never exposed in the UI.
// ============================================================

// Use OpenRouter's auto-router — it picks the best free model automatically.
// This never 404s because it adapts to whatever models are currently available.
const OR_MODEL = "openrouter/auto";
const OR_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Read the API key from the build-time env variable.
 */
function getApiKey() {
  return import.meta.env.VITE_OPENROUTER_API_KEY || "";
}

/**
 * Build the system prompt personalised with the student's profile.
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
1. Answer EVERY question the student asks thoroughly and specifically — do NOT give a generic response.
2. For technical questions: give detailed explanations with code examples in markdown code blocks.
3. For career questions: give specific, actionable advice tied to their target career (${career}).
4. For general questions: answer them directly and helpfully.
5. ALWAYS vary your response based on exactly what was asked — never give the same generic reply.
6. Use markdown: **bold**, bullet points, numbered lists, and \`\`\`language code blocks\`\`\` where relevant.
7. Be concise but complete. Address the student by first name (${name}) occasionally.
8. Never mention your own API, model name, or internal configuration.`;
}

/**
 * Main function: send message history to OpenRouter, return AI reply.
 *
 * @param {Array<{from: "user"|"ai", text: string}>} messages
 * @param {Object} student - Student profile from Supabase
 * @returns {Promise<string>}
 */
export async function sendMessage(messages, student) {
  const apiKey = getApiKey();

  // No key configured — use offline smart fallback
  if (!apiKey || apiKey.trim() === "") {
    const lastQuery = messages[messages.length - 1]?.text || "";
    return buildOfflineReply(lastQuery, student);
  }

  const systemPrompt = buildSystemPrompt(student);

  // Build OpenAI-compatible messages array (OpenRouter uses same format)
  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text || "",
    })),
  ];

  // Models to try in order — if one fails or rate-limits, try the next
  const candidateModels = [
    "openrouter/auto",
    "openrouter/free",
    "qwen/qwen3.8-27b:free",
  ];

  let lastErrorStatus = null;

  for (const model of candidateModels) {
    const payload = {
      model,
      messages: chatMessages,
      temperature: 0.8,
      max_tokens: 1500,
      top_p: 0.95,
    };

    try {
      const res = await fetch(OR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://pathforge.app",
          "X-Title": "PathForge AI Mentor",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        lastErrorStatus = res.status;
        const errData = await res.json().catch(() => ({}));
        console.warn(`OpenRouter model ${model} failed (${res.status}):`, errData?.error?.message);

        // If key is invalid (401), don't retry other models — fail early
        if (res.status === 401) {
          return `⚠️ **Invalid API Key.** Make sure your \`VITE_OPENROUTER_API_KEY\` in \`.env\` is correct.\n\nGet a free key at [openrouter.ai/keys](https://openrouter.ai/keys).`;
        }
        // For 404, 429, 502, etc. -> try next model in loop
        continue;
      }

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;

      if (reply) {
        return reply;
      }
      console.warn(`OpenRouter model ${model} returned empty content, trying next...`);
    } catch (err) {
      console.error(`Fetch error with model ${model}:`, err);
    }
  }

  // If all API calls fail, fallback gracefully
  if (lastErrorStatus === 429) {
    return "⚠️ **Rate limit reached across free models.** Please wait a moment and try again.";
  }
  if (lastErrorStatus === 402) {
    return "⚠️ **Free quota exhausted.** Add credits at [openrouter.ai](https://openrouter.ai) or check your key.";
  }
  return `⚠️ Unable to connect to OpenRouter free models right now. Please try again in a moment.`;
}

/**
 * Offline fallback — used only when NO API key is set.
 * Gives topic-specific answers so the chat is never broken.
 */
function buildOfflineReply(query = "", student) {
  const q = query.toLowerCase().trim();
  const career = student?.targetCareer || "Software Engineer";
  const name = student?.name?.split(" ")[0] || "there";

  if (/^(hi|hello|hey|howdy)[!\s]?$/.test(q)) {
    return `Hey ${name}! 👋 I'm your PathForge AI. Ask me anything — coding, career, interviews, projects — I'm here to help!`;
  }
  if (/react|jsx|hook|usestate|useeffect|component|vite|next\.?js|redux/.test(q)) {
    return `### React & Frontend\n\n**React** is a component-based UI library.\n\n• \`useState\` — local state\n• \`useEffect\` — side effects after render\n• \`useRef\` — DOM access without re-render\n• \`useContext\` — global state sharing\n\n\`\`\`jsx\nconst [count, setCount] = useState(0);\nuseEffect(() => { document.title = \`Count: \${count}\`; }, [count]);\n\`\`\`\n\nFor **${career}**, React + TypeScript + Next.js is the industry standard.`;
  }
  if (/python|django|fastapi|flask|numpy|pandas|pytorch|sklearn/.test(q)) {
    return `### Python Development\n\nPython is the top language for **${career}**.\n\n• **Web:** FastAPI (async, modern) or Django (batteries-included)\n• **Data:** NumPy, Pandas, Matplotlib\n• **ML:** Scikit-learn, PyTorch, TensorFlow\n\n\`\`\`python\nasync def get_user(id: int) -> User:\n    return await db.users.find_one({"_id": id})\n\`\`\``;
  }
  if (/sql|database|postgres|mysql|mongodb|redis|query|join/.test(q)) {
    return `### Databases & SQL\n\nEssentials for ${career}:\n\n• **SQL:** SELECT, JOIN, GROUP BY, indexes, transactions\n• **NoSQL:** MongoDB (documents), Redis (cache)\n\n\`\`\`sql\nSELECT u.name, COUNT(o.id) as orders\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id ORDER BY orders DESC;\n\`\`\``;
  }
  if (/algorithm|dsa|array|tree|graph|dp|dynamic|sort|search|big.?o/.test(q)) {
    return `### Data Structures & Algorithms\n\n**Big-O Complexity:**\n• O(1) → Hash map lookup\n• O(log n) → Binary search\n• O(n) → Single loop\n• O(n²) → Nested loops\n\n**Key patterns:** Two pointers, Sliding window, BFS/DFS, DP\n\n\`\`\`python\ndef binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return -1\n\`\`\``;
  }
  if (/system design|architecture|scalab|microservice|load balanc/.test(q)) {
    return `### System Design\n\nCore pillars:\n\n1. **Scalability** — horizontal vs vertical scaling\n2. **Caching** — Redis, CDN for static assets\n3. **Load Balancing** — distribute traffic (Nginx, AWS ALB)\n4. **Databases** — read replicas, sharding\n5. **Message Queues** — Kafka/RabbitMQ for decoupling\n\n[System Design Primer](https://github.com/donnemartin/system-design-primer) is the best free resource.`;
  }
  if (/interview|placement|job|resume|coding round/.test(q)) {
    return `### Interview Prep for ${career}\n\n**Technical:** DSA (LeetCode Easy→Medium), System Design, Language depth\n**Behavioural:** STAR method — Situation, Task, Action, Result\n\n**30-day plan:**\n• Week 1–2: DSA daily (2 problems/day)\n• Week 3: System design concepts\n• Week 4: Mock interviews + company research`;
  }
  if (/study plan|roadmap|how to learn|where to start|schedule/.test(q)) {
    return `### Study Plan for ${name} → ${career}\n\n**Month 1:** Core language + DSA fundamentals\n**Month 2:** Framework + Databases + Build projects\n**Month 3:** Deploy + Interview prep + Apply\n\n**Daily habit:** 2 focused hours beats 8 distracted hours every time.`;
  }

  return `### PathForge AI\n\n**You asked:** "${query}"\n\nI'm ready to help with anything — coding concepts, career advice, project ideas, interview prep, or study plans for **${career}**.\n\nCould you give a bit more detail about what you need? That way I can give you a really specific and useful answer!`;
}
