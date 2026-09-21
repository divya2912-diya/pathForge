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
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  updateCurrentUser,
} from "./data/authStore";
import { buildInitialProfile } from "./data/userProfile";

export default function App() {
  const [stage, setStage] = useState("login"); // login | landing | onboarding | analyzing | app
  const [active, setActive] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [added, setAdded] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [student, setStudent] = useState(null);

  // ── On mount: check for existing session ──────────────────
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setStudent(user);
      if (user.onboardingComplete) {
        setStage("landing");
      } else {
        // Registered but never finished onboarding
        setStage("onboarding");
      }
    } else {
      setStage("login");
    }
  }, []);

  // ── Auth handlers ─────────────────────────────────────────

  const handleRegister = ({ name, email, password, degree, year, targetCareer }) => {
    const result = registerUser({ name, email, password, degree, year, targetCareer });
    if (result.success) {
      setStudent(result.user);
      setToast(`Welcome to PathForge, ${result.user.name}! Let's build your learning path.`);
      setStage("onboarding");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const handleLogin = ({ email, password, remember }) => {
    const result = loginUser({ email, password, remember });
    if (result.success) {
      setStudent(result.user);
      setToast(`Welcome back, ${result.user.name}!`);
      if (result.user.onboardingComplete) {
        setStage("landing");
      } else {
        setStage("onboarding");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const handleLogout = () => {
    logoutUser();
    setStudent(null);
    setStage("login");
    setActive("dashboard");
    setToast("You've been signed out.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Onboarding complete ───────────────────────────────────

  const handleOnboardingComplete = (onboardingData) => {
    const profileUpdates = buildInitialProfile(onboardingData, student);
    const updated = updateCurrentUser(profileUpdates);
    if (updated) setStudent(updated);
    setStage("analyzing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Profile update (from ProfileView / Settings) ──────────

  const handleUpdateStudent = (updates, msg = "Profile updated successfully") => {
    const updated = updateCurrentUser(updates);
    if (updated) {
      setStudent(updated);
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

  // Show nothing while detecting session (avoids flash)
  if (stage === "login" && student) return null;

  return (
    <div className="lp-root min-h-screen bg-[#060911] text-[#eef1f7]">
      <HamburgerButton onClick={() => setDrawerOpen(true)} />

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
