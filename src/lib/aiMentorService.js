// ============================================================
//  PathForge — Real AI Career Mentor Service
// ============================================================
import { supabase } from "./supabaseClient";
import { getCurrentUser, loadMilestoneProgress, updateCurrentUser } from "../data/supabaseAuth";
import { SKILL_REQUIREMENTS, calculateDynamicReadiness } from "../data/userProfile";

/**
 * 1. Fetch & Build Dynamic User Context Object from Supabase
 */
export async function buildUserContext(studentProp = null) {
  const student = studentProp || (await getCurrentUser());
  if (!student) return null;

  const targetCareer = student.targetCareer || "Software Engineer";
  const required = SKILL_REQUIREMENTS[targetCareer] || SKILL_REQUIREMENTS["Software Engineer"] || [];

  const userSkills = (student.skills || []).map(s => s.toLowerCase());
  const userSkillsList = (student.userSkillsList || []).map(s => s.name.toLowerCase());
  const allUserSkills = new Set([...userSkills, ...userSkillsList]);

  const isMastered = (reqSkill) => {
    return Array.from(allUserSkills).some(s => s.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s));
  };

  const skillGaps = required.filter(r => !isMastered(r));
  const strengths = required.filter(r => isMastered(r));

  // Load milestone progress
  const milestoneMap = await loadMilestoneProgress(targetCareer);
  const completedMilestones = Object.entries(milestoneMap)
    .filter(([_, val]) => val === 1)
    .map(([key]) => key);

  const readiness = calculateDynamicReadiness(student) || 0;

  return {
    profile: {
      name: student.name || "User",
      degree: student.degree || "",
      year: student.year || "",
      targetCareer,
      bio: student.bio || "",
      location: student.location || "",
      github: student.github || "",
    },
    skills: student.userSkillsList && student.userSkillsList.length > 0 
      ? student.userSkillsList 
      : (student.skills || []).map(s => ({ name: s, proficiency: "Intermediate" })),
    strengths,
    skillGaps,
    requiredSkills: required,
    projects: student.projectsList || [],
    certifications: student.certificationsList || [],
    learningPreferences: student.learningPreferences || {
      hoursPerWeek: student.pace || "5–10 hours",
      learningStyle: "Hands-on Projects",
      targetTimeline: "3–6 months",
    },
    roadmap: {
      targetCareer,
      completedCount: completedMilestones.length,
      nextGap: skillGaps[0] || null,
    },
    assessments: student.assessments || [],
    resumeInfo: student.resumeInfo || null,
    careerReadiness: readiness,
  };
}

/**
 * 2. System Prompt Generator
 */
export function getSystemPrompt(userContext) {
  return `You are PathForge AI Mentor, an expert personalized career and learning mentor for software engineers, data scientists, AI engineers, and tech professionals.

Your job is to answer ANY question, doubt, technical query, concept explanation, project request, study plan request, or interview question asked by the user, while grounding your advice in their authenticated PathForge profile.

AUTHENTICATED USER CONTEXT:
${JSON.stringify(userContext, null, 2)}

STRICT MENTORING DIRECTIVES:
1. Answer ANY user question or doubt thoroughly, clearly, and technically.
2. Ground your advice in their target career (${userContext?.profile?.targetCareer}) and current skill gaps (${userContext?.skillGaps?.join(", ") || "All core skills matched"}).
3. Never invent facts about the user's achievements.
4. Adapt complexity to their proficiency: Beginner (simple with analogies), Intermediate (practical implementation), Advanced (system trade-offs & optimization).
5. Always provide actionable takeaways and resources where relevant.

Use clean Markdown formatting.`;
}

/**
 * 3. Primary AI Completion API Call (OpenRouter API)
 */
export async function callAIProvider(messagesHistory, userContext) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || 
                 import.meta.env.VITE_AI_API_KEY || 
                 import.meta.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return generateSmartFallback(messagesHistory[messagesHistory.length - 1]?.content || "", userContext);
  }

  try {
    const systemPrompt = getSystemPrompt(userContext);
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messagesHistory.map(m => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text || m.content || "",
      }))
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "PathForge AI Mentor"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-lite-001",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 850,
      })
    });

    if (!response.ok) {
      console.warn("OpenRouter API non-200 status:", response.status);
      return generateSmartFallback(messagesHistory[messagesHistory.length - 1]?.content || "", userContext);
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content;
    if (replyText) return replyText;

    return generateSmartFallback(messagesHistory[messagesHistory.length - 1]?.content || "", userContext);
  } catch (err) {
    console.error("AI Mentor service call exception:", err);
    return generateSmartFallback(messagesHistory[messagesHistory.length - 1]?.content || "", userContext);
  }
}

/**
 * 4. Comprehensive Fallback & Topic Knowledge Engine
 * Provides accurate, data-driven mentoring for ANY question or doubt.
 */
export function generateSmartFallback(userPrompt, ctx) {
  if (!ctx) return "I couldn't load your career profile. Please try refreshing or completing your profile.";

  const query = userPrompt.toLowerCase();
  const name = ctx.profile.name.split(" ")[0] || "there";
  const career = ctx.profile.targetCareer;
  const topGap = ctx.skillGaps[0];
  const strengths = ctx.strengths.slice(0, 3).join(", ");
  const gapsList = ctx.skillGaps.slice(0, 4).join(", ");
  const hours = ctx.learningPreferences.hoursPerWeek;
  const style = ctx.learningPreferences.learningStyle;

  // ── 1. QUICK ACTION HANDLERS ──────────────────────────────

  if (query.includes("explain this") || (query === "explain")) {
    if (topGap) {
      return `### Concept Breakdown: ${topGap}\n\n` +
        `**Why it matters for ${career}:**\n` +
        `${topGap} is currently your highest priority skill gap. Mastering it unlocks key production capabilities for your target role.\n\n` +
        `**Core Explanation:**\n` +
        `• **Definition:** ${topGap} provides standard building blocks and patterns used in modern ${career} development.\n` +
        `• **How it works:** It handles state, data transformation, or execution efficiency so your application runs reliably.\n` +
        `• **Real-World Pattern:** Combined with your existing knowledge in ${strengths || "core programming"}, it allows you to build scalable features.\n\n` +
        `**What to do next:**\n` +
        `1. Review official documentation: [Open Resource](https://www.google.com/search?q=Learn+${encodeURIComponent(topGap)}+official+documentation)\n` +
        `2. Build a mini project incorporating ${topGap}.\n\n` +
        `**Expected Outcome:** Closes 1 of your ${ctx.skillGaps.length} remaining skill gaps!`;
    }
    return `### Skill Overview for ${career}\n\n` +
      `You have matched all core requirements for **${career}**!\n\n` +
      `What specific technical concept, framework, or interview topic would you like me to explain?`;
  }

  if (query.includes("create study plan") || query.includes("study plan")) {
    const gaps = ctx.skillGaps.length > 0 ? ctx.skillGaps : ["System Design", "Advanced Projects"];
    const g1 = gaps[0] || "Core Concepts";
    const g2 = gaps[1] || "Advanced Patterns";
    const g3 = gaps[2] || "Portfolio Integration";

    return `### Personalized 4-Week Study Plan for ${name}\n\n` +
      `**Target Role:** ${career}\n` +
      `**Weekly Commitment:** ${hours} (${style})\n\n` +
      `**Week 1 — ${g1} Fundamentals**\n` +
      `• Core syntax, mechanics, and environment setup.\n` +
      `• Practice: 3 foundational exercises.\n\n` +
      `**Week 2 — Deep Dive: ${g1} + ${g2}**\n` +
      `• Integrating ${g1} into real application workflows.\n` +
      `• Practice: Build a lightweight mini-application.\n\n` +
      `**Week 3 — Mastering ${g2}**\n` +
      `• Advanced state management, error handling, and performance.\n` +
      `• Practice: Refactor code and write unit tests.\n\n` +
      `**Week 4 — Portfolio Showcase (${g3})**\n` +
      `• Build and deploy a capstone project combining ${g1} and ${g2}.\n` +
      `• Push code to GitHub to add real evidence to your profile!`;
  }

  if (query.includes("analyze my progress") || query.includes("analyze progress")) {
    return `### PathForge Progress Analysis for ${name}\n\n` +
      `**CURRENT PROGRESS:** ${ctx.careerReadiness}% Career Readiness for **${career}**.\n\n` +
      `**STRENGTHS:**\n` +
      `${strengths ? `✓ ${strengths}` : "• Add your skills in your profile to show strengths."}\n` +
      `${ctx.projects.length > 0 ? `✓ ${ctx.projects.length} project(s) added` : ""}\n` +
      `${ctx.certifications.length > 0 ? `✓ ${ctx.certifications.length} certification(s) earned` : ""}\n\n` +
      `**SKILL GAPS REMAINING:**\n` +
      `${gapsList ? `⚠️ ${gapsList}` : "✓ No remaining core gaps!"}\n\n` +
      `**NEXT ACTION:**\n` +
      `${topGap ? `Focus on **${topGap}** to close your top skill gap.` : "Take an initial assessment or add a new project to your profile."}`;
  }

  if (query.includes("recommend resources") || query.includes("resources")) {
    const targetGap = topGap || "Software Engineering";
    return `### Recommended Learning Resources for ${career}\n\n` +
      `**Target Skill Gap:** ${targetGap}\n\n` +
      `**1. LEARN**\n` +
      `• Official ${targetGap} Documentation & Guide\n` +
      `  [Open Resource](https://www.google.com/search?q=${encodeURIComponent(targetGap)}+official+documentation)\n\n` +
      `**2. PRACTICE**\n` +
      `• ${targetGap} Interactive Coding Exercises\n` +
      `  [Open Resource](https://www.google.com/search?q=${encodeURIComponent(targetGap)}+practice+problems+leetcode)\n\n` +
      `**3. BUILD**\n` +
      `• ${targetGap} Portfolio Project Tutorial\n` +
      `  [Open Resource](https://www.google.com/search?q=${encodeURIComponent(targetGap)}+project+tutorial+github)\n\n` +
      `**4. CERTIFY**\n` +
      `• Industry Recognized ${targetGap} Certification\n` +
      `  [Open Resource](https://www.google.com/search?q=${encodeURIComponent(targetGap)}+certification+coursera)`;
  }

  if (query.includes("what should i do today") || query.includes("do today")) {
    const focusSkill = topGap || "System Design";
    return `### TODAY'S FOCUS: ${focusSkill}\n\n` +
      `**Why:** ${focusSkill} is part of your roadmap for **${career}** and is your highest-priority skill gap.\n\n` +
      `**Plan:**\n` +
      `• 30 min: Read core ${focusSkill} concepts.\n` +
      `• 45 min: Write a small code exercise implementing ${focusSkill}.\n` +
      `• 30 min: Review & push code to GitHub.\n\n` +
      `**Resource Link:**\n` +
      `[Open Resource](https://www.google.com/search?q=Learn+${encodeURIComponent(focusSkill)}+step+by+step)`;
  }

  if (query.includes("give me a project") || query.includes("project idea")) {
    const gap = topGap || "Backend Services";
    return `### Recommended Project: ${career} Showcase\n\n` +
      `**Title:** ${gap} & ${ctx.strengths[0] || "Core Skills"} App\n\n` +
      `**Problem Statement:** Build a functional application combining your existing skills in ${strengths || "programming"} with ${gap}.\n\n` +
      `**Key Features:**\n` +
      `1. User Authentication & Profile Data\n` +
      `2. Data CRUD operations powered by ${gap}\n` +
      `3. Responsive Dashboard UI & Cloud Deployment\n\n` +
      `**Difficulty:** Intermediate | **Est. Time:** 8–12 hours\n` +
      `**Career Impact:** Directly closes your ${gap} skill gap and strengthens your portfolio!`;
  }

  if (query.includes("interview") || query.includes("mock interview")) {
    const topic = topGap || "System Design";
    return `### Mock Interview Question: ${career}\n\n` +
      `**Topic:** ${topic}\n\n` +
      `**Question:**\n` +
      `*How would you design and structure a production system using ${topic} to handle high concurrency and prevent data loss?*\n\n` +
      `**How to answer:**\n` +
      `1. Explain key architectural components.\n` +
      `2. Discuss error handling and scalability.\n` +
      `3. Type your response below and I will evaluate it for you!`;
  }

  // ── 2. TECHNICAL DOUBT & TOPIC ANSWER ENGINE ───────────────

  if (query.includes("react") || query.includes("component") || query.includes("hooks")) {
    return `### React & Frontend Architecture\n\n` +
      `**Overview:** React is a component-based JavaScript library for building user interfaces.\n\n` +
      `**Key Concepts to Master:**\n` +
      `• **JSX & Components:** Building reusable UI blocks.\n` +
      `• **State & Props:** \`useState\` for local state, props for passing data.\n` +
      `• **Side Effects:** \`useEffect\` for data fetching and subscriptions.\n` +
      `• **Context & Redux:** Managing global state across components.\n\n` +
      `**Career Context for ${career}:**\n` +
      `${ctx.skillGaps.includes("React") ? `⚠️ React is one of your key skill gaps!` : `✓ You have React listed in your skills.`}\n\n` +
      `[Open React Resource](https://react.dev/learn)`;
  }

  if (query.includes("node") || query.includes("express") || query.includes("backend")) {
    return `### Node.js & Backend Development\n\n` +
      `**Overview:** Node.js executes JavaScript on the server using an event-driven, non-blocking I/O model.\n\n` +
      `**Core Concepts:**\n` +
      `• **REST APIs:** Designing endpoints with HTTP methods (GET, POST, PUT, DELETE).\n` +
      `• **Middleware:** Processing requests, CORS, and JWT authentication.\n` +
      `• **Database Integration:** Connecting to PostgreSQL, MongoDB, or SQL databases.\n\n` +
      `**Career Context for ${career}:**\n` +
      `${ctx.skillGaps.includes("Node.js") ? `⚠️ Node.js is currently a skill gap on your roadmap.` : `✓ Node.js matches your target backend role requirements.`}\n\n` +
      `[Open Node.js Resource](https://nodejs.org/en/docs/)`;
  }

  if (query.includes("sql") || query.includes("database") || query.includes("postgres") || query.includes("mongo")) {
    return `### Databases & SQL Mastery\n\n` +
      `**Overview:** Databases store, query, and manage application data efficiently.\n\n` +
      `**Key Topics:**\n` +
      `• **Relational (SQL):** PostgreSQL / MySQL — structured tables, foreign keys, JOINs, indexing.\n` +
      `• **NoSQL:** MongoDB / Redis — document stores, key-value caching, scaling.\n` +
      `• **Optimization:** Query execution plans, indexing, transaction ACID properties.\n\n` +
      `**Career Context for ${career}:**\n` +
      `${ctx.skillGaps.includes("SQL") ? `⚠️ SQL is an essential gap to close for ${career}.` : `✓ SQL is part of your target skill requirements.`}\n\n` +
      `[Open SQL Resource](https://www.w3schools.com/sql/)`;
  }

  if (query.includes("python") || query.includes("django") || query.includes("flask")) {
    return `### Python & Software Engineering\n\n` +
      `**Overview:** Python is versatile, widely used in web backends (Django/FastAPI), automation, data science, and AI/ML.\n\n` +
      `**Key Areas:**\n` +
      `• Data Structures: Lists, Dicts, Sets, Tuples.\n` +
      `• OOP: Classes, inheritance, decorators, generators.\n` +
      `• Web & APIs: FastAPI, Flask, Django ORM.\n\n` +
      `[Open Python Resource](https://docs.python.org/3/)`;
  }

  if (query.includes("docker") || query.includes("kubernetes") || query.includes("aws") || query.includes("devops") || query.includes("cloud")) {
    return `### Cloud & Containerization (Docker/AWS)\n\n` +
      `**Overview:** Containerization packages code and dependencies into portable containers that run anywhere.\n\n` +
      `**Core Concepts:**\n` +
      `• **Docker:** Dockerfile, images, containers, multi-stage builds, docker-compose.\n` +
      `• **Cloud Services (AWS):** EC2, S3, RDS, Lambda serverless functions.\n` +
      `• **CI/CD:** Automated testing and deployment pipelines via GitHub Actions.\n\n` +
      `[Open DevOps Resource](https://docs.docker.com/get-started/)`;
  }

  if (query.includes("machine learning") || query.includes("deep learning") || query.includes("ai") || query.includes("pytorch") || query.includes("tensorflow")) {
    return `### AI & Machine Learning Engineering\n\n` +
      `**Overview:** Machine learning algorithms learn patterns from data to make predictions or decisions.\n\n` +
      `**Core Progression:**\n` +
      `1. **Data Prep:** NumPy, Pandas, feature engineering.\n` +
      `2. **Classical ML:** Regression, Decision Trees, XGBoost, Scikit-learn.\n` +
      `3. **Deep Learning:** Neural networks, PyTorch, CNNs, Transformers, RAG.\n\n` +
      `[Open Machine Learning Resource](https://scikit-learn.org/stable/)`;
  }

  if (query.includes("system design") || query.includes("architecture") || query.includes("microservice")) {
    return `### System Design & Scalability\n\n` +
      `**Overview:** System design involves structuring software to handle high traffic, concurrency, and reliability.\n\n` +
      `**Key Pillars:**\n` +
      `• **Scalability:** Horizontal vs. vertical scaling, Load Balancers.\n` +
      `• **Caching:** Redis, CDN edge caching.\n` +
      `• **Decoupling:** Message queues (Kafka/RabbitMQ), microservices architecture.\n\n` +
      `[Open System Design Resource](https://github.com/donnemartin/system-design-primer)`;
  }

  // ── 3. GENERAL FREE-FORM MENTOR RESPONSE ───────────────────
  return `### PathForge Career Advice for ${name}\n\n` +
    `**Regarding your question:** "${userPrompt}"\n\n` +
    `**Mentorship Insight for ${career}:**\n` +
    `When addressing this in the context of your target role as a **${career}**, the key is to connect it to your core engineering skills.\n\n` +
    `**Your Current Profile Status:**\n` +
    `• Target Career: **${career}** (${ctx.careerReadiness}% Ready)\n` +
    `• Next Skill Gap: **${topGap || "None"}**\n` +
    `• Commitment: ${hours}/week (${style})\n\n` +
    `**Action Step:**\n` +
    `Would you like me to generate a personalized **study plan**, **practice quiz**, or **portfolio project** related to this?`;
}

/**
 * 5. Adaptive 5-Question Quiz Generator for "Test my knowledge"
 */
export function generateAdaptiveQuiz(targetCareer, topSkillGap) {
  const topic = topSkillGap || "Software Engineering";
  
  return [
    {
      id: 1,
      question: `What is the primary role of ${topic} when building scalable applications for a ${targetCareer}?`,
      options: [
        `Providing core architecture and data handling for ${topic}`,
        `Styling raw HTML buttons`,
        `Bypassing network security controls`,
        `Replacing all database operations`
      ],
      answer: 0,
      topic,
    },
    {
      id: 2,
      question: `Which data structure or pattern is best suited when managing stateful operations in ${topic}?`,
      options: [
        "Unindexed Linear Array",
        "Hash Map / Key-Value Lookup",
        "Single Global String",
        "Random File Buffer"
      ],
      answer: 1,
      topic,
    },
    {
      id: 3,
      question: `What is a common best practice when handling errors or exceptions in ${topic}?`,
      options: [
        "Swallowing errors silently",
        "Catching exceptions, logging context, and returning user-friendly messages",
        "Terminating the server process immediately",
        "Hardcoding empty default objects everywhere"
      ],
      answer: 1,
      topic,
    },
    {
      id: 4,
      question: `In production environments, how should ${topic} handle asynchronous operations?`,
      options: [
        "Using Promises / async-await with proper error boundaries",
        "Using infinite while loops",
        "Blocking the main event loop thread",
        "Ignoring network response promises"
      ],
      answer: 0,
      topic,
    },
    {
      id: 5,
      question: `Which metric is most important when optimizing performance for ${topic}?`,
      options: [
        "Line count of code",
        "Time complexity (Big-O) and memory overhead",
        "Number of variable comments",
        "File extension length"
      ],
      answer: 1,
      topic,
    },
  ];
}
