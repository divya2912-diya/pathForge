// ============================================================
//  PathForge — Real AI Career Mentor Service
// ============================================================
import { supabase } from "./supabaseClient";
import { getCurrentUser, loadMilestoneProgress, updateCurrentUser } from "../data/supabaseAuth";
import { SKILL_REQUIREMENTS, calculateDynamicReadiness } from "../data/userProfile";
import { RESOURCES } from "../data/mockData";

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
  return `You are PathForge AI Mentor, a personalized career and learning mentor.
Your job is to help the authenticated user progress toward their selected career goal.

AUTHENTICATED USER CONTEXT:
${JSON.stringify(userContext, null, 2)}

STRICT RULES:
1. Never invent information about the user.
2. Never claim the user has a skill, project, certification, or achievement unless it exists in their PathForge data above.
3. Use the user's actual target career (${userContext?.profile?.targetCareer}) when providing advice.
4. Prioritize the user's identified skill gaps: ${userContext?.skillGaps?.join(", ") || "None (All core skills matched)"}.
5. Connect recommendations to their roadmap and available hours per week (${userContext?.learningPreferences?.hoursPerWeek}).
6. If required information is missing, state it clearly and suggest what to add.
7. Prefer structured responses using Markdown:
Goal
Current situation
What to do next
Resources
Practice
Expected outcome

Act like a mentor who knows the user's PathForge profile, not like a generic chatbot.`;
}

/**
 * 3. Primary AI Completion API Call (OpenRouter)
 */
export async function callAIProvider(messagesHistory, userContext) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || 
                 import.meta.env.VITE_AI_API_KEY || 
                 import.meta.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    // Graceful smart fallback when API key is not configured in .env
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
        max_tokens: 800,
      })
    });

    if (!response.ok) {
      console.warn("OpenRouter API returned non-200 status:", response.status);
      return generateSmartFallback(messagesHistory[messagesHistory.length - 1]?.content || "", userContext);
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content;
    if (replyText) return replyText;

    return generateSmartFallback(messagesHistory[messagesHistory.length - 1]?.content || "", userContext);
  } catch (err) {
    console.error("AI Mentor service call failed:", err);
    return generateSmartFallback(messagesHistory[messagesHistory.length - 1]?.content || "", userContext);
  }
}

/**
 * 4. Deterministic Smart Fallback Generator (Ensures mentor is 100% data-driven even without API key)
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

  // Handle Quick Action: "Explain this"
  if (query.includes("explain this") || query.includes("explain")) {
    if (topGap) {
      return `### Topic Explanation: ${topGap}\n\n` +
        `**Goal:** Master ${topGap} for your target role as a **${career}**.\n\n` +
        `**Current Situation:** You have strong fundamentals in ${strengths || "core programming"}, but ${topGap} is currently your highest-priority skill gap.\n\n` +
        `**What to do next:**\n` +
        `• Understand core syntax and architecture patterns for ${topGap}.\n` +
        `• Build a mini-exercise applying ${topGap} with ${ctx.strengths[0] || "your existing skills"}.\n\n` +
        `**Recommended Resource:**\n` +
        `[Open Resource](https://www.google.com/search?q=Learn+${encodeURIComponent(topGap)}+official+tutorial)\n\n` +
        `**Expected Outcome:** Closes 1 of your ${ctx.skillGaps.length} missing skill gaps and increases your career readiness above ${ctx.careerReadiness}%.`;
    }
    return `### PathForge Skill Overview\n\n` +
      `You have already matched all core requirements for **${career}**!\n\n` +
      `What specific concept or project would you like me to explain next?`;
  }

  // Handle Quick Action: "Create study plan"
  if (query.includes("create study plan") || query.includes("study plan")) {
    const gaps = ctx.skillGaps.length > 0 ? ctx.skillGaps : ["System Design", "Advanced Projects"];
    const g1 = gaps[0] || "Core Concepts";
    const g2 = gaps[1] || "Advanced Patterns";
    const g3 = gaps[2] || "Portfolio Integration";

    return `### 4-Week Personalized Study Plan for ${name}\n\n` +
      `**Target Role:** ${career}\n` +
      `**Time Commitment:** ${hours}/week (${style})\n\n` +
      `**Week 1 — ${g1} Fundamentals**\n` +
      `• Focus: Core concepts, syntax & setup.\n` +
      `• Practice: 3 hands-on coding exercises.\n\n` +
      `**Week 2 — Deep Dive into ${g1} & ${g2}**\n` +
      `• Focus: Integrating ${g1} into real projects.\n` +
      `• Practice: Build a lightweight mini-application.\n\n` +
      `**Week 3 — Mastering ${g2}**\n` +
      `• Focus: Advanced architecture, testing, and performance.\n` +
      `• Practice: Code review and refactoring.\n\n` +
      `**Week 4 — Portfolio Project (${g3})**\n` +
      `• Focus: Build & deploy a functional project combining ${g1} and ${g2}.\n` +
      `• Expected Outcome: Adds real project evidence to your profile and boosts readiness!`;
  }

  // Handle Quick Action: "Analyze my progress"
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
      `${topGap ? `Start learning **${topGap}** to close your top skill gap.` : "Take an initial assessment or add a new project to your profile."}`;
  }

  // Handle Quick Action: "Recommend resources"
  if (query.includes("recommend resources") || query.includes("resources")) {
    const targetGap = topGap || "Software Engineering";
    return `### Recommended Resources for ${career}\n\n` +
      `**Target Skill Gap:** ${targetGap}\n\n` +
      `**1. LEARN**\n` +
      `• Official ${targetGap} Documentation & Guide\n` +
      `  [Open Resource](https://www.google.com/search?q=${encodeURIComponent(targetGap)}+official+documentation)\n\n` +
      `**2. PRACTICE**\n` +
      `• ${targetGap} Interactive Exercises & Problems\n` +
      `  [Open Resource](https://www.google.com/search?q=${encodeURIComponent(targetGap)}+practice+problems+leetcode)\n\n` +
      `**3. BUILD**\n` +
      `• ${targetGap} Starter Project Tutorial\n` +
      `  [Open Resource](https://www.google.com/search?q=${encodeURIComponent(targetGap)}+project+tutorial+github)\n\n` +
      `**4. CERTIFY**\n` +
      `• Industry Recognized ${targetGap} Certification\n` +
      `  [Open Resource](https://www.google.com/search?q=${encodeURIComponent(targetGap)}+certification+coursera)`;
  }

  // Handle "What should I do today?"
  if (query.includes("what should i do today") || query.includes("do today")) {
    const focusSkill = topGap || "System Design";
    return `### TODAY'S FOCUS: ${focusSkill}\n\n` +
      `**Why:** ${focusSkill} is part of your target roadmap for **${career}** and is your highest-priority skill gap.\n\n` +
      `**Plan:**\n` +
      `• 30 min: Read core ${focusSkill} documentation.\n` +
      `• 45 min: Write a small code example implementing ${focusSkill}.\n` +
      `• 30 min: Review & push code to GitHub.\n\n` +
      `**Resource:**\n` +
      `[Open Resource](https://www.google.com/search?q=Learn+${encodeURIComponent(focusSkill)}+step+by+step)`;
  }

  // Handle "Give me a project"
  if (query.includes("give me a project") || query.includes("project")) {
    const gap = topGap || "Backend API";
    return `### Project Recommendation: ${career} Showcase\n\n` +
      `**Title:** ${gap} & ${ctx.strengths[0] || "Core Skills"} Integration App\n` +
      `**Problem Statement:** Build a functional application that uses your existing skills in ${strengths || "programming"} and incorporates ${gap}.\n` +
      `**Required Technologies:** ${strengths || "JavaScript"}, ${gap}\n` +
      `**Features:**\n` +
      `• Authentication & User Data Storage\n` +
      `• Dynamic Dashboard UI\n` +
      `• Deployed to public URL\n\n` +
      `**Difficulty:** Intermediate\n` +
      `**Estimated Time:** 8–12 hours\n` +
      `**Skills Developed:** ${gap}, System Architecture, Portfolio Deployment`;
  }

  // Default Normal Chat Response
  return `Hi ${name}! As your PathForge AI Mentor for **${career}**, I'm keeping track of your progress.\n\n` +
    `You currently have **${ctx.skills.length} skills** and **${ctx.skillGaps.length} skill gaps** remaining.\n\n` +
    `${topGap ? `Your highest priority focus is **${topGap}**.` : "You have matched all core skills for your role!"}\n\n` +
    `How can I help you today? You can ask me for a study plan, topic explanation, project idea, or progress analysis.`;
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
