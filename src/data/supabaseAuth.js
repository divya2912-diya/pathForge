// ============================================================
//  PathForge — Supabase Auth & Profile Store
//  Replaces the old localStorage-based authStore.js
// ============================================================
import { supabase } from "../lib/supabaseClient";

// ── Auth: Register ───────────────────────────────────────────

/**
 * Register a new user with Supabase Auth + create a profile row.
 * @returns { success, error?, user? }
 */
export async function registerUser({ name, email, password, degree, year, targetCareer }) {
  // 1. Create the Supabase Auth account
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  const userId = authData.user?.id;
  if (!userId) {
    return { success: false, error: "Registration failed. Please try again." };
  }

  // 2. Insert a row in the profiles table
  const username =
    name.trim().toLowerCase().replace(/\s+/g, "") +
    Math.floor(Math.random() * 999);

  const profileData = {
    id: userId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    username,
    degree: degree || "B.Tech Computer Science",
    year: year || "1st Year",
    target_career: targetCareer || "Software Engineer",
    avatar_color: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
    skills: [],
    interests: [],
    projects: "",
    pace: "Balanced",
    onboarding_complete: false,
    career_readiness: null,
    last_login: new Date().toISOString(),
  };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert(profileData)
    .select()
    .single();

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  return { success: true, user: toFrontendUser(profile) };
}

// ── Auth: Sign In ────────────────────────────────────────────

/**
 * Sign in an existing user.
 * @returns { success, error?, user? }
 */
export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    // Make the error message user-friendly
    if (error.message.includes("Invalid login credentials")) {
      return { success: false, error: "Incorrect email or password. Please try again." };
    }
    return { success: false, error: error.message };
  }

  // Update last_login timestamp
  await supabase
    .from("profiles")
    .update({ last_login: new Date().toISOString() })
    .eq("id", data.user.id);

  // Fetch the profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    return { success: false, error: "Could not load your profile." };
  }

  return { success: true, user: toFrontendUser(profile) };
}

// ── Auth: Sign Out ───────────────────────────────────────────

export async function logoutUser() {
  await supabase.auth.signOut();
}

// ── Auth: Get Current Session & Profile ─────────────────────

/**
 * Get the current user's profile from Supabase.
 * Returns null if not logged in.
 */
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) return null;
  return toFrontendUser(profile);
}

// ── Profile: Update ──────────────────────────────────────────

/**
 * Update the current user's profile fields.
 * Accepts camelCase keys — auto-converts to snake_case for DB.
 * @returns { success, user?, error? }
 */
export async function updateCurrentUser(updates) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return { success: false, error: "Not logged in." };

  const dbUpdates = toSnakeCase(updates);

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(dbUpdates)
    .eq("id", session.user.id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, user: toFrontendUser(profile) };
}

// ── Auth: Change Password ─────────────────────────────────────

/**
 * Change the current user's password using Supabase Auth.
 * Supabase handles verification — user must be logged in with a valid session.
 * @returns { success, error? }
 */
export async function changePassword({ newPassword }) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Milestone Progress ────────────────────────────────────────

/**
 * Load all milestone progress for the current user + career.
 * @returns { [milestoneId]: progress }
 */
export async function loadMilestoneProgress(career) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return {};

  const { data, error } = await supabase
    .from("milestone_progress")
    .select("milestone_id, progress")
    .eq("user_id", session.user.id)
    .eq("career", career);

  if (error || !data) return {};

  return Object.fromEntries(data.map((row) => [row.milestone_id, row.progress]));
}

/**
 * Save a milestone's progress for the current user.
 */
export async function saveMilestoneProgress(career, milestoneId, progress) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;

  await supabase.from("milestone_progress").upsert(
    {
      user_id: session.user.id,
      career,
      milestone_id: milestoneId,
      progress,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,career,milestone_id" }
  );
}

// ── Helpers ──────────────────────────────────────────────────

// Convert DB snake_case → frontend camelCase
function toFrontendUser(profile) {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    username: profile.username,
    degree: profile.degree,
    year: profile.year,
    targetCareer: profile.target_career,
    bio: profile.bio || "",
    phone: profile.phone || "",
    location: profile.location || "",
    github: profile.github || "",
    linkedin: profile.linkedin || "",
    avatarColor: profile.avatar_color,
    skills: profile.skills || [],
    interests: profile.interests || [],
    projects: profile.projects || "",
    pace: profile.pace || "Balanced",
    onboardingComplete: profile.onboarding_complete,
    careerReadiness: profile.career_readiness,
    assessmentScore: profile.assessment_score,
    assessmentAnswers: profile.assessment_answers,
    createdAt: profile.created_at,
    lastLogin: profile.last_login,
  };
}

// Convert known camelCase frontend keys → snake_case for DB updates
function toSnakeCase(updates) {
  const map = {
    targetCareer: "target_career",
    avatarColor: "avatar_color",
    onboardingComplete: "onboarding_complete",
    careerReadiness: "career_readiness",
    assessmentScore: "assessment_score",
    assessmentAnswers: "assessment_answers",
    lastLogin: "last_login",
    createdAt: "created_at",
  };
  const result = {};
  for (const [key, val] of Object.entries(updates)) {
    result[map[key] || key] = val;
  }
  return result;
}
