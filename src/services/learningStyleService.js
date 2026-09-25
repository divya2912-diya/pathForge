// ============================================================
//  PathForge — Adaptive Learning Style Service
//  Dynamically infers learning preferences from actual user interactions
//  without hardcoding fake scores.
// ============================================================

import { updateCurrentUser } from "../data/supabaseAuth";

/**
 * Record a resource interaction and update adaptive learning preference scores.
 *
 * @param {string} resourceType - 'video' | 'article' | 'quiz' | 'practice' | 'audio'
 * @param {Object} student - Current student profile
 * @param {Function} onUpdateStudent - Callback to persist profile update
 */
export async function recordStyleInteraction(resourceType, student, onUpdateStudent) {
  if (!student) return;

  const prefs = student.learningPreferences || {
    visual_score: 25,
    reading_score: 25,
    practice_score: 25,
    auditory_score: 25,
    total_interactions: 0
  };

  let visual = prefs.visual_score ?? 25;
  let reading = prefs.reading_score ?? 25;
  let practice = prefs.practice_score ?? 25;
  let auditory = prefs.auditory_score ?? 25;
  let totalInteractions = (prefs.total_interactions ?? 0) + 1;

  const lowerType = String(resourceType).toLowerCase();

  if (lowerType.includes("video") || lowerType.includes("diagram") || lowerType.includes("visual")) {
    visual += 10;
  } else if (lowerType.includes("article") || lowerType.includes("doc") || lowerType.includes("book") || lowerType.includes("text")) {
    reading += 10;
  } else if (lowerType.includes("quiz") || lowerType.includes("code") || lowerType.includes("practice") || lowerType.includes("exercise") || lowerType.includes("project")) {
    practice += 15;
  } else if (lowerType.includes("audio") || lowerType.includes("lecture") || lowerType.includes("podcast")) {
    auditory += 10;
  }

  // Normalize scores to sum up to 100%
  const totalSum = visual + reading + practice + auditory;
  const normVisual = Math.round((visual / totalSum) * 100);
  const normReading = Math.round((reading / totalSum) * 100);
  const normPractice = Math.round((practice / totalSum) * 100);
  const normAuditory = 100 - (normVisual + normReading + normPractice);

  const updatedPreferences = {
    visual_score: normVisual,
    reading_score: normReading,
    practice_score: normPractice,
    auditory_score: normAuditory,
    total_interactions: totalInteractions
  };

  const updatedStudent = {
    ...student,
    learningPreferences: updatedPreferences
  };

  onUpdateStudent?.({ learningPreferences: updatedPreferences });
  await updateCurrentUser({ learningPreferences: updatedPreferences });
}

/**
 * Returns tailored resource recommendations based on primary learning style.
 */
export function filterResourcesByStyle(resources, primaryStyle) {
  if (!Array.isArray(resources)) return [];
  if (!primaryStyle) return resources;

  const styleLower = primaryStyle.toLowerCase();

  return [...resources].sort((a, b) => {
    const aType = (a.type || a.category || "").toLowerCase();
    const bType = (b.type || b.category || "").toLowerCase();

    const aMatch = (
      (styleLower === "visual" && (aType.includes("video") || aType.includes("diagram"))) ||
      (styleLower === "reading" && (aType.includes("article") || aType.includes("doc"))) ||
      (styleLower === "practice" && (aType.includes("quiz") || aType.includes("exercise") || aType.includes("code"))) ||
      (styleLower === "auditory" && (aType.includes("audio") || aType.includes("lecture")))
    );

    const bMatch = (
      (styleLower === "visual" && (bType.includes("video") || bType.includes("diagram"))) ||
      (styleLower === "reading" && (bType.includes("article") || bType.includes("doc"))) ||
      (styleLower === "practice" && (bType.includes("quiz") || bType.includes("exercise") || bType.includes("code"))) ||
      (styleLower === "auditory" && (bType.includes("audio") || bType.includes("lecture")))
    );

    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });
}
