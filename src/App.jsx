import React, { useState } from "react";
import HamburgerButton from "./components/layout/HamburgerButton";
import HomeButton from "./components/layout/HomeButton";
import NavDrawer from "./components/layout/NavDrawer";
import TopBar from "./components/layout/TopBar";
import Toast from "./components/ui/Toast";

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

import { NAV_MENU, STUDENT } from "./data/mockData";

export default function App() {
  const [stage, setStage] = useState("landing"); // landing | onboarding | analyzing | app
  const [active, setActive] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [added, setAdded] = useState(new Set());
  const [toast, setToast] = useState(null);
  const loadStoredProfile = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = localStorage.getItem("pathforge_user_profile");
        if (stored) {
          return { ...STUDENT, ...JSON.parse(stored) };
        }
      }
    } catch (e) {
      console.warn("Failed to load profile from localStorage:", e);
    }
    return STUDENT;
  };

  const [student, setStudent] = useState(loadStoredProfile);

  const handleUpdateStudent = (updated, msg = "Profile updated successfully") => {
    const merged = { ...student, ...updated };
    setStudent(merged);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("pathforge_user_profile", JSON.stringify(merged));
      }
    } catch (e) {
      console.warn("Failed to save profile to localStorage:", e);
    }
    setToast(msg);
  };

  const toggleAdded = (id) => {
    setAdded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else { next.add(id); setToast("Added to your roadmap"); }
      return next;
    });
  };

  const go = (id) => { setStage("app"); setActive(id); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const navigate = (id) => {
    setDrawerOpen(false);
    if (id === "build-path") { setStage("onboarding"); return; }
    go(id);
  };

  const titleMap = Object.fromEntries(NAV_MENU.map(n => [n.id, n.label]));
  const activeDrawerId = stage === "onboarding" || stage === "analyzing" ? "build-path" : (stage === "app" ? active : null);

  return (
    <div className="lp-root min-h-screen bg-[#060911] text-[#eef1f7]">
      <HamburgerButton onClick={() => setDrawerOpen(true)} />
      {stage === "app" && <HomeButton onClick={() => setStage("landing")} />}
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} active={activeDrawerId} onNavigate={navigate} />

      {stage === "landing" && (
        <LandingPage
          onStart={() => setStage("onboarding")}
          onExplore={() => go("dashboard")}
          onProfile={() => go("profile")}
          student={student}
        />
      )}

      {stage === "onboarding" && (
        <OnboardingFlow onBack={() => setStage("landing")} onComplete={() => setStage("analyzing")} />
      )}

      {stage === "analyzing" && <AnalyzingScreen onDone={() => go("dashboard")} />}

      {stage === "app" && (
        <div>
          <TopBar title={titleMap[active]} onProfileClick={() => go("profile")} student={student} />
          <main className="px-5 md:px-8 py-7 max-w-7xl mx-auto">
            {active === "dashboard" && <DashboardView go={go} />}
            {active === "roadmap" && <RoadmapView />}
            {active === "resources" && <ResourcesView />}
            {active === "resume" && <ResumeView />}
            {active === "projects" && <ProjectsView added={added} toggleAdded={toggleAdded} />}
            {active === "certifications" && <CertificationsView added={added} toggleAdded={toggleAdded} />}
            {active === "career" && <CareerView />}
            {active === "profile" && <ProfileView student={student} onUpdateStudent={handleUpdateStudent} onBack={() => go("dashboard")} />}
            {active === "settings" && <SettingsView />}
          </main>
          <AIAssistant open={assistantOpen} setOpen={setAssistantOpen} />
          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
      )}
    </div>
  );
}
