// ============================================================
//  PathForge — Centralized User Learning Context Builder
//  Single Source of Truth for Student Profile, Skills, Gaps, 
//  Analytics, Roadmap, Assessments, and AI Context.
// ============================================================

import { SKILL_REQUIREMENTS } from "../data/userProfile";

/**
 * Builds the unified, complete student context object from live student data.
 * Does NOT invent or hardcode mock data.
 *
 * @param {Object} student - Authenticated student profile
 * @returns {Object} Context object
 */
export function buildUserLearningContext(student) {
  if (!student) {
    return {
      name: "Guest",
      degree: "",
      year: "",
      targetCareer: "Not specified",
      preferredLanguage: "en",
      skills: [],
      masteredSkills: [],
      requiredSkills: [],
      skillGaps: [],
      careerReadinessScore: 0,
      roadmapProgress: { total: 0, completed: 0, percent: 0, currentNode: null },
      assessmentSummary: { totalCount: 0, avgScore: 0, strengths: [], weakTopics: [] },
      projects: [],
      certifications: [],
      learningActivity: { totalSessions: 0, activeDays: 0, currentStreak: 0, totalHours: 0 },
      learningPreferences: { primaryStyle: "PRACTICE", visual: 25, reading: 25, practice: 25, auditory: 25 },
      hasData: false
    };
  }

  const name = student.name || "Student";
  const degree = student.degree || "Degree not specified";
  const year = student.year || "";
  const targetCareer = student.targetCareer || "";
  const preferredLanguage = student.preferredLanguage || "en";

  // 1. Skill Extraction & Normalization
  const userSkills = Array.isArray(student.skills) ? student.skills : [];
  const userSkillsList = Array.isArray(student.userSkillsList) 
    ? student.userSkillsList.map(s => (typeof s === "string" ? s : s?.name || ""))
    : [];
  
  const allMasteredSet = new Set(
    [...userSkills, ...userSkillsList]
      .filter(Boolean)
      .map(s => String(s).trim())
  );

  const masteredSkills = Array.from(allMasteredSet);

  // 2. Target Career Requirements & Gaps
  let requiredSkills = [];
  if (targetCareer && SKILL_REQUIREMENTS[targetCareer]) {
    requiredSkills = SKILL_REQUIREMENTS[targetCareer];
  } else if (targetCareer) {
    const careerLower = targetCareer.toLowerCase();
    if (careerLower.includes("react") || careerLower.includes("frontend")) {
      requiredSkills = ["JavaScript", "React", "HTML/CSS", "Git", "TypeScript", "REST APIs"];
    } else if (careerLower.includes("node") || careerLower.includes("backend") || careerLower.includes("python")) {
      requiredSkills = ["Python", "Node.js", "SQL", "REST APIs", "Git", "System Design", "Docker"];
    } else if (careerLower.includes("ai") || careerLower.includes("ml") || careerLower.includes("data")) {
      requiredSkills = ["Python", "Machine Learning", "Statistics", "SQL", "Deep Learning", "Docker"];
    } else {
      requiredSkills = ["JavaScript", "React", "Node.js", "SQL", "Git", "HTML/CSS"];
    }
  }

  const masteredLowerSet = new Set(masteredSkills.map(s => s.toLowerCase().trim()));
  
  const matchedRequiredSkills = requiredSkills.filter(req => 
    Array.from(masteredLowerSet).some(m => m.includes(req.toLowerCase()) || req.toLowerCase().includes(m))
  );

  const skillGaps = requiredSkills.filter(req => 
    !Array.from(masteredLowerSet).some(m => m.includes(req.toLowerCase()) || req.toLowerCase().includes(m))
  );

  // 3. Dynamic Career Readiness Calculation
  const careerReadinessScore = requiredSkills.length > 0
    ? Math.round((matchedRequiredSkills.length / requiredSkills.length) * 100)
    : (typeof student.readinessScore === "number" ? student.readinessScore : 0);

  // 4. Roadmap Progress
  const milestoneProgress = student.milestoneProgress || {};
  const completedMilestoneCount = Object.values(milestoneProgress).filter(v => v === 1).length;
  const totalRoadmapNodes = requiredSkills.length > 0 ? requiredSkills.length : 6;
  const roadmapPercent = Math.min(100, Math.round((completedMilestoneCount / totalRoadmapNodes) * 100));
  const currentNode = skillGaps.length > 0 ? skillGaps[0] : null;

  // 5. Assessment Performance
  const assessments = Array.isArray(student.assessments) ? student.assessments : [];
  let totalScoreSum = 0;
  const strengthsList = [];
  const weakTopicsList = [];

  assessments.forEach(a => {
    const score = typeof a.score === "number" ? a.score : 0;
    totalScoreSum += score;
    if (score >= 75) {
      if (a.topic) strengthsList.push(a.topic);
    } else {
      if (a.topic) weakTopicsList.push(a.topic);
    }
  });

  const avgAssessmentScore = assessments.length > 0 ? Math.round(totalScoreSum / assessments.length) : 0;

  // 6. Learning Activity & Study Consistency
  const activityRecords = Array.isArray(student.learningActivity) ? student.learningActivity : [];
  const totalSessions = activityRecords.length;
  let totalDurationSeconds = 0;
  const activeDaysSet = new Set();

  activityRecords.forEach(r => {
    if (r.duration_seconds || r.duration) {
      totalDurationSeconds += Number(r.duration_seconds || r.duration);
    }
    if (r.started_at || r.timestamp) {
      const dateStr = new Date(r.started_at || r.timestamp).toISOString().split("T")[0];
      activeDaysSet.add(dateStr);
    }
  });

  // 7. Learning Style Preferences
  const prefs = student.learningPreferences || {};
  const visual = prefs.visual_score ?? 25;
  const reading = prefs.reading_score ?? 25;
  const practice = prefs.practice_score ?? 25;
  const auditory = prefs.auditory_score ?? 25;

  let primaryStyle = "PRACTICE";
  const maxScore = Math.max(visual, reading, practice, auditory);
  if (maxScore === visual) primaryStyle = "VISUAL";
  else if (maxScore === reading) primaryStyle = "READING";
  else if (maxScore === auditory) primaryStyle = "AUDITORY";

  return {
    name,
    degree,
    year,
    targetCareer,
    preferredLanguage,
    skills: masteredSkills,
    masteredSkills,
    requiredSkills,
    matchedRequiredSkills,
    skillGaps,
    careerReadinessScore,
    roadmapProgress: {
      total: totalRoadmapNodes,
      completed: completedMilestoneCount,
      percent: roadmapPercent,
      currentNode
    },
    assessmentSummary: {
      totalCount: assessments.length,
      avgScore: avgAssessmentScore,
      strengths: Array.from(new Set(strengthsList)),
      weakTopics: Array.from(new Set(weakTopicsList))
    },
    projects: student.projectsList || [],
    certifications: student.certificationsList || [],
    learningActivity: {
      totalSessions,
      activeDays: activeDaysSet.size,
      currentStreak: computeStreak(activeDaysSet),
      totalHours: (totalDurationSeconds / 3600).toFixed(1)
    },
    learningPreferences: {
      primaryStyle,
      visual,
      reading,
      practice,
      auditory
    },
    hasData: masteredSkills.length > 0 || assessments.length > 0 || totalSessions > 0
  };
}

function computeStreak(activeDaysSet) {
  if (activeDaysSet.size === 0) return 0;
  const sortedDates = Array.from(activeDaysSet).sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (!activeDaysSet.has(today) && !activeDaysSet.has(yesterday)) {
    return 0;
  }

  let streak = 0;
  let curr = new Date(activeDaysSet.has(today) ? today : yesterday);

  while (true) {
    const dStr = curr.toISOString().split("T")[0];
    if (activeDaysSet.has(dStr)) {
      streak++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
