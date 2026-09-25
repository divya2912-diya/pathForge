import React, { useState, useEffect } from "react";
import {
  Target, ChevronDown, CheckCircle2, Lock, ArrowRight, BookOpen, PlayCircle, ExternalLink, Activity, Trophy, Circle, Map, Compass, BrainCircuit, SearchCode, Send, Sparkles, MapPin, Layers, Award, ArrowLeft, Check
} from "lucide-react";
import { loadMilestoneProgress, saveMilestoneProgress } from "../../data/supabaseAuth";
import { getRequiredSkills, calculateDynamicReadiness } from "../../data/userProfile";
import ModalShell from "../ui/ModalShell";
import GlassCard from "../ui/GlassCard";

export function RoadmapView({ student, onUpdateStudent, go }) {
  const [dbProgress, setDbProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingCareer, setIsChangingCareer] = useState(false);
  const [viewMode, setViewMode] = useState("winding"); // 'winding' | 'tabs'
  const [activeTab, setActiveTab] = useState("foundation");
  
  // Active selected node modal & learning module modal
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeLearningModule, setActiveLearningModule] = useState(null);
  const [learningCompleted, setLearningCompleted] = useState(false);

  // Interview Prep State
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [interviewQuestion, setInterviewQuestion] = useState("");
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewFeedback, setInterviewFeedback] = useState(null);

  // Load progress from Supabase
  useEffect(() => {
    async function init() {
      if (!student) return;
      setIsLoading(true);
      const targetCareer = student.targetCareer;
      if (targetCareer) {
        const loadedProgress = await loadMilestoneProgress(targetCareer);
        setDbProgress(loadedProgress || {});
      }
      setIsLoading(false);
    }
    init();
  }, [student]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Activity className="w-8 h-8 animate-spin mb-4 text-cyan-400" />
        <p>Loading your personalized career path...</p>
      </div>
    );
  }

  const targetCareer = student?.targetCareer;
  const userSkills = (student?.skills || []).map((s) => s.toLowerCase());
  const userSkillsList = (student?.userSkillsList || []).map((s) => s.name.toLowerCase());
  const allUserSkills = new Set([...userSkills, ...userSkillsList]);

  // Handle empty state if no target career is set
  if (!targetCareer) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Compass className="w-16 h-16 text-cyan-400/50 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Set Your Target Career Goal</h2>
        <p className="text-slate-400 mb-6 max-w-md">Select your target career in your profile to generate your personalized learning path.</p>
        <button 
          onClick={() => go?.("profile")}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:from-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          Choose Career Goal
        </button>
      </div>
    );
  }

  const requiredSkills = getRequiredSkills(targetCareer);

  const isMastered = (skill) => {
    return Array.from(allUserSkills).some(
      (s) => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s)
    );
  };

  const isSkillDbCompleted = (skill) => {
    const key = `skill_${skill.replace(/\s+/g, "_").toLowerCase()}`;
    return dbProgress[key] === 1;
  };

  const actualGaps = requiredSkills.filter((req) => !isMastered(req) && !isSkillDbCompleted(req));
  const actualStrengths = requiredSkills.filter((req) => isMastered(req) || isSkillDbCompleted(req));

  const totalRequired = requiredSkills.length;
  const progressPercent = totalRequired === 0 ? 100 : Math.round((actualStrengths.length / totalRequired) * 100);
  const nextStep = actualGaps.length > 0 ? actualGaps[0] : null;

  const half = Math.ceil(requiredSkills.length / 2);
  const foundationSkills = requiredSkills.slice(0, half);
  const specSkills = requiredSkills.slice(half);
  const projects = student?.projectsList || [];
  const certs = student?.certificationsList || [];
  const assessments = student?.assessments || [];

  // Toggle skill progress manually
  const toggleSkill = async (skill) => {
    const key = `skill_${skill.replace(/\s+/g, "_").toLowerCase()}`;
    const currentVal = dbProgress[key] === 1 ? 0 : 1;
    setDbProgress((prev) => ({ ...prev, [key]: currentVal }));
    await saveMilestoneProgress(targetCareer, key, currentVal);
  };

  // --------------------------------------------------------
  // BUILD CANDY CRUSH / GOOGLE MAPS WINDING PATH NODES
  // --------------------------------------------------------
  const pathNodes = [];

  // 1. Start Node
  pathNodes.push({
    id: "node_start",
    type: "start",
    title: "PathForge Journey Start",
    stage: "Foundation",
    desc: `Begin your journey toward becoming a ${targetCareer}.`,
    status: "completed",
    xPos: "50%",
    icon: Compass,
    hours: "0 hrs",
  });

  // 2. Foundation Nodes
  foundationSkills.forEach((skill, idx) => {
    const done = isMastered(skill) || isSkillDbCompleted(skill);
    const isCurrent = !done && (idx === 0 || isMastered(foundationSkills[idx - 1]) || isSkillDbCompleted(foundationSkills[idx - 1]));
    const positions = ["25%", "75%", "50%", "30%", "70%"];
    pathNodes.push({
      id: `skill_${skill.replace(/\s+/g, "_").toLowerCase()}`,
      type: "skill",
      title: skill,
      stage: "Foundation",
      desc: `Core concepts and practical application of ${skill} for ${targetCareer}.`,
      relevance: `Essential foundation skill for ${targetCareer} roles.`,
      status: done ? "completed" : isCurrent ? "current" : "upcoming",
      xPos: positions[idx % positions.length],
      icon: BookOpen,
      hours: `${3 + idx} wks`,
      skillName: skill,
    });
  });

  // 3. Specialization Nodes
  specSkills.forEach((skill, idx) => {
    const done = isMastered(skill) || isSkillDbCompleted(skill);
    const isCurrent = !done && (actualGaps.length > 0 && actualGaps[0] === skill);
    const positions = ["75%", "35%", "65%", "25%"];
    pathNodes.push({
      id: `skill_${skill.replace(/\s+/g, "_").toLowerCase()}`,
      type: "specialization",
      title: skill,
      stage: "Specialization",
      desc: `Advanced frameworks, architecture patterns, and tools for ${skill}.`,
      relevance: `Key specialization requirement for ${targetCareer}.`,
      status: done ? "completed" : isCurrent ? "current" : "upcoming",
      xPos: positions[idx % positions.length],
      icon: Layers,
      hours: `${2 + idx} wks`,
      skillName: skill,
    });
  });

  // 4. Portfolio Capstone Project Node
  const capstoneDone = projects.length > 0;
  pathNodes.push({
    id: "node_portfolio",
    type: "project",
    title: `Capstone Portfolio Project`,
    stage: "Projects & Portfolio",
    desc: `Build and deploy a full-featured project demonstrating ${targetCareer} skills.`,
    relevance: "Recruiters evaluate verified portfolio projects before your degree.",
    status: capstoneDone ? "completed" : (actualGaps.length === 0 ? "current" : "upcoming"),
    xPos: "50%",
    icon: Trophy,
    hours: "4 wks",
  });

  // 5. Interview Prep Node
  const interviewDone = dbProgress["node_interview"] === 1;
  pathNodes.push({
    id: "node_interview",
    type: "interview",
    title: `${targetCareer} Technical Screen`,
    stage: "Interview Prep",
    desc: `Practice role-specific coding questions, system design, and STAR behavioral answers.`,
    relevance: "Ensures technical interview stamina and algorithmic clarity.",
    status: interviewDone ? "completed" : (capstoneDone ? "current" : "upcoming"),
    xPos: "65%",
    icon: Sparkles,
    hours: "2 wks",
  });

  // 6. Career Ready Node
  const careerReady = progressPercent >= 90;
  pathNodes.push({
    id: "node_ready",
    type: "ready",
    title: `Hire Ready — ${targetCareer}`,
    stage: "Career Ready",
    desc: `Profile verified, skill gaps closed, portfolio ready for applications.`,
    status: careerReady ? "completed" : "locked",
    xPos: "50%",
    icon: Award,
    hours: "Goal",
  });

  // Determine current active node index for progress
  const activeNodeIdx = pathNodes.findIndex((n) => n.status === "current");

  // Handlers
  const handleMarkComplete = async (node) => {
    if (node.skillName) {
      await toggleSkill(node.skillName);
    } else {
      const currentVal = dbProgress[node.id] === 1 ? 0 : 1;
      setDbProgress((prev) => ({ ...prev, [node.id]: currentVal }));
      await saveMilestoneProgress(targetCareer, node.id, currentVal);
    }
    setLearningCompleted(true);
  };

  const startInterview = () => {
    if (actualGaps.length > 0) {
      setInterviewQuestion(`Explain the core principles of ${actualGaps[0]} and how you would architect a solution for ${targetCareer}.`);
    } else {
      setInterviewQuestion(`Describe a complex production issue you solved using ${actualStrengths[0] || 'your core skills'}.`);
    }
    setIsInterviewing(true);
    setInterviewAnswer("");
    setInterviewFeedback(null);
  };

  const submitInterview = () => {
    if (!interviewAnswer.trim()) return;
    setInterviewFeedback({
      correctness: "Strong response! Clear structure and solid technical vocabulary.",
      points: ["Explained core architecture", "Mentioned performance optimization trade-offs"],
      revise: nextStep || "System Design Fundamentals",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* 1. HEADER & CURRENT POSITION */}
      <GlassCard strong className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Compass size={14} /> Career Learning Path
            </div>
            <h1 className="lp-display text-2xl font-bold text-white flex items-center gap-2">
              {targetCareer}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              A visual progression map connecting your current skills to full hire readiness.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-xl">
              <button
                onClick={() => setViewMode("winding")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "winding"
                    ? "bg-cyan-500 text-[#060911] shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Map size={13} /> Winding Path
              </button>
              <button
                onClick={() => setViewMode("tabs")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "tabs"
                    ? "bg-cyan-500 text-[#060911] shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers size={13} /> Tabbed Milestones
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Target Career</span>
            <span className="text-sm font-bold text-white truncate block">{targetCareer}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Overall Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-cyan-400">{progressPercent}%</span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Skills Completed</span>
            <span className="text-sm font-bold text-emerald-400">{actualStrengths.length} / {totalRequired}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">High-Priority Gaps</span>
            <span className="text-sm font-bold text-amber-400">{actualGaps.length} remaining</span>
          </div>
        </div>
      </GlassCard>

      {/* 2. NEXT PRIORITY ACTION CALLOUT */}
      {nextStep && (
        <div className="bg-gradient-to-r from-cyan-950/60 to-purple-950/40 border border-cyan-500/30 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 shadow-md">
              <Sparkles size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Recommended Next Focus</span>
              <h3 className="text-lg font-bold text-white">Master {nextStep}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{nextStep} is your highest-priority skill gap for {targetCareer}.</p>
            </div>
          </div>

          <button
            onClick={() => {
              const targetNode = pathNodes.find(n => n.title === nextStep);
              if (targetNode) {
                setSelectedNode(targetNode);
              }
            }}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#060911] font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            Start Learning {nextStep} <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. GOOGLE MAPS / CANDY CRUSH WINDING SERPENTINE PATH         */}
      {/* ============================================================ */}
      {viewMode === "winding" && (
        <GlassCard strong className="p-6 md:p-10 relative overflow-hidden">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Career Progression Pathway</span>
            <h2 className="text-xl font-bold text-white mt-1">Interactive Learning Journey</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">Click any node to view milestone topics, learning modules, assignments, and resources.</p>
          </div>

          <div className="relative py-10 max-w-2xl mx-auto">
            {/* Winding Connecting Line Background */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-500/80 via-purple-500/50 to-slate-800 rounded-full pointer-events-none" />

            {/* Path Nodes */}
            <div className="space-y-16 relative z-10">
              {pathNodes.map((node, index) => {
                const NodeIcon = node.icon;
                const isDone = node.status === "completed";
                const isCurrent = node.status === "current";
                const isLocked = node.status === "locked";

                return (
                  <div
                    key={node.id}
                    className="relative flex items-center"
                    style={{ justifyContent: index % 2 === 0 ? "flex-start" : "flex-end" }}
                  >
                    {/* Visual Connector Dot on Central Line */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all ${
                        isDone
                          ? "bg-cyan-400 border-cyan-300 shadow-[0_0_10px_#22d3ee]"
                          : isCurrent
                          ? "bg-purple-500 border-white animate-ping"
                          : "bg-slate-900 border-slate-700"
                      }`}
                    />

                    {/* Milestone Node Card */}
                    <div
                      onClick={() => setSelectedNode(node)}
                      className={`w-[85%] sm:w-[45%] p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                        isDone
                          ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-100 hover:border-emerald-400"
                          : isCurrent
                          ? "bg-gradient-to-br from-cyan-950/60 to-purple-950/60 border-cyan-400 text-white shadow-[0_0_25px_rgba(34,211,238,0.25)] scale-105"
                          : isLocked
                          ? "bg-slate-900/30 border-white/5 opacity-50 blur-[0.3px]"
                          : "bg-slate-900/60 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900/80"
                      }`}
                    >
                      {/* Active "YOU ARE HERE" Floating Badge */}
                      {isCurrent && (
                        <div className="absolute -top-3 left-4 px-2.5 py-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 text-[#04121a] font-black text-[10px] uppercase rounded-full shadow-md animate-bounce">
                          You are here ✨
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                            isDone
                              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                              : isCurrent
                              ? "bg-cyan-500 border border-cyan-300 text-[#04121a]"
                              : "bg-white/5 border border-white/10 text-slate-400"
                          }`}
                        >
                          {isDone ? <Check size={18} /> : isLocked ? <Lock size={16} /> : <NodeIcon size={18} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{node.stage}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">{node.hours}</span>
                          </div>

                          <h4 className="text-sm font-bold truncate group-hover:text-cyan-300 transition-colors">{node.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{node.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      )}

      {/* ============================================================ */}
      {/* 4. TABBED MILESTONES VIEW MODE                                */}
      {/* ============================================================ */}
      {viewMode === "tabs" && (
        <div className="space-y-6">
          <div className="flex overflow-x-auto gap-2 border-b border-white/5 pb-px custom-scrollbar">
            {["foundation", "specialization", "projects", "interview", "ready"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "border-cyan-400 text-cyan-400"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
                }`}
              >
                {tab === "ready" ? "Career Ready" : tab === "interview" ? "Interview Prep" : tab}
              </button>
            ))}
          </div>

          {(activeTab === "foundation" || activeTab === "specialization") && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(activeTab === "foundation" ? foundationSkills : specSkills).map((skill) => {
                const profileMastered = isMastered(skill);
                const dbCompleted = isSkillDbCompleted(skill);
                const isCompleted = profileMastered || dbCompleted;

                return (
                  <GlassCard key={skill} className="p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`font-bold text-base ${isCompleted ? "text-slate-300" : "text-white"}`}>{skill}</h3>
                      <button onClick={() => toggleSkill(skill)} className="cursor-pointer" title={isCompleted ? "Mark as in-progress" : "Mark completed"}>
                        {isCompleted ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Circle className="w-6 h-6 text-slate-600 hover:text-cyan-400" />}
                      </button>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isCompleted ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-slate-400"}`}>
                        {isCompleted ? "Completed" : "In Progress"}
                      </span>
                      <button
                        onClick={() => {
                          const targetNode = pathNodes.find(n => n.title === skill);
                          if (targetNode) setSelectedNode(targetNode);
                        }}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        Module Details <ArrowRight size={12} />
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Recommended Capstone Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((p) => (
                  <GlassCard key={p.id || p.title} className="p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base mb-1">{p.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">{p.description}</p>
                    </div>
                    <button onClick={() => go?.("projects")} className="px-4 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all w-full flex items-center justify-center gap-2">
                      <PlayCircle size={15} /> Open Project Workspace
                    </button>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {activeTab === "interview" && (
            <GlassCard className="p-6">
              {!isInterviewing ? (
                <div className="text-center py-8">
                  <BrainCircuit className="w-12 h-12 text-cyan-400/50 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-1">{targetCareer} Interview Screen</h3>
                  <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">Practice live technical questions tailored to your target career and skill gaps.</p>
                  <button onClick={startInterview} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#060911] font-bold text-xs rounded-xl transition-all shadow-md">
                    Start Interview Practice
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-w-xl mx-auto">
                  <h3 className="text-base font-bold text-white">{interviewQuestion}</h3>
                  <textarea
                    value={interviewAnswer}
                    onChange={(e) => setInterviewAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-32 bg-[#0a0f1d] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                  />
                  {!interviewFeedback ? (
                    <button onClick={submitInterview} className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#060911] font-bold text-xs rounded-xl flex items-center gap-1.5">
                      <Send size={13} /> Submit Answer
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-xs">
                      <h4 className="font-bold text-emerald-300">Feedback Summary</h4>
                      <p className="text-slate-300">{interviewFeedback.correctness}</p>
                      <button onClick={startInterview} className="mt-2 px-3 py-1.5 bg-white/10 text-white rounded-lg font-semibold">Next Question</button>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          )}

          {activeTab === "ready" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassCard className="p-5 text-center">
                <div className="text-2xl font-bold text-cyan-400">{actualStrengths.length}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Skills Mastered</div>
              </GlassCard>
              <GlassCard className="p-5 text-center">
                <div className="text-2xl font-bold text-white">{projects.length}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Projects</div>
              </GlassCard>
              <GlassCard className="p-5 text-center">
                <div className="text-2xl font-bold text-white">{certs.length}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Certifications</div>
              </GlassCard>
              <GlassCard className="p-5 text-center">
                <div className="text-2xl font-bold text-amber-400">{actualGaps.length}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Remaining Gaps</div>
              </GlassCard>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MILESTONE NODE DETAILS MODAL                              */}
      {/* ============================================================ */}
      <ModalShell
        open={!!selectedNode}
        title={selectedNode?.title || "Milestone Details"}
        subtitle={`${selectedNode?.stage || "Milestone"} · ${selectedNode?.hours || ""}`}
        icon={BookOpen}
        onClose={() => setSelectedNode(null)}
      >
        {selectedNode && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
              <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Sparkles size={14} /> Relevance to {targetCareer}
              </h4>
              <p>{selectedNode.relevance || selectedNode.desc}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overview</h4>
              <p className="text-sm text-slate-200 leading-relaxed">{selectedNode.desc}</p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  setActiveLearningModule(selectedNode);
                  setSelectedNode(null);
                  setLearningCompleted(false);
                }}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#060911] font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BookOpen size={15} /> Start Learning Module
              </button>

              <button
                onClick={async () => {
                  await handleMarkComplete(selectedNode);
                  setSelectedNode(null);
                }}
                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                  selectedNode.status === "completed"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                }`}
              >
                {selectedNode.status === "completed" ? "✓ Completed" : "Mark Complete"}
              </button>
            </div>
          </div>
        )}
      </ModalShell>

      {/* ============================================================ */}
      {/* 6. INTERACTIVE LEARNING MODULE VIEW (SECTION 8)               */}
      {/* ============================================================ */}
      <ModalShell
        open={!!activeLearningModule}
        title={`Learning Module: ${activeLearningModule?.title || ""}`}
        subtitle={`${targetCareer} · ${activeLearningModule?.hours || "Estimated 3 hours"}`}
        icon={BookOpen}
        onClose={() => setActiveLearningModule(null)}
      >
        {activeLearningModule && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
              <span className="font-semibold text-cyan-300">Topic: {activeLearningModule.title}</span>
              <span className="text-slate-400">Target Role: {targetCareer}</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">Lesson Core Concepts</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In this module, you'll master the practical implementation of <strong>{activeLearningModule.title}</strong> for real-world production environments in <strong>{targetCareer}</strong>.
              </p>
            </div>

            {/* Formatted Code Explanation */}
            <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">// Code Implementation Pattern</div>
              <pre>{`// ${activeLearningModule.title} for ${targetCareer}
export async function initializeModule(config) {
  const result = await processData(config);
  return { status: "ready", data: result };
}`}</pre>
            </div>

            {/* Action & Completion Control */}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <button
                onClick={async () => {
                  await handleMarkComplete(activeLearningModule);
                }}
                disabled={learningCompleted}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  learningCompleted
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-cyan-500 hover:bg-cyan-400 text-[#060911] shadow-lg shadow-cyan-500/20 cursor-pointer"
                }`}
              >
                {learningCompleted ? <><Check size={16} /> Progress Saved & Milestone Completed!</> : "Mark Complete"}
              </button>

              {learningCompleted && (
                <p className="text-[11px] text-emerald-400 text-center font-medium">
                  ✓ Milestone saved to Supabase! Visual path position advanced.
                </p>
              )}
            </div>
          </div>
        )}
      </ModalShell>

    </div>
  );
}

export default RoadmapView;
