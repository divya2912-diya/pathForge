import React, { useState, useEffect } from "react";
import HamburgerButton from "./components/layout/HamburgerButton";
import NavDrawer from "./components/layout/NavDrawer";
import TopBar from "./components/layout/TopBar";
import Toast from "./components/ui/Toast";

import LoginView from "./components/views/LoginView";
import LandingPage from "./components/views/LandingPage";
import OnboardingFlow from "./components/views/OnboardingFlow";
import AnalyzingScreen from "./components/views/AnalyzingScreen";
import DashboardView from "./components/views/DashboardView";
import SkillsView from "./components/views/SkillsView";
import RoadmapView from "./components/views/RoadmapView";
import ResourcesView from "./components/views/ResourcesView";
import ResumeView from "./components/views/ResumeView";
import ProjectsView from "./components/views/ProjectsView";
import CertificationsView from "./components/views/CertificationsView";
import CareerView from "./components/views/CareerView";
import ProfileView from "./components/views/ProfileView";
import SettingsView from "./components/views/SettingsView";
import AIAssistant from "./components/AIAssistant";

import { NAV_MENU } from "./data/mockData";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateCurrentUser,
  getCurrentUser,
} from "./data/supabaseAuth";
import { supabase } from "./lib/supabaseClient";
import { buildInitialProfile } from "./data/userProfile";

export default function App() {
  const [stage, setStage] = useState("loading"); // loading | login | landing | onboarding | analyzing | app
  const [active, setActive] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [added, setAdded] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [student, setStudent] = useState(null);

  // ── On mount: listen to Supabase auth state changes ──────────
  useEffect(() => {
    // Initial session check
    getCurrentUser().then((user) => {
      if (user) {
        setStudent(user);
        setStage(user.onboardingComplete ? "landing" : "onboarding");
      } else {
        setStage("login");
      }
    });

    // Subscribe to auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          setStudent(null);
          setStage("login");
        }
        // On sign-in, profile is fetched explicitly in handlers below
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Auth handlers ─────────────────────────────────────────

  const handleRegister = async ({ name, email, password, degree, year, targetCareer }) => {
    const result = await registerUser({ name, email, password, degree, year, targetCareer });
    if (result.success) {
      setStudent(result.user);
      setToast(`Welcome to PathForge, ${result.user.name}! Let's build your learning path.`);
      setStage("onboarding");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const handleLogin = async ({ email, password, remember }) => {
    const result = await loginUser({ email, password, remember });
    if (result.success) {
      setStudent(result.user);
      setToast(`Welcome back, ${result.user.name}!`);
      setStage(result.user.onboardingComplete ? "landing" : "onboarding");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const handleLogout = async () => {
    await logoutUser();
    setStudent(null);
    setStage("login");
    setActive("dashboard");
    setToast("You've been signed out.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Onboarding complete ───────────────────────────────────

  const handleOnboardingComplete = async (onboardingData) => {
    const profileUpdates = buildInitialProfile(onboardingData, student);
    const result = await updateCurrentUser(profileUpdates);
    if (result.success) setStudent(result.user);
    setStage("analyzing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Profile update (from ProfileView / Settings) ──────────

  const handleUpdateStudent = async (updates, msg = "Profile updated successfully") => {
    // Optimistic UI state update so picture/edits show instantly
    setStudent((prev) => ({ ...(prev || {}), ...updates }));
    const result = await updateCurrentUser(updates);
    if (result?.success && result.user) {
      setStudent(result.user);
      setToast(msg);
    } else {
      setToast(msg);
    }
  };

  // ── Navigation ────────────────────────────────────────────

  const toggleAdded = (id) => {
    setAdded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setToast("Added to your roadmap");
      }
      return next;
    });
  };

  const go = (id) => {
    setStage("app");
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = (id) => {
    setDrawerOpen(false);
    if (id === "home") { setStage("landing"); return; }
    if (id === "login") { setStage("login"); return; }
    if (id === "build-path") { setStage("onboarding"); return; }
    go(id);
  };

  // ── Derived ───────────────────────────────────────────────

  const titleMap = Object.fromEntries(NAV_MENU.map((n) => [n.id, n.label]));
  const activeDrawerId =
    stage === "landing"
      ? "home"
      : stage === "login"
      ? "login"
      : stage === "onboarding" || stage === "analyzing"
      ? "build-path"
      : stage === "app"
      ? active
      : null;

  // Loading screen while checking session
  if (stage === "loading") {
    return (
      <div className="min-h-screen bg-[#060911] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg animate-pulse"
            style={{ background: "linear-gradient(135deg, #22d3ee, #3b82f6 50%, #f97316)" }}
          />
          <p className="text-slate-500 text-sm">Loading PathForge…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lp-root min-h-screen bg-[#060911] text-[#eef1f7]">
      {stage !== "login" && stage !== "loading" && (
        <HamburgerButton onClick={() => setDrawerOpen(true)} />
      )}

      <NavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active={activeDrawerId}
        onNavigate={navigate}
      />

      {stage === "login" && (
        <LoginView
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {stage === "landing" && (
        <LandingPage
          onStart={() => setStage("onboarding")}
          onExplore={() => go("dashboard")}
          onProfile={() => go("profile")}
          student={student}
          onLogin={() => setStage("login")}
        />
      )}

      {stage === "onboarding" && (
        <OnboardingFlow
          student={student}
          onBack={() => setStage(student?.onboardingComplete ? "landing" : "login")}
          onComplete={handleOnboardingComplete}
        />
      )}

      {stage === "analyzing" && (
        <AnalyzingScreen onDone={() => go("dashboard")} />
      )}

      {stage === "app" && (
        <div>
          <TopBar
            title={titleMap[active]}
            onProfileClick={() => go("profile")}
            student={student}
          />
          <main className="px-5 md:px-8 py-7 max-w-7xl mx-auto">
            {active === "dashboard" && <DashboardView go={go} student={student} />}
            {active === "roadmap" && <RoadmapView student={student} onUpdateStudent={handleUpdateStudent} />}
            {active === "resources" && <ResourcesView student={student} />}
            {active === "resume" && <ResumeView student={student} />}
            {active === "projects" && <ProjectsView added={added} toggleAdded={toggleAdded} />}
            {active === "certifications" && <CertificationsView added={added} toggleAdded={toggleAdded} />}
            {active === "career" && <CareerView student={student} />}
            {active === "profile" && (
              <ProfileView
                student={student}
                onUpdateStudent={handleUpdateStudent}
                onBack={() => go("dashboard")}
              />
            )}
            {active === "settings" && (
              <SettingsView student={student} onLogout={handleLogout} onUpdateStudent={handleUpdateStudent} />
            )}
          </main>
          <AIAssistant open={assistantOpen} setOpen={setAssistantOpen} />
          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
      )}
    </div>
  );
}
