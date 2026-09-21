import { SKILL_REQUIREMENTS } from "./userProfile";

/**
 * Calculates a personalized recommendation score and justification for a project.
 * 
 * @param {Object} project - The project record from the catalog
 * @param {Object} profile - The user's profile containing targetCareer and skills
 * @returns {Object} - Augmented project object with match metrics
 */
export function calculateProjectRecommendation(project, profile) {
  const targetCareer = profile?.targetCareer || "Software Engineer";
  const userSkills = (profile?.skills || []).map(s => s.toLowerCase());
  const requiredSkills = (SKILL_REQUIREMENTS[targetCareer] || []).map(s => s.toLowerCase());
  
  const missingSkills = requiredSkills.filter(req => 
    !userSkills.some(us => req.includes(us) || us.includes(req))
  );

  const projSkills = (project.skills || []).map(s => s.toLowerCase());
  const projTags = (project.career_tags || []).map(t => t.toLowerCase());
  
  // 1. Domain/Career Relevance
  // Is this project tagged for their target career?
  const isTargetCareer = projTags.some(t => t.includes(targetCareer.toLowerCase()) || targetCareer.toLowerCase().includes(t));
  
  // 2. Gap Coverage
  const gapCoverage = projSkills.filter(cs => 
    missingSkills.some(ms => ms.includes(cs) || cs.includes(ms))
  );

  // 3. Score Calculation (0-100)
  let score = 0;
  
  if (isTargetCareer) {
    score += 50; // Huge boost for domain relevance
  } else {
    // If not directly tagged, calculate based on general skill overlap with career requirements
    const careerRelevance = projSkills.filter(cs => 
      requiredSkills.some(rs => rs.includes(cs) || cs.includes(rs))
    );
    if (projSkills.length > 0) {
      score += (careerRelevance.length / projSkills.length) * 40;
    }
  }
  
  // Bonus score from actively closing gaps (up to 50 points)
  if (missingSkills.length > 0) {
    score += Math.min((gapCoverage.length / Math.max(1, missingSkills.length)) * 100, 50);
  } else if (isTargetCareer) {
    score += 40; // High score if in target domain even without gaps
  }
  
  // Normalize score
  score = Math.min(99, Math.max(10, Math.round(score)));

  // Generate "Why this is recommended"
  let reason = "";
  if (gapCoverage.length > 0) {
    const skillList = gapCoverage.slice(0, 3).map(s => s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")).join(", ");
    reason = `Recommended because building this applies missing skills for your target role: ${skillList}.`;
  } else if (isTargetCareer) {
    reason = `Aligns perfectly with portfolio expectations for ${targetCareer} roles.`;
  } else {
    reason = `Builds strong technical foundations suitable for your career trajectory.`;
  }

  return {
    ...project,
    match: score, // using 'match' to map to UI expectations
    gapCoverageCount: gapCoverage.length,
    reason,
    isTargetDomain: isTargetCareer
  };
}

/**
 * Ranks and filters a list of projects based on user profile.
 */
export function rankProjects(projects, profile) {
  if (!projects || projects.length === 0) return [];
  
  const evaluated = projects.map(proj => calculateProjectRecommendation(proj, profile));
  
  // Filter out irrelevant projects (score < 30)
  let filtered = evaluated.filter(p => p.match >= 30);
  if (filtered.length === 0) filtered = evaluated; // Fallback
  
  // Sort by match score descending
  return filtered.sort((a, b) => b.match - a.match);
}
