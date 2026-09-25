// ============================================================
//  PathForge — Dynamic Career Switch & Recommendation Engine
//  Ensures ONE single source of truth for target career across
//  Dashboard, Roadmap, Certifications, Projects, Interview Prep, & AI Context.
// ============================================================

import { SKILL_REQUIREMENTS, CAREER_ROADMAPS } from "../data/userProfile";
import { updateCurrentUser } from "../data/supabaseAuth";
import { buildUserLearningContext } from "./userContextService";

/**
 * Handle dynamic career goal change across all application modules.
 *
 * @param {string} newTargetCareer
 * @param {Object} student - Current student profile
 * @param {Function} onUpdateStudent - State updater callback
 * @returns {Promise<Object>} Updated student object
 */
export async function handleCareerChange(newTargetCareer, student, onUpdateStudent) {
  if (!newTargetCareer || !student) return student;

  // 1. Get new required skills
  const requiredSkills = SKILL_REQUIREMENTS[newTargetCareer] || [
    "JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs"
  ];

  // 2. User existing skills
  const userSkills = Array.isArray(student.skills) ? student.skills : [];
  const userSkillsList = Array.isArray(student.userSkillsList) 
    ? student.userSkillsList.map(s => (typeof s === "string" ? s : s?.name || ""))
    : [];
  
  const allUserSkillsSet = new Set([...userSkills, ...userSkillsList].map(s => String(s).toLowerCase().trim()));

  const matchedSkills = requiredSkills.filter(req => 
    Array.from(allUserSkillsSet).some(u => u.includes(req.toLowerCase()) || req.toLowerCase().includes(u))
  );

  const missingSkills = requiredSkills.filter(req => 
    !Array.from(allUserSkillsSet).some(u => u.includes(req.toLowerCase()) || req.toLowerCase().includes(u))
  );

  // 3. Recalculate dynamic career readiness score
  const newReadinessScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  // 4. Regenerate / retrieve career roadmap
  const newRoadmap = CAREER_ROADMAPS[newTargetCareer] || requiredSkills.map((skillTitle, idx) => ({
    id: `node_${idx + 1}`,
    title: skillTitle,
    category: "Core Skill",
    status: idx === 0 ? "in-progress" : "upcoming",
    reason: `Essential requirement for ${newTargetCareer}`,
    duration: "2-3 weeks",
    topics: [`Fundamentals of ${skillTitle}`, `Practical ${skillTitle} Projects`]
  }));

  // 5. Construct updated profile fields
  const updates = {
    targetCareer: newTargetCareer,
    careerReadiness: newReadinessScore,
    roadmap: newRoadmap,
    skillGaps: missingSkills
  };

  // 6. Update local UI state optimistically
  const updatedStudent = {
    ...student,
    ...updates
  };

  onUpdateStudent?.(updates, `Target career updated to ${newTargetCareer}`);

  // 7. Persist to Supabase DB
  await updateCurrentUser({
    target_career: newTargetCareer,
    career_readiness: newReadinessScore
  });

  return updatedStudent;
}
