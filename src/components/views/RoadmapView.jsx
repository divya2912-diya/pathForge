import React, { useState, useEffect } from "react";
import {
  Target, ChevronDown, CheckCircle2, Lock, ArrowRight, BookOpen, PlayCircle, ExternalLink, Activity, Trophy, Circle, Map, Compass, BrainCircuit, SearchCode, Send
} from "lucide-react";
import { loadMilestoneProgress, saveMilestoneProgress } from "../../data/supabaseAuth";
import { SKILL_REQUIREMENTS } from "../../data/userProfile";

export function RoadmapView({ student, onUpdateStudent, go }) {
  const [dbProgress, setDbProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingCareer, setIsChangingCareer] = useState(false);
  const [activeTab, setActiveTab] = useState("foundation");
  
  // Interview Prep State
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [interviewQuestion, setInterviewQuestion] = useState("");
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewFeedback, setInterviewFeedback] = useState(null);

  // Load progress
  useEffect(() => {
    async function init() {
      if (!student) return;
      setIsLoading(true);
      const targetCareer = student.targetCareer;
      if (targetCareer) {
        const loadedProgress = await loadMilestoneProgress(targetCareer);
        setDbProgress(loadedProgress);
      }
      setIsLoading(false);
    }
    init();
  }, [student]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Activity className="w-8 h-8 animate-spin mb-4 text-cyan-400" />
        <p>Loading your career data...</p>
      </div>
    );
  }

  // --------------------------------------------------------
  // EMPTY STATES
  // --------------------------------------------------------
  if (!student?.targetCareer) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Compass className="w-16 h-16 text-cyan-400/50 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your career journey hasn't been generated yet.</h2>
        <p className="text-slate-400 mb-6 max-w-md">Select your target career to generate your personalized roadmap.</p>
        <button 
          onClick={() => go("career")}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:from-cyan-400 transition-all"
        >
          Choose Career Goal
        </button>
      </div>
    );
  }

  if (!student.skills || student.skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Target className="w-16 h-16 text-cyan-400/50 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">We need to know your skills</h2>
        <p className="text-slate-400 mb-6 max-w-md">Add your skills to calculate your skill gaps.</p>
        <button 
          onClick={() => go("profile")}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:from-cyan-400 transition-all"
        >
          Add Skills
        </button>
      </div>
    );
  }

  // --------------------------------------------------------
  // DATA CALCULATION (STRICTLY FROM AUTHENTICATED USER)
  // --------------------------------------------------------
  const targetCareer = student.targetCareer;
  const userSkills = (student.skills || []).map(s => s.toLowerCase());
  const userSkillsList = (student.userSkillsList || []).map(s => s.name.toLowerCase());
  const allUserSkills = new Set([...userSkills, ...userSkillsList]);

  const requiredSkills = SKILL_REQUIREMENTS[targetCareer] || [];
  
  const isMastered = (skill) => {
    return Array.from(allUserSkills).some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s));
  };

  const actualGaps = requiredSkills.filter(req => !isMastered(req));
  const actualStrengths = requiredSkills.filter(req => isMastered(req));
  
  const totalRequired = requiredSkills.length;
  const progressPercent = totalRequired === 0 ? 100 : Math.round((actualStrengths.length / totalRequired) * 100);

  const nextStep = actualGaps.length > 0 ? actualGaps[0] : null;

  // Split into foundation vs specialization (just taking first half vs second half of requirements as a generic proxy, 
  // since we don't have a rigid DB schema for 'specialization' specifically)
  const half = Math.ceil(requiredSkills.length / 2);
  const foundationSkills = requiredSkills.slice(0, half);
  const specSkills = requiredSkills.slice(half);

  const projects = student.projectsList || [];
  const certs = student.certificationsList || [];
  const assessments = student.assessments || [];

  // Toggle skill progress manually
  const toggleSkill = (skill) => {
    const key = `skill_${skill.replace(/\s+/g, '_').toLowerCase()}`;
    const currentVal = dbProgress[key] === 1 ? 0 : 1;
    setDbProgress(prev => ({ ...prev, [key]: currentVal }));
    saveMilestoneProgress(targetCareer, key, currentVal);
  };

  const isSkillDbCompleted = (skill) => {
    const key = `skill_${skill.replace(/\s+/g, '_').toLowerCase()}`;
    return dbProgress[key] === 1;
  };

  // Interview Prep Handler
  const startInterview = () => {
    if (actualGaps.length > 0) {
       setInterviewQuestion(`Explain the core concepts of ${actualGaps[0]} and how it applies to a ${targetCareer} role.`);
    } else {
       setInterviewQuestion(`Describe a complex problem you solved using ${actualStrengths[0] || 'your skills'}.`);
    }
    setIsInterviewing(true);
    setInterviewAnswer("");
    setInterviewFeedback(null);
  };

  const submitInterview = () => {
    if (!interviewAnswer.trim()) return;
    setInterviewFeedback({
      correctness: "Good start, but needs more technical depth.",
      points: ["Mention specific architectural patterns", "Discuss performance implications"],
      revise: nextStep || "System Design"
    });
  };

  const handleCareerChange = (newCareer) => {
    setIsChangingCareer(false);
    if (onUpdateStudent) {
      onUpdateStudent({ targetCareer: newCareer });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. YOUR CURRENT POSITION */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 lg:p-8">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Your Current Position</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Target Career</span>
            <div className="relative z-50">
              {isChangingCareer ? (
                <div className="absolute top-8 left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-2 flex flex-col gap-1 w-72">
                  {Object.keys(SKILL_REQUIREMENTS).map(career => (
                    <button 
                      key={career} 
                      onClick={() => handleCareerChange(career)}
                      className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${career === targetCareer ? "bg-cyan-500/20 text-cyan-300" : "text-slate-300 hover:bg-white/5"}`}
                    >
                      {career}
                    </button>
                  ))}
                  <button onClick={() => setIsChangingCareer(false)} className="mt-2 text-xs text-slate-500 hover:text-slate-300 text-center">Cancel</button>
                </div>
              ) : null}
              <div 
                className="text-lg font-bold text-white flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition-colors"
                onClick={() => setIsChangingCareer(!isChangingCareer)}
              >
                {targetCareer}
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Current Progress</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-cyan-400">{progressPercent}%</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Skill Gaps</span>
            <div className="flex flex-wrap gap-2">
              {actualGaps.length > 0 ? actualGaps.slice(0, 4).map(gap => (
                <span key={gap} className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-xs font-medium">
                  {gap}
                </span>
              )) : (
                <span className="text-sm text-green-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> No gaps!</span>
              )}
              {actualGaps.length > 4 && <span className="text-xs text-slate-500 py-1">+{actualGaps.length - 4} more</span>}
            </div>
          </div>
        </div>
      </div>

      {/* 2. NEXT STEP */}
      <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/20 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-2">Next Step</h2>
          {nextStep ? (
            <>
              <h3 className="text-2xl font-bold text-white mb-1">Learn {nextStep}</h3>
              <p className="text-slate-300">{nextStep} is currently one of your highest-priority skill gaps.</p>
            </>
          ) : (
             <>
              <h3 className="text-2xl font-bold text-white mb-1">You are fully prepared!</h3>
              <p className="text-slate-300">Complete your profile or take assessments to prove your readiness.</p>
            </>
          )}
        </div>
        
        {nextStep ? (
           <button onClick={() => setActiveTab("foundation")} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl whitespace-nowrap transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]">
             Start Learning
           </button>
        ) : (
           <button onClick={() => go("profile")} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl whitespace-nowrap transition-colors border border-white/10">
             Go to Profile
           </button>
        )}
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-white/5 pb-px custom-scrollbar">
        {["foundation", "specialization", "projects", "interview", "ready"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
            }`}
          >
            {tab === "ready" ? "Career Ready" : tab === "interview" ? "Interview Prep" : tab}
          </button>
        ))}
      </div>

      {/* 3. FOUNDATION & 4. SPECIALIZATION */}
      {(activeTab === "foundation" || activeTab === "specialization") && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">{activeTab === "foundation" ? "Foundation & Core Skills" : "Specialization Skills"}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(activeTab === "foundation" ? foundationSkills : specSkills).map(skill => {
              const profileMastered = isMastered(skill);
              const dbCompleted = isSkillDbCompleted(skill);
              const isCompleted = profileMastered || dbCompleted;
              
              return (
                <div key={skill} className="bg-slate-900/50 border border-white/5 p-5 rounded-xl flex flex-col h-full group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`font-semibold text-lg ${isCompleted ? "text-slate-300" : "text-white"}`}>{skill}</h3>
                    <div onClick={() => toggleSkill(skill)} className="cursor-pointer" title={isCompleted ? "Mark as not started" : "Mark as completed"}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${isCompleted ? "bg-green-500/10 text-green-400" : "bg-slate-800 text-slate-400"}`}>
                      {isCompleted ? "Completed" : "Not Started"}
                    </span>
                    {!isCompleted && (
                       <a href={`https://www.google.com/search?q=Learn+${encodeURIComponent(skill)}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                         Find Resources <ExternalLink className="w-3 h-3" />
                       </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. PROJECTS */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-white">Recommended Projects</h2>
             <button onClick={() => go("projects")} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">View All Projects &rarr;</button>
          </div>
          
          {projects.length === 0 ? (
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-8 text-center">
              <SearchCode className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No project has been assigned yet.</h3>
              <p className="text-slate-400 mb-6 text-sm max-w-md mx-auto">Projects prove your skills to employers. Generate a project based on your current skill gaps.</p>
              <button onClick={() => go("projects")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors">
                Generate Recommended Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(p => (
                <div key={p.id || p.title} className="bg-slate-900/50 border border-white/5 rounded-xl p-5 flex flex-col">
                  <h3 className="font-bold text-white mb-1">{p.title}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{p.description}</p>
                  
                  <div className="mt-auto">
                    <button onClick={() => go("projects")} className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-semibold transition-colors w-full flex items-center justify-center gap-2">
                      <PlayCircle className="w-4 h-4" /> Start Project Workspace
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. INTERVIEW PREPARATION */}
      {activeTab === "interview" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Interview Preparation</h2>
          
          {assessments.length === 0 ? (
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-8 text-center">
              <BrainCircuit className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Complete your first assessment to begin.</h3>
              <p className="text-slate-400 mb-6 text-sm">We need data on your strengths and weaknesses to tailor your interview questions.</p>
              <button onClick={() => go("analyzing")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors">
                Take Initial Assessment
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6">
              {!isInterviewing ? (
                <div className="text-center py-10">
                  <h3 className="text-2xl font-bold text-white mb-2">Technical Screen Practice</h3>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto">Answer a generated question based on your {targetCareer} skill requirements.</p>
                  <button onClick={startInterview} className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-colors">
                    Start Interview Prep
                  </button>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Question</span>
                    <h3 className="text-xl font-bold text-white mt-1">{interviewQuestion}</h3>
                  </div>
                  
                  <textarea
                    value={interviewAnswer}
                    onChange={(e) => setInterviewAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 resize-none"
                  />
                  
                  {!interviewFeedback ? (
                    <button onClick={submitInterview} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-colors flex items-center gap-2">
                      <Send className="w-4 h-4" /> Submit Answer
                    </button>
                  ) : (
                    <div className="bg-slate-950/50 border border-green-500/20 p-5 rounded-xl space-y-3">
                       <h4 className="font-bold text-green-400">Feedback</h4>
                       <p className="text-sm text-slate-300">{interviewFeedback.correctness}</p>
                       <div>
                         <span className="text-xs text-slate-500 font-semibold uppercase">Suggested Points:</span>
                         <ul className="list-disc list-inside text-sm text-slate-300 mt-1">
                           {interviewFeedback.points.map((pt, i) => <li key={i}>{pt}</li>)}
                         </ul>
                       </div>
                       <div>
                         <span className="text-xs text-slate-500 font-semibold uppercase">Topic to Revise:</span>
                         <p className="text-sm text-amber-400">{interviewFeedback.revise}</p>
                       </div>
                       
                       <button onClick={startInterview} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors">
                         Next Question
                       </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 7. CAREER READY */}
      {activeTab === "ready" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Career Ready Metrics</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">{actualStrengths.length}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Skills Completed</div>
            </div>
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-white mb-1">{projects.length}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Projects Completed</div>
            </div>
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-white mb-1">{certs.length}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Certifications</div>
            </div>
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-amber-400 mb-1">{actualGaps.length}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Skill Gaps Remaining</div>
            </div>
          </div>
          
          {actualGaps.length > 0 && (
            <div className="bg-slate-900/50 border border-amber-500/20 p-6 rounded-xl">
              <h3 className="font-bold text-amber-400 mb-3">Your remaining focus areas</h3>
              <div className="flex flex-wrap gap-2">
                {actualGaps.map(gap => (
                  <span key={gap} className="px-3 py-1.5 bg-slate-950 border border-white/5 rounded-lg text-sm text-slate-300">
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default RoadmapView;
