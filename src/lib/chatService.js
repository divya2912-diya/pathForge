// ============================================================
//  PathForge — AI Academic & Career Intelligence Assistant
//  Uses OpenRouter API + Centralized Student Context.
// ============================================================

import { buildUserLearningContext } from "../services/userContextService";

const OR_URL = "https://openrouter.ai/api/v1/chat/completions";

function getApiKey() {
  const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (envKey && envKey.trim()) return envKey.trim();
  try {
    return atob("c2stb3ItdjEtZTMyMzMwZTI5NWY1ZmZiMTdkMDQxYTY4NjdkN2E3ODVjYzIwNWVhYzRhOWIyNDY0Nzg3ZTYwYzMzMTc4ZDJkMA==");
  } catch {
    return "";
  }
}

/**
 * Build rich system prompt incorporating centralized user context & preferred language.
 */
function buildSystemPrompt(student) {
  const ctx = buildUserLearningContext(student);
  const lang = ctx.preferredLanguage || "en";

  let languageInstruction = "Respond in English.";
  if (lang === "te") {
    languageInstruction = "Respond entirely in TELUGU (తెలుగు), keeping technical terms and code examples in English for clarity.";
  } else if (lang === "hi") {
    languageInstruction = "Respond entirely in HINDI (हिन्दी), keeping technical terms and code examples in English for clarity.";
  }

  const skillsStr = ctx.masteredSkills.length > 0 ? ctx.masteredSkills.join(", ") : "No assessed skills recorded yet";
  const gapsStr = ctx.skillGaps.length > 0 ? ctx.skillGaps.join(", ") : "No skill gaps detected";
  const strengthsStr = ctx.assessmentSummary.strengths.length > 0 ? ctx.assessmentSummary.strengths.join(", ") : "No strengths assessed yet";
  const weakTopicsStr = ctx.assessmentSummary.weakTopics.length > 0 ? ctx.assessmentSummary.weakTopics.join(", ") : "No weak topics identified yet";
  const projectsStr = ctx.projects.length > 0 ? ctx.projects.map(p => typeof p === "string" ? p : p.title || p.name).join(", ") : "No projects added yet";
  const certsStr = ctx.certifications.length > 0 ? ctx.certifications.map(c => typeof c === "string" ? c : c.name || c.title).join(", ") : "No certifications added yet";

  return `You are PathForge Academic & Career Intelligence Assistant, an expert personalized mentor and tutor embedded in the PathForge platform.

AUTHENTICATED STUDENT CONTEXT (SINGLE SOURCE OF TRUTH):
• Name: ${ctx.name}
• Degree & Year: ${ctx.degree} ${ctx.year ? `(${ctx.year})` : ""}
• Target Career Goal: ${ctx.targetCareer}
• Dynamic Career Readiness Score: ${ctx.careerReadinessScore}%
• Mastered Skills: ${skillsStr}
• High-Priority Skill Gaps (Needed for ${ctx.targetCareer}): ${gapsStr}
• Assessment Performance: ${ctx.assessmentSummary.totalCount} assessments taken, Avg Score: ${ctx.assessmentSummary.avgScore}%
• Verified Strengths: ${strengthsStr}
• Weak Academic Topics: ${weakTopicsStr}
• Roadmap Progress: Node ${ctx.roadmapProgress.completed} of ${ctx.roadmapProgress.total} completed (${ctx.roadmapProgress.percent}%), Current Node: ${ctx.roadmapProgress.currentNode || "All completed"}
• Portfolio Projects: ${projectsStr}
• Certifications: ${certsStr}
• Study Consistency: ${ctx.learningActivity.totalSessions} sessions recorded, ${ctx.learningActivity.activeDays} active days, ${ctx.learningActivity.currentStreak}-day streak
• Primary Learning Preference Style: ${ctx.learningPreferences.primaryStyle} (Visual: ${ctx.learningPreferences.visual}%, Reading: ${ctx.learningPreferences.reading}%, Practice: ${ctx.learningPreferences.practice}%, Auditory: ${ctx.learningPreferences.auditory}%)

LANGUAGE INSTRUCTION:
${languageInstruction}

CRITICAL OPERATIONAL RULES & REASONING:
1. ANSWER WITH SPECIFIC REASONING:
   - When recommending a skill, certification, project, or study topic, ALWAYS explain WHY based on the student's actual gaps (${gapsStr}) and target career (${ctx.targetCareer}).
   - Example: "SQL is recommended because your selected career (${ctx.targetCareer}) requires database knowledge and your current skills show a gap in SQL."
2. INSUFFICIENT DATA SAFETY:
   - If the student asks about assessment performance or gaps and has no assessment data (${ctx.assessmentSummary.totalCount} === 0), state: "I don't have enough assessment data yet to identify your weak topics. Complete your first assessment to generate detailed gap analysis."
3. STRICT DATA INTEGRITY:
   - Do NOT invent fake scores, fake skills, or fake certifications not present in the profile.
   - Do NOT send unrelated users' information.
4. STRUCTURED FORMATTING:
   - Use standard Markdown: bolding, bullet points, and code blocks (\`\`\`language ... \`\`\`).`;
}

/**
 * Send chat messages to OpenRouter API.
 *
 * @param {Array<{from: "user"|"ai", text: string}>} messages
 * @param {Object} student - Authenticated student profile
 * @returns {Promise<string>}
 */
export async function sendMessage(messages, student) {
  const apiKey = getApiKey();

  if (!apiKey || apiKey.trim() === "") {
    console.error("OpenRouter API Key is missing.");
    return "Sorry, I couldn't reach the AI Mentor right now. Please check your API key configuration.";
  }

  const systemPrompt = buildSystemPrompt(student);
  const recentMessages = messages.slice(-15);

  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...recentMessages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text || "",
    })),
  ];

  const candidateModels = [
    "openrouter/auto",
    "openrouter/free",
    "qwen/qwen3.8-27b:free",
  ];

  for (const model of candidateModels) {
    const payload = {
      model,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 1500,
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
        if (res.status === 401) {
          return "⚠️ **Invalid OpenRouter API Key.** Please verify your API key.";
        }
        continue;
      }

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;

      if (reply && reply.trim()) {
        return reply.trim();
      }
    } catch (err) {
      console.error(`Error calling OpenRouter model ${model}:`, err);
    }
  }

  return "Sorry, I couldn't reach the AI Mentor right now. Please try again in a moment.";
}
