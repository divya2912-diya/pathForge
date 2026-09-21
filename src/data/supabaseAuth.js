// ============================================================
//  PathForge — Supabase Auth & Profile Store
// ============================================================
import { supabase } from "../lib/supabaseClient";

// ── Friendly error messages ──────────────────────────────────
function friendlyError(msg = "") {
  if (msg.includes("Invalid login credentials"))
    return "Incorrect email or password. Please try again.";
  if (msg.includes("Email not confirmed"))
    return "Please check your email and confirm your account first.";
  if (msg.includes("User already registered") || msg.includes("already been registered"))
    return "An account with this email already exists. Try signing in instead.";
  if (msg.includes("Password should be"))
    return "Password must be at least 6 characters.";
  if (msg.includes("row-level security") || msg.includes("violates"))
    return "Something went wrong setting up your account. Please try again.";
  if (msg.includes("network") || msg.includes("fetch"))
    return "Network error — please check your internet connection.";
  return "Something went wrong. Please try again.";
}

// ── Auth: Register ───────────────────────────────────────────

/**
 * Register a new user.
 * Profile row is auto-created by a Supabase DB trigger (handle_new_user).
 * User metadata is passed via options.data so the trigger can read it.
 */
export async function registerUser({ name, email, password, degree, year, targetCareer }) {
  const username =
    name.trim().toLowerCase().replace(/\s+/g, "") +
    Math.floor(Math.random() * 999);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        name: name.trim(),
        username,
        degree: degree || "",
        year: year || "",
        target_career: targetCareer || "Software Engineer",
      },
    },
  });

  if (authError) {
    return { success: false, error: friendlyError(authError.message) };
  }

  const userId = authData.user?.id;
  if (!userId) {
    return { success: false, error: "Registration failed. Please try again." };
  }

  // Wait briefly for the DB trigger to create the profile row
  await new Promise((r) => setTimeout(r, 800));

  // Fetch the profile created by the trigger
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    // Profile creation failed (trigger may not be set up) — still succeed auth
    const fallback = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      username,
      degree: degree || "",
      year: year || "",
      targetCareer: targetCareer || "Software Engineer",
      skills: [], interests: [], projects: "",
      pace: "Balanced", onboardingComplete: false,
      careerReadiness: null, avatarColor: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
    };
    return { success: true, user: fallback };
  }

  return { success: true, user: toFrontendUser(profile) };
}

// ── Auth: Sign In ────────────────────────────────────────────

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    return { success: false, error: friendlyError(error.message) };
  }

  // Update last_login
  await supabase
    .from("profiles")
    .update({ last_login: new Date().toISOString() })
    .eq("id", data.user.id);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: "Could not load your profile. Please try again." };
  }

  return { success: true, user: toFrontendUser(profile) };
}

// ── Auth: Sign Out ───────────────────────────────────────────

export async function logoutUser() {
  await supabase.auth.signOut();
}

// ── Auth: Get Current Session & Profile ─────────────────────

export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error || !profile) return null;
    return toFrontendUser(profile);
  } catch {
    return null;
  }
}

// ── Profile: Update ──────────────────────────────────────────

export async function updateCurrentUser(updates) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: false, error: "Not logged in." };

    const dbUpdates = toSnakeCase(updates);

    // Remove empty updates
    if (Object.keys(dbUpdates).length === 0) {
      const { data: profile } = await supabase
        .from("profiles").select("*").eq("id", session.user.id).single();
      return { success: true, user: profile ? toFrontendUser(profile) : null };
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(dbUpdates)
      .eq("id", session.user.id)
      .select()
      .single();

    if (error) return { success: false, error: friendlyError(error.message) };
    return { success: true, user: toFrontendUser(profile) };
  } catch {
    return { success: false, error: "An unexpected error occurred." };
  }
}

// ── Auth: Change Password ─────────────────────────────────────

export async function changePassword({ newPassword }) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, error: friendlyError(error.message) };
  return { success: true };
}

// ── Milestone Progress ────────────────────────────────────────

export async function loadMilestoneProgress(career) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return {};

    const { data, error } = await supabase
      .from("milestone_progress")
      .select("milestone_id, progress")
      .eq("user_id", session.user.id)
      .eq("career", career);

    if (error || !data) return {};
    return Object.fromEntries(data.map((row) => [row.milestone_id, row.progress]));
  } catch {
    return {};
  }
}

export async function saveMilestoneProgress(career, milestoneId, progress) {
  try {
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
  } catch {
    // Silently fail — milestone progress is non-critical
  }
}

// ── Helpers ──────────────────────────────────────────────────

function toFrontendUser(profile) {
  return {
    id:                 profile.id,
    name:               profile.name,
    email:              profile.email,
    username:           profile.username,
    degree:             profile.degree,
    year:               profile.year,
    targetCareer:       profile.target_career,
    bio:                profile.bio || "",
    phone:              profile.phone || "",
    location:           profile.location || "",
    github:             profile.github || "",
    linkedin:           profile.linkedin || "",
    avatarColor:        profile.avatar_color,
    skills:             profile.skills || [],
    interests:          profile.interests || [],
    projects:           profile.projects || "",
    pace:               profile.pace || "Balanced",
    onboardingComplete: profile.onboarding_complete,
    careerReadiness:    profile.career_readiness,
    assessmentScore:    profile.assessment_score,
    assessmentAnswers:  profile.assessment_answers,
    createdAt:          profile.created_at,
    lastLogin:          profile.last_login,
  };
}

function toSnakeCase(updates) {
  const map = {
    targetCareer:       "target_career",
    avatarColor:        "avatar_color",
    onboardingComplete: "onboarding_complete",
    careerReadiness:    "career_readiness",
    assessmentScore:    "assessment_score",
    assessmentAnswers:  "assessment_answers",
    lastLogin:          "last_login",
    createdAt:          "created_at",
  };
  const result = {};
  for (const [key, val] of Object.entries(updates)) {
    result[map[key] || key] = val;
  }
  return result;
}
