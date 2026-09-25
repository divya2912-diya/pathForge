// ============================================================
//  PathForge — AI Mentor Chat Service (OpenRouter)
//  Connects directly to OpenRouter API with full student context.
//  No mock/offline generic fallback responses.
// ============================================================

import { calculateDynamicReadiness, getStrengthsAndGaps } from "../data/userProfile";

const OR_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Read the API key from the build-time env variable.
 */
function getApiKey() {
  return import.meta.env.VITE_OPENROUTER_API_KEY || "";
}

/**
 * Build a rich, personalized system prompt using the student's actual PathForge profile data.
 * Does NOT invent or hardcode fake data.
 */
function buildSystemPrompt(student) {
  if (!student) {
    return `You are PathForge AI Mentor, an expert career mentor and technical tutor.
Note: Student profile is currently loading or guest state. Provide helpful, structured answers to questions.`;
  }

  const name = student.name ? student.name.split(" ")[0] : "Student";
  const degree = student.degree || "Not specified";
  const year = student.year || "";
  const targetCareer = student.targetCareer || "Career goal not set";

  // Normalize current skills
  const plainSkills = student.skills || [];
  const structSkills = student.userSkillsList || [];
  const allSkillsList = [
    ...structSkills.map((s) => (typeof s === "string" ? s : s?.name || "")),
    ...plainSkills,
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  const currentSkillsStr =
    allSkillsList.length > 0 ? allSkillsList.join(", ") : "None specified in profile";

  // Calculate readiness & strengths/gaps
  let readinessStr = "Not calculated";
  let strengthsStr = "None specified";
  let gapsStr = "None specified";

  if (targetCareer && targetCareer !== "Career goal not set") {
    const score = calculateDynamicReadiness(student);
    if (score !== null && score !== undefined) {
      readinessStr = `${score}%`;
    }
    const { strengths, gaps } = getStrengthsAndGaps(allSkillsList, targetCareer);
    if (strengths.length > 0) strengthsStr = strengths.join(", ");
    if (gaps.length > 0) gapsStr = gaps.join(", ");
  }

  // Projects
  const projects = student.projectsList || [];
  const projectsStr =
    projects.length > 0
      ? projects
          .map((p) => (typeof p === "string" ? p : p.title || p.name))
          .filter(Boolean)
          .join("; ")
      : "None added yet";

  // Certifications
  const certs = student.certificationsList || [];
  const certsStr =
    certs.length > 0
      ? certs
          .map((c) => (typeof c === "string" ? c : c.name || c.title))
          .filter(Boolean)
          .join("; ")
      : "None added yet";

  const paceStr =
    student.pace || (student.learningPreferences?.hoursPerWeek
      ? `${student.learningPreferences.hoursPerWeek} hrs/week`
      : "Balanced");

  const githubStr = student.github || "Not linked";

  return `You are PathForge AI Mentor, an expert personalized career guide and technical tutor embedded in the PathForge learning platform.

AUTHENTICATED STUDENT PROFILE:
• Name: ${name}
• Degree & Academic Year: ${degree} ${year ? `(${year})` : ""}
• Target Career Goal: ${targetCareer}
• Profile Readiness Score: ${readinessStr}
• Current Skills: ${currentSkillsStr}
• Verified Strengths (Matched to ${targetCareer}): ${strengthsStr}
• High-Priority Skill Gaps (Needed for ${targetCareer}): ${gapsStr}
• Portfolio Projects: ${projectsStr}
• Certifications: ${certsStr}
• Learning Pace / Weekly Hours: ${paceStr}
• GitHub Profile: ${githubStr}

OPERATIONAL INSTRUCTIONS & RULES:
1. ALWAYS prioritize and directly answer the student's CURRENT QUESTION.
2. NEVER return generic boilerplate responses like "I'm ready to help with anything..." or "What would you like to work on today?".
3. PROFILE & STATUS QUESTIONS ("what is my status?", "how am I doing?", "what are my strengths?"):
   - Inspect the student profile above.
   - Summarize their status: Target Role (${targetCareer}), Readiness Score (${readinessStr}), Strengths (${strengthsStr}), and Missing Skill Gaps (${gapsStr}).
   - Give clear, practical next steps tied to their profile.
4. CAREER & SKILL GAP QUESTIONS ("what skills am I missing?", "what should I learn next?"):
   - Reference their target career (${targetCareer}) and missing skills (${gapsStr}).
   - Provide a step-by-step roadmap for mastering those gaps.
5. TECHNICAL & CODING QUESTIONS ("explain Java inheritance", "how do React hooks work?"):
   - Explain the concept deeply and clearly.
   - Provide code examples in markdown code blocks (\`\`\`language ... \`\`\`).
6. STUDY PLAN QUESTIONS ("give me a study plan", "30-day roadmap"):
   - Provide a realistic, structured study schedule targeting their skill gaps (${gapsStr}) for ${targetCareer}.
7. PROJECT & INTERVIEW QUESTIONS ("suggest a project", "prepare me for an interview"):
   - Suggest projects that build their missing skills.
   - For interview prep, provide technical & behavioral interview questions tailored to ${targetCareer}.
8. DATA ACCURACY:
   - Use strictly the student profile data provided above.
   - NEVER invent fake skills, scores, or certifications not listed in their profile.
   - If a piece of profile data is not available, state that it is not specified in their profile rather than making it up.
9. RESPONSE FORMATTING:
   - Use Markdown: **bolding**, bullet points (•), numbered lists, and \`\`\`code blocks\`\`\`.
   - Be practical, concise, and structured.`;
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
    console.error("OpenRouter API Key is missing from .env (VITE_OPENROUTER_API_KEY).");
    return "Sorry, I couldn't reach the AI Mentor right now. Please check your API key configuration in `.env`.";
  }

  const systemPrompt = buildSystemPrompt(student);

  // Take recent messages (up to 15) to maintain history
  const recentMessages = messages.slice(-15);

  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...recentMessages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text || "",
    })),
  ];

  // Candidates for free model routing
  const candidateModels = [
    "openrouter/auto",
    "openrouter/free",
    "qwen/qwen3.8-27b:free",
  ];

  let lastErrorMsg = null;

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
        const errData = await res.json().catch(() => ({}));
        const msg = errData?.error?.message || `HTTP ${res.status}`;
        lastErrorMsg = msg;
        console.error(`OpenRouter API model ${model} failed:`, res.status, msg);

        if (res.status === 401) {
          return "⚠️ **Invalid OpenRouter API Key.** Please verify your `VITE_OPENROUTER_API_KEY` in `.env`.";
        }
        continue;
      }

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;

      if (reply && reply.trim()) {
        return reply.trim();
      }
      console.warn(`OpenRouter model ${model} returned empty content.`);
    } catch (err) {
      console.error(`Network error calling OpenRouter model ${model}:`, err);
      lastErrorMsg = err.message;
    }
  }

  return "Sorry, I couldn't reach the AI Mentor right now. Please try again in a moment.";
}
