// ============================================================
//  PathForge — Skill Validation Service
//  Handles persistence of 2-round skill validation results,
//  updating Supabase dbProgress, unlocking roadmap milestones,
//  and generating learning recommendations on failure.
// ============================================================

import { saveMilestoneProgress, updateCurrentUser } from "../data/supabaseAuth";
import { enqueueOfflineAction } from "./offlineSyncService";

/**
 * Check if a given skill is currently validated for the student
 */
export function isSkillValidated(student, dbProgress = {}, skill) {
  if (!skill) return false;
  const key = `skill_${skill.replace(/\s+/g, "_").toLowerCase()}`;
  if (dbProgress[key] === 1 || dbProgress[`${key}_validated`] === 1) return true;

  const validatedSkills = student?.validatedSkills || [];
  if (Array.isArray(validatedSkills)) {
    return validatedSkills.some(
      v => typeof v === "string" 
        ? v.toLowerCase() === skill.toLowerCase()
        : v.skill?.toLowerCase() === skill.toLowerCase()
    );
  }
  return false;
}

/**
 * Save a completed skill validation attempt
 * 
 * @param {Object} params
 * @param {Object} params.student - Current logged in user object
 * @param {string} params.skill - Name of the skill being validated
 * @param {number} params.round1Score - Score in Round 1 (e.g. 4)
 * @param {number} params.round1Total - Total questions in Round 1 (e.g. 5)
 * @param {boolean} params.round2Passed - Whether Round 2 practical code passed
 * @param {number} params.round2Score - Numerical score for Round 2 (0-100)
 * @param {string} params.status - 'passed' | 'failed_r1' | 'failed_r2'
 * @param {Array} params.missedConcepts - Array of concept strings user missed
 * @param {Function} params.onUpdateStudent - Callback to update react state
 */
export async function saveSkillValidationAttempt({
  student,
  skill,
  round1Score,
  round1Total = 5,
  round2Passed = false,
  round2Score = 0,
  status,
  missedConcepts = [],
  onUpdateStudent
}) {
  const targetCareer = student?.targetCareer || "General";
  const skillKey = `skill_${skill.replace(/\s+/g, "_").toLowerCase()}`;
  const isPassed = status === "passed";
  const overallScorePercent = Math.round(
    ((round1Score / round1Total) * 50) + (round2Score * 0.5)
  );

  const attemptRecord = {
    id: `val_${Date.now()}`,
    skill,
    targetCareer,
    round1Score,
    round1Total,
    round1Percent: Math.round((round1Score / round1Total) * 100),
    round2Passed,
    round2Score,
    status, // 'passed' | 'failed_r1' | 'failed_r2'
    scorePercent: overallScorePercent,
    missedConcepts,
    completedAt: new Date().toISOString(),
  };

  // 1. Update validated skills array
  const existingValidated = student?.validatedSkills || [];
  let updatedValidated = [...existingValidated];

  if (isPassed) {
    const alreadyExists = updatedValidated.some(v => 
      (typeof v === "string" ? v.toLowerCase() : v.skill?.toLowerCase()) === skill.toLowerCase()
    );
    if (!alreadyExists) {
      updatedValidated.push({
        skill,
        validatedAt: attemptRecord.completedAt,
        scorePercent: overallScorePercent
      });
    }
  }

  // 2. Add to validation history
  const existingAttempts = Array.isArray(student?.validationAttempts) ? student.validationAttempts : [];
  const updatedAttempts = [attemptRecord, ...existingAttempts];

  // 3. Add to overall assessments array
  const existingAssessments = Array.isArray(student?.assessments) ? student.assessments : [];
  const assessmentEntry = {
    id: attemptRecord.id,
    title: `Skill Validation: ${skill}`,
    topic: skill,
    score: overallScorePercent,
    correctCount: round1Score + (round2Passed ? 1 : 0),
    totalQuestions: round1Total + 1,
    type: "skill_validation",
    status,
    timestamp: attemptRecord.completedAt,
    strengths: isPassed ? [skill] : [],
    weakTopics: missedConcepts
  };
  const updatedAssessments = [assessmentEntry, ...existingAssessments];

  // 4. Save to Supabase milestone progress if passed
  if (isPassed) {
    if (navigator.onLine) {
      await saveMilestoneProgress(targetCareer, skillKey, 1);
      await saveMilestoneProgress(targetCareer, `${skillKey}_validated`, 1);
    } else {
      await enqueueOfflineAction("validate_skill", { career: targetCareer, milestoneId: skillKey }, student?.id, skillKey);
    }
  }

  // 5. Update student in state & database
  const studentUpdates = {
    validatedSkills: updatedValidated,
    validationAttempts: updatedAttempts,
    assessments: updatedAssessments
  };

  if (onUpdateStudent) {
    onUpdateStudent(studentUpdates);
  }

  await updateCurrentUser(studentUpdates);

  return {
    attemptRecord,
    isPassed,
    overallScorePercent
  };
}

/**
 * Generate practice & learning recommendations when a user fails a validation attempt
 */
export function getValidationFailureRecommendations(skill, missedConcepts = [], status = "failed_r1") {
  return {
    skill,
    reason: status === "failed_r1" 
      ? "Round 1 (Conceptual) score fell below the required 60% threshold."
      : "Round 2 (Practical Challenge) implementation contained logic or test case errors.",
    suggestedTopics: missedConcepts.length > 0 ? missedConcepts : [`${skill} core syntax & fundamentals`, `${skill} standard library & error handling`],
    actionItems: [
      {
        title: `Review ${skill} Core Concepts`,
        type: "reading",
        desc: `Re-visit the foundational theory and syntax for ${skill} in the Learning Roadmap module.`
      },
      {
        title: `Solve 3 ${skill} Coding Exercises`,
        type: "practice",
        desc: `Work through interactive code problems to build muscle memory before retrying validation.`
      },
      {
        title: `Retry Validation`,
        type: "quiz",
        desc: `Attempt validation again whenever you feel ready. Questions will be dynamically re-shuffled.`
      }
    ]
  };
}
