import React, { useState, useEffect } from "react";
import HamburgerButton from "./components/layout/HamburgerButton";
import NavDrawer from "./components/layout/NavDrawer";
import TopBar from "./components/layout/TopBar";
import Toast from "./components/ui/Toast";
import RoadmapAdditionToastModal from "./components/ui/RoadmapAdditionToastModal";
import { addToRoadmap } from "./services/roadmapAdditionService";

import LoginView from "./components/views/LoginView";
import LandingPage from "./components/views/LandingPage";
import OnboardingFlow from "./components/views/OnboardingFlow";
import AnalyzingScreen from "./components/views/AnalyzingScreen";
import AssessmentView from "./components/views/AssessmentView";
import DashboardView from "./components/views/DashboardView";
import SkillsView from "./components/views/SkillsView";
import RoadmapView from "./components/views/RoadmapView";
import ResourcesView from "./components/views/ResourcesView";
import ResumeView from "./components/views/ResumeView";
import JobNotificationsView from "./components/views/JobNotificationsView";
import ProjectsView from "./components/views/ProjectsView";
import CertificationsView from "./components/views/CertificationsView";
import CareerView from "./components/views/CareerView";
import ProfileView from "./components/views/ProfileView";
import SettingsView from "./components/views/SettingsView";
import LearningAnalyticsView from "./components/views/LearningAnalyticsView";
import ChatWidget from "./components/ChatWidget";

import { registerServiceWorker, handleLogoutCacheClear } from "./services/offlineSyncService";

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
import { getTranslation } from "./services/i18nService";

import { GuidedJourneyNav, GuidedJourneyFooter } from "./components/ui/GuidedJourneyNav";

export default function App() {
  const [stage, setStage] = useState("loading"); // loading | login | landing | onboarding | analyzing | app
  const [active, setActive] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roadmapAdditionResult, setRoadmapAdditionResult] = useState(null);
  const [highlightedRoadmapItemId, setHighlightedRoadmapItemId] = useState(null);
  const [added, setAdded] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [student, setStudent] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem("pathforge_language") || "en");

  useEffect(() => {
    let mounted = true;
    registerServiceWorker();

    // Timeout safety fallback: if session check takes > 3s, fallback to login view
    const timeout = setTimeout(() => {
      if (mounted) setStage((prev) => (prev === "loading" ? "login" : prev));
    }, 3000);

    // Initial session check
    getCurrentUser()
      .then((user) => {
        if (!mounted) return;
        if (user) {
          setStudent(user);
          if (user.preferredLanguage) {
            setLanguage(user.preferredLanguage);
            localStorage.setItem("pathforge_language", user.preferredLanguage);
          }
          setStage(user.onboardingComplete ? "landing" : "onboarding");
        } else {
          setStage("login");
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        if (mounted) setStage("login");
      });

    // Subscribe to auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          setStudent(null);
          setStage("login");
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // Sync language if student profile updates
  useEffect(() => {
    if (student?.preferredLanguage && student.preferredLanguage !== language) {
      setLanguage(student.preferredLanguage);
      localStorage.setItem("pathforge_language", student.preferredLanguage);
    }
  }, [student?.preferredLanguage]);

  // ── Language Change Handler ──────────────────────────────────

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("pathforge_language", newLang);
    if (student) {
      setStudent(prev => prev ? { ...prev, preferredLanguage: newLang } : prev);
      await updateCurrentUser({ preferredLanguage: newLang, preferred_language: newLang });
    }
  };

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
      if (result.user.preferredLanguage) {
        setLanguage(result.user.preferredLanguage);
        localStorage.setItem("pathforge_language", result.user.preferredLanguage);
      }
      setToast(`Welcome back, ${result.user.name}!`);
      setStage(result.user.onboardingComplete ? "landing" : "onboarding");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const handleLogout = async () => {
    if (student?.id) {
      await handleLogoutCacheClear(student.id);
    }
    await logoutUser();
    setStudent(null);
    setStage("login");
    setActive("dashboard");
    setToast("You've been signed out.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Onboarding complete ───────────────────────────────────

  const [lastOnboardingData, setLastOnboardingData] = useState(null);

  const handleOnboardingComplete = async (onboardingData) => {
    setLastOnboardingData(onboardingData);
    const profileUpdates = buildInitialProfile(onboardingData, student);
    const result = await updateCurrentUser(profileUpdates);
    if (result.success) setStudent(result.user);
    setStage("analyzing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Profile update (from ProfileView / Settings) ──────────

  const handleUpdateStudent = async (updates, msg = "Profile updated successfully") => {
    setStudent((prev) => ({ ...(prev || {}), ...updates }));
    const result = await updateCurrentUser(updates);
    if (result?.success && result.user) {
      setStudent(result.user);
      if (result.user.preferredLanguage) {
        setLanguage(result.user.preferredLanguage);
        localStorage.setItem("pathforge_language", result.user.preferredLanguage);
      }
      setToast(msg);
    } else {
      setToast(msg);
    }
  };

  const handleAddToRoadmap = async (item, itemType = "resource") => {
    const res = await addToRoadmap({
      student,
      item,
      itemType,
      onUpdateStudent: handleUpdateStudent
    });
    setRoadmapAdditionResult(res);
    return res;
  };

  const handleViewRoadmapFromToast = (itemId) => {
    if (itemId) {
      setHighlightedRoadmapItemId(String(itemId));
    }
    go("roadmap");
  };

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

  const titleMap = Object.fromEntries(
    NAV_MENU.map((n) => [
      n.id, 
      getTranslation(`nav.${n.id}`, language) !== `nav.${n.id}` ? getTranslation(`nav.${n.id}`, language) : n.label
    ])
  );

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
          <p className="text-slate-500 text-sm">{getTranslation("common.loading", language)}</p>
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
        language={language}
        onLanguageChange={handleLanguageChange}
        student={student}
        onLogout={handleLogout}
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
          onUpdateStudent={handleUpdateStudent}
          go={go}
          language={language}
          onLanguageChange={handleLanguageChange}
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
        <AnalyzingScreen
          student={student}
          onboardingData={lastOnboardingData}
          onDone={() => go("dashboard")}
        />
      )}

      {stage === "app" && (
        <div className="min-h-screen">
          <TopBar
            title={titleMap[active]}
            onProfileClick={() => go("profile")}
            student={student}
            go={go}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
          <main className="px-5 md:px-8 py-7 max-w-7xl mx-auto">
            <GuidedJourneyNav active={active} go={go} language={language} />

            {active === "dashboard" && <DashboardView go={go} student={student} onUpdateStudent={handleUpdateStudent} language={language} />}
            {active === "roadmap" && (
              <RoadmapView 
                student={student} 
                onUpdateStudent={handleUpdateStudent} 
                go={go} 
                highlightedItemId={highlightedRoadmapItemId}
                onClearHighlight={() => setHighlightedRoadmapItemId(null)}
                language={language}
              />
            )}
            {active === "resources" && (
              <ResourcesView 
                student={student} 
                added={added} 
                toggleAdded={toggleAdded} 
                onAddToRoadmap={handleAddToRoadmap}
                go={go} 
                language={language}
              />
            )}
            {active === "resume" && <ResumeView student={student} onUpdateStudent={handleUpdateStudent} go={go} language={language} />}
            {active === "jobs" && <JobNotificationsView student={student} onUpdateStudent={handleUpdateStudent} go={go} language={language} />}
            {active === "projects" && (
              <ProjectsView 
                student={student} 
                added={added} 
                toggleAdded={toggleAdded} 
                onAddToRoadmap={handleAddToRoadmap}
                go={go} 
                language={language}
              />
            )}
            {active === "certifications" && (
              <CertificationsView 
                student={student} 
                onUpdateStudent={handleUpdateStudent} 
                added={added} 
                toggleAdded={toggleAdded} 
                onAddToRoadmap={handleAddToRoadmap}
                go={go} 
                language={language}
              />
            )}
            {active === "career" && <CareerView student={student} onUpdateStudent={handleUpdateStudent} onAddToRoadmap={handleAddToRoadmap} go={go} language={language} />}
            {active === "analytics" && <LearningAnalyticsView student={student} onUpdateStudent={handleUpdateStudent} go={go} language={language} />}
            {active === "assessment" && <AssessmentView student={student} onUpdateStudent={handleUpdateStudent} go={go} language={language} />}
            {active === "skills" && <SkillsView language={language} />}
            {active === "profile" && (
              <ProfileView
                student={student}
                onUpdateStudent={handleUpdateStudent}
                onBack={() => go("dashboard")}
                language={language}
              />
            )}
            {active === "settings" && (
              <SettingsView student={student} onLogout={handleLogout} onUpdateStudent={handleUpdateStudent} language={language} />
            )}

            <GuidedJourneyFooter active={active} go={go} language={language} />
          </main>
          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
          <RoadmapAdditionToastModal
            result={roadmapAdditionResult}
            onClose={() => setRoadmapAdditionResult(null)}
            onViewRoadmap={handleViewRoadmapFromToast}
          />
        </div>
      )}

      {/* AI Chatbot — visible on every page except login/loading */}
      {stage !== "login" && stage !== "loading" && (
        <ChatWidget student={student} />
      )}
    </div>
  );
}
