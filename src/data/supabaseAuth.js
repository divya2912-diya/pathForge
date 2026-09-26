// ============================================================
//  PathForge — Supabase Auth & Profile Store
// ============================================================
import { supabase } from "../lib/supabaseClient";

// ── Friendly error messages ──────────────────────────────────
function friendlyError(msg = "") {
  if (msg.includes("Invalid login credentials"))
    return "Incorrect email or password. Please try again.";
  if (msg.includes("Email not confirmed"))
    return "Please check your email inbox to confirm your account, or turn off 'Confirm Email' in Supabase Authentication settings.";
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

  // Fetch or create user profile
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    // Missing profile row — auto-create via upsert
    const name = data.user.user_metadata?.name || email.split("@")[0] || "User";
    const username =
      data.user.user_metadata?.username ||
      name.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 999);

    const newProfile = {
      id: data.user.id,
      name,
      email: data.user.email,
      username,
      degree: data.user.user_metadata?.degree || "",
      year: data.user.user_metadata?.year || "",
      target_career: data.user.user_metadata?.target_career || "Software Engineer",
      avatar_color: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
      skills: [],
      interests: [],
      projects: "",
      pace: "Balanced",
      onboarding_complete: false,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };

    const { data: created } = await supabase
      .from("profiles")
      .upsert(newProfile)
      .select()
      .single();

    if (created) {
      profile = created;
    } else {
      // Fallback in-memory user object
      return {
        success: true,
        user: {
          id: data.user.id,
          name,
          email: data.user.email,
          username,
          degree: "",
          year: "",
          targetCareer: "Software Engineer",
          bio: "",
          skills: [],
          interests: [],
          projects: "",
          pace: "Balanced",
          onboardingComplete: false,
          careerReadiness: null,
          avatarColor: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
        },
      };
    }
  } else {
    // Update last_login
    await supabase
      .from("profiles")
      .update({ last_login: new Date().toISOString() })
      .eq("id", data.user.id);
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
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (!profile) {
      const name = session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User";
      return {
        id: session.user.id,
        name,
        email: session.user.email,
        username: session.user.user_metadata?.username || name.toLowerCase(),
        degree: "",
        year: "",
        targetCareer: "Software Engineer",
        bio: "",
        skills: [],
        interests: [],
        projects: "",
        pace: "Balanced",
        onboardingComplete: false,
        careerReadiness: null,
        avatarColor: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
      };
    }
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

    // Sync profile picture with Auth metadata for failproof persistence
    if (updates.profilePicture !== undefined) {
      await supabase.auth.updateUser({
        data: { profile_picture: updates.profilePicture },
      });
    }

    const dbUpdates = toSnakeCase(updates);

    if (Object.keys(dbUpdates).length === 0) {
      const { data: profile } = await supabase
        .from("profiles").select("*").eq("id", session.user.id).single();
      return { success: true, user: profile ? toFrontendUser(profile, session.user) : null };
    }

    let { data: profile, error } = await supabase
      .from("profiles")
      .update(dbUpdates)
      .eq("id", session.user.id)
      .select()
      .single();

    if (error) {
      // If DB update failed (e.g. column missing on DB schema), fetch existing profile and merge updates
      const { data: existing } = await supabase
        .from("profiles").select("*").eq("id", session.user.id).single();
      const merged = { ...(existing || {}), ...dbUpdates, id: session.user.id };
      return { success: true, user: toFrontendUser(merged, session.user) };
    }

    return { success: true, user: toFrontendUser(profile, session.user) };
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

// ── Certifications Catalog & Saved ──────────────────────────────

export async function getCatalogCertifications() {
  try {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("name", { ascending: true });
    
    if (error) {
      console.error("Error fetching catalog certifications:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception fetching catalog certifications:", err);
    return [];
  }
}

export async function getSavedCertifications() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return new Set();

    const { data, error } = await supabase
      .from("saved_certifications")
      .select("certification_id")
      .eq("user_id", session.user.id);
      
    if (error) return new Set();
    return new Set((data || []).map(r => r.certification_id));
  } catch {
    return new Set();
  }
}

export async function toggleSavedCertification(certificationId, isCurrentlySaved) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: false, error: "Not logged in" };

    if (isCurrentlySaved) {
      const { error } = await supabase
        .from("saved_certifications")
        .delete()
        .match({ user_id: session.user.id, certification_id: certificationId });
      return { success: !error };
    } else {
      const { error } = await supabase
        .from("saved_certifications")
        .insert([{ user_id: session.user.id, certification_id: certificationId }]);
      return { success: !error };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Projects Catalog & Saved ─────────────────────────────────

export async function getCatalogProjects() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("title", { ascending: true });
    
    if (error) {
      console.error("Error fetching catalog projects:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception fetching catalog projects:", err);
    return [];
  }
}

export async function getSavedProjects() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return new Set();

    const { data, error } = await supabase
      .from("saved_projects")
      .select("project_id")
      .eq("user_id", session.user.id);
      
    if (error) return new Set();
    return new Set((data || []).map(r => r.project_id));
  } catch {
    return new Set();
  }
}

export async function toggleSavedProject(projectId, isCurrentlySaved) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: false, error: "Not logged in" };

    if (isCurrentlySaved) {
      const { error } = await supabase
        .from("saved_projects")
        .delete()
        .match({ user_id: session.user.id, project_id: projectId });
      return { success: !error };
    } else {
      const { error } = await supabase
        .from("saved_projects")
        .insert([{ user_id: session.user.id, project_id: projectId }]);
      return { success: !error };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Helpers ──────────────────────────────────────────────────

function toFrontendUser(profile, authUser = null) {
  // resume_info is a JSON column that stores all resume-related data per user
  const resumeInfo = profile.resume_info || null;
  
  return {
    id:                 profile.id,
    name:               profile.name || "",
    email:              profile.email || "",
    username:           profile.username || "",
    degree:             profile.degree || "",
    year:               profile.year || "",
    targetCareer:       profile.target_career || "Software Engineer",
    enrollmentStatus:   profile.enrollment_status || "Active Student",
    bio:                profile.bio || "",
    phone:              profile.phone || "",
    location:           profile.location || "",
    github:             profile.github || "",
    linkedin:           profile.linkedin || "",
    portfolio:          profile.portfolio || "",
    avatarColor:        profile.avatar_color || "linear-gradient(135deg, #22d3ee, #8b5cf6)",
    profilePicture:     profile.profile_picture || authUser?.user_metadata?.profile_picture || null,
    skills:             profile.skills || [],
    userSkillsList:     profile.user_skills_list || [],
    interests:          profile.interests || [],
    learningRecords:    profile.learning_records || [],
    certificationsList: profile.certifications_list || [],
    projectsList:       profile.projects_list || [],
    projects:           profile.projects || "",
    pace:               profile.pace || "Balanced",
    preferredLanguage:  profile.preferred_language || profile.preferredLanguage || "en",
    learningPreferences: profile.learning_preferences || null,
    // Resume info is a nested JSON object stored in one column
    resumeInfo:         resumeInfo,
    resumeFile:         resumeInfo?.resumeFile || null,
    resumeText:         resumeInfo?.resumeText || null,
    resumeAnalysis:     resumeInfo?.resumeAnalysis || null,
    onboardingComplete: profile.onboarding_complete || false,
    careerReadiness:    profile.career_readiness ?? null,
    assessmentScore:    profile.assessment_score ?? null,
    assessmentAnswers:  profile.assessment_answers || null,
    createdAt:          profile.created_at,
    lastLogin:          profile.last_login,
  };
}

function toSnakeCase(updates) {
  const map = {
    targetCareer:       "target_career",
    enrollmentStatus:   "enrollment_status",
    avatarColor:        "avatar_color",
    profilePicture:     "profile_picture",
    userSkillsList:     "user_skills_list",
    learningRecords:    "learning_records",
    certificationsList: "certifications_list",
    projectsList:       "projects_list",
    onboardingComplete: "onboarding_complete",
    careerReadiness:    "career_readiness",
    assessmentScore:    "assessment_score",
    assessmentAnswers:  "assessment_answers",
    learningPreferences: "learning_preferences",
    preferredLanguage:  "preferred_language",
    resumeInfo:         "resume_info",
    lastLogin:          "last_login",
    createdAt:          "created_at",
  };
  
  const result = {};
  
  // Special handling: resumeFile, resumeText, resumeAnalysis are stored
  // together inside the resume_info JSON column (not separate DB columns)
  const resumeRelatedKeys = ["resumeFile", "resumeText", "resumeAnalysis"];
  const resumeRelatedUpdates = {};
  let hasResumeRelated = false;
  
  for (const [key, val] of Object.entries(updates)) {
    if (resumeRelatedKeys.includes(key)) {
      resumeRelatedUpdates[key] = val;
      hasResumeRelated = true;
    } else {
      result[map[key] || key] = val;
    }
  }
  
  // Merge resume-related keys into resume_info JSON
  if (hasResumeRelated) {
    // Preserve existing resume_info content and merge new keys
    const existingResumeInfo = result["resume_info"] || {};
    result["resume_info"] = { ...existingResumeInfo, ...resumeRelatedUpdates };
  }
  
  return result;
}
