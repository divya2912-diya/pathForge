// ============================================================
//  PathForge — End-to-End Roadmap Addition Service
//  Handles real database persistence (Supabase + localStorage fallback),
//  duplicate prevention, destination mapping, and roadmap syncing.
// ============================================================

import { saveMilestoneProgress, updateCurrentUser } from "../data/supabaseAuth";
import { SKILL_REQUIREMENTS } from "../data/userProfile";

/**
 * Determine exact destination info (Career Goal, Stage, Topic) for an added item
 */
export function getRoadmapLocationInfo(student, item, itemType = "resource") {
  const targetCareer = student?.targetCareer || "Software Engineer";
  const itemTitle = item?.title || item?.name || "Learning Item";
  const domain = item?.domain || item?.category || item?.skills?.[0] || "General";

  // Match stage based on difficulty or item type
  let stage = "Foundation";
  if (itemType === "project") {
    stage = "Projects & Portfolio";
  } else if (itemType === "certification") {
    stage = "Certifications";
  } else if (item?.difficulty === "Advanced") {
    stage = "Specialization";
  } else if (item?.difficulty === "Intermediate") {
    stage = "Foundation & Practice";
  }

  // Find matching skill in career requirements
  const careerSkills = SKILL_REQUIREMENTS[targetCareer] || ["Python", "JavaScript", "SQL", "Git"];
  const matchedSkill = careerSkills.find(s => 
    itemTitle.toLowerCase().includes(s.toLowerCase()) || 
    domain.toLowerCase().includes(s.toLowerCase())
  ) || domain;

  return {
    career: targetCareer,
    stage,
    topic: matchedSkill,
    itemTitle
  };
}

/**
 * Perform real end-to-end database addition to the user's roadmap
 */
export async function addToRoadmap({ student, item, itemType = "resource", onUpdateStudent }) {
  if (!student || !item) {
    return {
      success: false,
      alreadyAdded: false,
      message: "Unable to add this item to your roadmap. Please try again."
    };
  }

  const itemId = String(item.id || item.title || Date.now());
  const existingAdded = Array.isArray(student.addedRoadmapItems) ? student.addedRoadmapItems : [];

  // 1. Prevent Duplicates (check by ID or Title)
  const isAlreadyAdded = existingAdded.some(
    existing => String(existing.id) === itemId || existing.title?.toLowerCase() === item.title?.toLowerCase()
  );

  const locationInfo = getRoadmapLocationInfo(student, item, itemType);

  if (isAlreadyAdded) {
    return {
      success: false,
      alreadyAdded: true,
      message: "Already added to your roadmap.",
      item,
      locationInfo
    };
  }

  try {
    // 2. Prepare new item record
    const newItemRecord = {
      id: itemId,
      title: item.title || item.name || "Custom Item",
      itemType, // 'resource' | 'project' | 'certification'
      domain: item.domain || item.skills?.[0] || "General",
      difficulty: item.difficulty || "Intermediate",
      addedAt: new Date().toISOString(),
      locationInfo
    };

    const updatedAdded = [newItemRecord, ...existingAdded];

    // 3. Save to Supabase Milestone Progress
    const milestoneKey = `custom_${itemType}_${itemId.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const targetCareer = student.targetCareer || "Software Engineer";

    if (navigator.onLine) {
      await saveMilestoneProgress(targetCareer, milestoneKey, 1);
    }

    // 4. Save to User Profile in Supabase
    const profileUpdates = {
      addedRoadmapItems: updatedAdded
    };

    if (onUpdateStudent) {
      onUpdateStudent(profileUpdates);
    }

    await updateCurrentUser(profileUpdates);

    return {
      success: true,
      alreadyAdded: false,
      message: "✓ Added to your Learning Roadmap",
      item: newItemRecord,
      locationInfo
    };
  } catch (err) {
    console.error("Failed to add item to roadmap:", err);
    return {
      success: false,
      alreadyAdded: false,
      message: "Unable to add this item to your roadmap. Please try again."
    };
  }
}
