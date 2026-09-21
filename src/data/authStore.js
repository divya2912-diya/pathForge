// ============================================================
//  PathForge — Auth Store (localStorage-based, no backend)
// ============================================================

const USERS_KEY = "pathforge_users";
const SESSION_KEY = "pathforge_session";

// Simple deterministic hash (good enough for offline hackathon)
function hashPassword(password) {
  let hash = 0;
  const str = password + "pathforge_salt_2026";
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// ── User storage helpers ────────────────────────────────────

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Public API ──────────────────────────────────────────────

/**
 * Register a new user.
 * @returns { success: boolean, error?: string, user?: object }
 */
export function registerUser({ name, email, password, degree, year, targetCareer }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.find((u) => u.email === normalizedEmail)) {
    return { success: false, error: "An account with this email already exists." };
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    degree: degree || "B.Tech Computer Science",
    year: year || "1st Year",
    targetCareer: targetCareer || "Software Engineer",
    // Profile fields (populated during onboarding)
    username: name.trim().toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 999),
    bio: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    avatarColor: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
    profilePicture: null,
    // Skill / career data (populated after onboarding)
    skills: [],
    interests: [],
    projects: "",
    pace: "Balanced",
    onboardingComplete: false,
    // Computed metrics (updated after assessment)
    careerReadiness: null,   // null = not yet calculated
    assessmentScore: null,
    assessmentAnswers: null,
    // Roadmap progress
    milestoneProgress: {},   // { milestoneId: progress% }
    // Timestamps
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  // Auto-create session
  const session = { userId: newUser.id, email: newUser.email, remember: false };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, user: sanitizeUser(newUser) };
}

/**
 * Login an existing user.
 * @returns { success: boolean, error?: string, user?: object }
 */
export function loginUser({ email, password, remember }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { success: false, error: "No account found with this email address." };
  }
  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, error: "Incorrect password. Please try again." };
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  saveUsers(users);

  // Create session
  const session = { userId: user.id, email: user.email, remember: !!remember };
  if (remember) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return { success: true, user: sanitizeUser(user) };
}

/**
 * Get the currently logged-in user (checks both storages).
 * @returns { user: object | null }
 */
export function getCurrentUser() {
  try {
    const raw =
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    const users = getUsers();
    const user = users.find((u) => u.id === session.userId);
    return user ? sanitizeUser(user) : null;
  } catch {
    return null;
  }
}

/**
 * Update the current user's profile fields.
 * @param {object} updates - Fields to merge into the user record
 * @returns {object} Updated user
 */
export function updateCurrentUser(updates) {
  try {
    const raw =
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === session.userId);
    if (idx === -1) return null;

    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    return sanitizeUser(users[idx]);
  } catch {
    return null;
  }
}

/**
 * Log out the current user.
 */
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Change the current user's password.
 * @returns { success: boolean, error?: string }
 */
export function changePassword({ currentPassword, newPassword }) {
  try {
    const raw =
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return { success: false, error: "Not logged in." };

    const session = JSON.parse(raw);
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === session.userId);
    if (idx === -1) return { success: false, error: "User not found." };

    if (users[idx].passwordHash !== hashPassword(currentPassword)) {
      return { success: false, error: "Current password is incorrect." };
    }

    users[idx].passwordHash = hashPassword(newPassword);
    saveUsers(users);
    return { success: true };
  } catch {
    return { success: false, error: "An error occurred." };
  }
}

// Remove sensitive fields before returning user to UI
function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}
