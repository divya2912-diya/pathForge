import { SKILL_REQUIREMENTS } from "./userProfile";

/**
 * Calculates a personalized recommendation score and justification for a certification.
 * 
 * @param {Object} cert - The certification record from the catalog
 * @param {Object} profile - The user's profile containing targetCareer and skills
 * @returns {Object} - Augmented certification object with match metrics
 */
export function calculateRecommendation(cert, profile) {
  const targetCareer = profile?.targetCareer || "Software Engineer";
  const userSkills = (profile?.skills || []).map(s => s.toLowerCase());
  
  const requiredSkills = (SKILL_REQUIREMENTS[targetCareer] || []).map(s => s.toLowerCase());
  
  // Calculate missing skills (Gaps)
  const missingSkills = requiredSkills.filter(req => 
    !userSkills.some(us => req.includes(us) || us.includes(req))
  );

  const certSkills = (cert.skills || []).map(s => s.toLowerCase());
  
  // 1. Gap Coverage: How many of the user's missing skills does this cert cover?
  const gapCoverage = certSkills.filter(cs => 
    missingSkills.some(ms => ms.includes(cs) || cs.includes(ms))
  );
  
  // 2. Career Relevance: How many skills in this cert are relevant to the target career overall?
  const careerRelevance = certSkills.filter(cs => 
    requiredSkills.some(rs => rs.includes(cs) || cs.includes(rs))
  );

  // 3. Score Calculation (0-100)
  // Base score from general career relevance (up to 40 points)
  let score = 0;
  if (certSkills.length > 0) {
    score += (careerRelevance.length / certSkills.length) * 40;
  }
  
  // Bonus score from actively closing gaps (up to 60 points)
  if (missingSkills.length > 0) {
    score += Math.min((gapCoverage.length / Math.max(1, missingSkills.length)) * 100, 60);
  } else if (careerRelevance.length > 0) {
    // If no gaps, but highly relevant to career, boost score.
    score += 40;
  }
  
  // Normalize score
  score = Math.min(99, Math.max(10, Math.round(score)));

  // Generate "Why this is recommended" dynamically
  let reason = "";
  if (gapCoverage.length > 0) {
    const skillList = gapCoverage.slice(0, 3).map(s => s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")).join(", ");
    reason = `Recommended because it addresses missing skills for your target role: ${skillList}.`;
  } else if (careerRelevance.length > 0) {
    reason = `Aligns strongly with core requirements for ${targetCareer} roles.`;
  } else {
    reason = `Builds general technical proficiency suitable for your career trajectory.`;
  }

  // Format skills for display
  const displaySkills = (cert.skills || []).map(s => ({
    name: s,
    isGap: missingSkills.some(ms => ms.includes(s.toLowerCase()) || s.toLowerCase().includes(ms))
  }));

  return {
    ...cert,
    matchScore: score,
    gapCoverageCount: gapCoverage.length,
    reason,
    displaySkills
  };
}

/**
 * Ranks and filters a list of certifications based on user profile.
 */
export function rankCertifications(certifications, profile) {
  if (!certifications || certifications.length === 0) return [];
  
  const evaluated = certifications.map(cert => calculateRecommendation(cert, profile));
  
  // Filter out completely irrelevant certs (score < 20) unless catalog is tiny
  let filtered = evaluated.filter(c => c.matchScore >= 20);
  if (filtered.length === 0) filtered = evaluated; // Fallback
  
  // Sort by match score descending
  return filtered.sort((a, b) => b.matchScore - a.matchScore);
}
