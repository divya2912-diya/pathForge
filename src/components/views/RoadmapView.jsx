import React, { useState, useEffect } from "react";
import {
  Target, ChevronDown, CheckCircle2, Lock, ArrowRight, BookOpen, PlayCircle, ExternalLink, Activity, Trophy, Circle, Map, Compass, BrainCircuit, SearchCode
} from "lucide-react";
import { generateCareerJourney } from "../../data/userProfile";
import { loadMilestoneProgress, saveMilestoneProgress } from "../../data/supabaseAuth";
import { SKILL_REQUIREMENTS } from "../../data/userProfile";

export function RoadmapView({ student, onUpdateStudent }) {
  const [journeyData, setJourneyData] = useState(null);
  const [activeStage, setActiveStage] = useState(null);
  const [activeSkill, setActiveSkill] = useState(null);
  const [dbProgress, setDbProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingCareer, setIsChangingCareer] = useState(false);

  // Load progress from Supabase
  useEffect(() => {
    async function init() {
      if (!student) return;
      setIsLoading(true);
      const targetCareer = student.targetCareer || "Software Engineer";
      
      const loadedProgress = await loadMilestoneProgress(targetCareer);
      setDbProgress(loadedProgress);
      
      const journey = generateCareerJourney(student);
      setJourneyData(journey);
      
      // Auto-select current stage and first skill
      if (journey.currentStage) {
        setActiveStage(journey.currentStage.id);
        if (journey.currentStage.skills.length > 0) {
          setActiveSkill(journey.currentStage.skills[0]);
        }
      }
      setIsLoading(false);
    }
    init();
  }, [student]);

  const handleCareerChange = (newCareer) => {
    setIsChangingCareer(false);
    if (onUpdateStudent) {
      onUpdateStudent({ targetCareer: newCareer });
    }
  };

  const toggleTask = (skillId, taskId, currentChecked) => {
    const key = `${skillId}_${taskId}`;
    const newVal = currentChecked ? 0 : 1; // 1 for checked, 0 for unchecked
    
    setDbProgress(prev => ({ ...prev, [key]: newVal }));
    
    // Save to supabase using the career as partition
    const career = student?.targetCareer || "Software Engineer";
    saveMilestoneProgress(career, key, newVal);
  };

  // Helper to check if task is checked from db OR initial generation
  const isTaskChecked = (skillId, taskId, initialChecked) => {
    const key = `${skillId}_${taskId}`;
    if (dbProgress[key] !== undefined) {
      return dbProgress[key] === 1;
    }
    return initialChecked;
  };

  // Recalculate skill progress on the fly
  const getSkillProgress = (skill) => {
    if (!skill.tasks || skill.tasks.length === 0) return skill.status === "COMPLETED" ? 100 : 0;
    const completed = skill.tasks.filter(t => isTaskChecked(skill.id, t.id, t.checked)).length;
    return Math.round((completed / skill.tasks.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Activity className="w-8 h-8 animate-spin mb-4 text-cyan-400" />
        <p>Generating your personalized Career Skill Journey...</p>
      </div>
    );
  }

  if (!journeyData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Compass className="w-16 h-16 text-cyan-400/50 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Let's build your career journey</h2>
        <p className="text-slate-400 mb-6 max-w-md">Select your target career to generate a personalized roadmap of skills and projects.</p>
        <button 
          onClick={() => setIsChangingCareer(true)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          Choose Career Goal
        </button>
      </div>
    );
  }

  const { targetCareer, overallProgress, totalCompletedSkills, totalJourneySkills, currentStage, stages } = journeyData;
  const activeStageData = stages.find(s => s.id === activeStage);
  
  // Re-evaluate overall progress including DB overrides
  let realCompletedSkills = 0;
  stages.forEach(stage => {
    stage.skills.forEach(skill => {
      if (getSkillProgress(skill) === 100) realCompletedSkills++;
    });
  });
  const realOverallProgress = totalJourneySkills > 0 ? Math.round((realCompletedSkills / totalJourneySkills) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Header / Career Summary */}
      <div className="relative z-50 bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-wider uppercase">
            <Compass className="w-4 h-4" />
            Career Skill Journey
          </div>
          
          <div className="relative">
            {isChangingCareer ? (
              <div className="absolute top-0 left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-2 z-50 flex flex-col gap-1 w-72">
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
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 cursor-pointer group" onClick={() => setIsChangingCareer(!isChangingCareer)}>
              {targetCareer}
              <ChevronDown className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
            </h1>
          </div>
          <p className="text-slate-400">Your personalized path from current skills to career readiness.</p>
        </div>

        <div className="flex items-center gap-6 bg-slate-950/50 p-4 rounded-xl border border-white/5 min-w-[280px]">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-300">Overall Progress</span>
              <span className="text-cyan-400">{realOverallProgress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${realOverallProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Skills: {realCompletedSkills} / {totalJourneySkills}</span>
              <span>Stage: {currentStage?.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* Left Column: Timeline Journey */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-cyan-400" />
            Journey Stages
          </h2>
          
          <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {stages.map((stage, idx) => {
              
              // Recalculate stage progress dynamically
              let stageRealCompleted = 0;
              stage.skills.forEach(skill => {
                if (getSkillProgress(skill) === 100) stageRealCompleted++;
              });
              const stageRealProgress = stage.skills.length > 0 ? Math.round((stageRealCompleted / stage.skills.length) * 100) : (stage.project ? 0 : 100);
              
              const isCompleted = stageRealProgress === 100 && stage.id !== "stage_3";
              const isInProgress = stage.status === "IN PROGRESS";
              const isLocked = stage.status === "LOCKED";
              const isActive = activeStage === stage.id;

              return (
                <div key={stage.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_2px_rgba(30,41,59,1)] z-10">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : isInProgress ? (
                      <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)] animate-pulse" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-slate-600" />
                    ) : (
                      <div className="w-2 h-2 bg-slate-500 rounded-full" />
                    )}
                  </div>
                  
                  <div 
                    onClick={() => {
                      setActiveStage(stage.id);
                      if (stage.skills.length > 0) setActiveSkill(stage.skills[0]);
                      else setActiveSkill(null);
                    }}
                    className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-all cursor-pointer overflow-hidden relative ${
                      isActive 
                        ? "bg-slate-800/80 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]" 
                        : "bg-slate-900/40 border-white/5 hover:bg-slate-800/40 hover:border-white/10"
                    } ${isLocked ? "opacity-60 grayscale hover:grayscale-0" : ""}`}
                  >
                    {isInProgress && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                    )}
                    
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-bold tracking-widest text-slate-500 mb-1">0{idx + 1}</div>
                      {isInProgress && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">You are here</span>}
                    </div>
                    
                    <h3 className={`font-semibold mb-1 ${isActive ? "text-white" : "text-slate-200"}`}>{stage.title}</h3>
                    
                    <div className="flex items-center gap-2 mt-3 mb-1">
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${isCompleted ? "bg-green-500" : "bg-cyan-500"}`} style={{ width: `${stageRealProgress}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-400 w-8 text-right">{stageRealProgress}%</span>
                    </div>
                    
                    <p className="text-xs text-slate-500 mt-2">{stage.skills.length > 0 ? `${stageRealCompleted} of ${stage.skills.length} skills completed` : "Project Stage"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Stage Detail & Skills */}
        <div className="lg:col-span-7 xl:col-span-8">
          {activeStageData ? (
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 lg:p-8 min-h-[600px] flex flex-col xl:flex-row gap-8">
              
              {/* Skills List */}
              <div className="flex-1 xl:w-1/2 space-y-4 flex flex-col">
                <div className="mb-6 shrink-0">
                  <h2 className="text-2xl font-bold text-white mb-2">{activeStageData.title}</h2>
                  <p className="text-slate-400 text-sm">{activeStageData.desc}</p>
                </div>
                
                {activeStageData.skills.length === 0 && activeStageData.project ? (
                   <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 text-center flex-1 flex flex-col items-center justify-center">
                     <Trophy className="w-10 h-10 text-indigo-400 mb-3" />
                     <h3 className="font-semibold text-white mb-2">{activeStageData.project.title}</h3>
                     <p className="text-sm text-slate-400 mb-6 max-w-sm">{activeStageData.project.desc}</p>
                     <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                        Start Project
                        <ArrowRight className="w-4 h-4" />
                     </button>
                   </div>
                ) : (
                  <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {activeStageData.skills.map((skill) => {
                      const skillProg = getSkillProgress(skill);
                      const isSkillActive = activeSkill?.id === skill.id;
                      const isSkillDone = skillProg === 100;
                      
                      return (
                        <div 
                          key={skill.id}
                          onClick={() => setActiveSkill(skill)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSkillActive 
                              ? "bg-slate-800 border-slate-600" 
                              : "bg-slate-950/50 border-white/5 hover:bg-slate-800/50 hover:border-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {isSkillDone ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                              ) : skillProg > 0 ? (
                                <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-l-transparent animate-spin-slow" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-600" />
                              )}
                              <h4 className={`font-medium ${isSkillDone ? "text-slate-300 line-through decoration-slate-600" : "text-white"}`}>{skill.name}</h4>
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-slate-900 rounded text-slate-400">{skillProg}%</span>
                          </div>
                          
                          <div className="flex justify-between text-xs text-slate-500 mt-2 ml-8">
                            <span>Imp: <span className="text-slate-300">{skill.importance}</span></span>
                            <span>{skill.estimatedHours} hrs</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Skill Detail Panel */}
              {activeStageData.skills.length > 0 && activeSkill ? (
                <div className="flex-1 xl:w-1/2 bg-slate-950/50 rounded-xl border border-white/5 p-6 flex flex-col">
                  
                  <div className="mb-6 pb-6 border-b border-white/5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white">{activeSkill.name}</h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getSkillProgress(activeSkill) === 100 ? "bg-green-500/10 text-green-400" : "bg-cyan-500/10 text-cyan-400"}`}>
                        {getSkillProgress(activeSkill) === 100 ? "Mastered" : "Learning"}
                      </span>
                    </div>
                    
                    <div className="text-sm text-slate-300 space-y-4">
                      <div>
                        <span className="text-slate-500 block text-xs uppercase font-semibold mb-1">Why you need this</span>
                        <p>{activeSkill.why}</p>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="bg-slate-900 px-3 py-2 rounded-lg flex-1">
                          <span className="text-xs text-slate-500 block">Target Role</span>
                          <span className="text-sm font-medium text-white">{targetCareer}</span>
                        </div>
                        <div className="bg-slate-900 px-3 py-2 rounded-lg flex-1">
                          <span className="text-xs text-slate-500 block">Est. Time</span>
                          <span className="text-sm font-medium text-white">{activeSkill.estimatedHours}h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tasks */}
                  <div className="mb-6">
                    <span className="text-slate-500 block text-xs uppercase font-semibold mb-3">Learning Tasks</span>
                    <div className="space-y-2">
                      {activeSkill.tasks.map((task) => {
                        const checked = isTaskChecked(activeSkill.id, task.id, task.checked);
                        return (
                          <label key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-white/5 transition-colors group">
                            <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
                              <input 
                                type="checkbox" 
                                className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded bg-slate-900 checked:bg-cyan-500 checked:border-cyan-500 cursor-pointer transition-all"
                                checked={checked}
                                onChange={() => toggleTask(activeSkill.id, task.id, checked)}
                              />
                              <CheckCircle2 className="absolute w-3.5 h-3.5 text-slate-900 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                            </div>
                            <span className={`text-sm select-none transition-colors ${checked ? "text-slate-500 line-through" : "text-slate-200 group-hover:text-white"}`}>{task.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Resources */}
                  <div className="mt-auto">
                    <span className="text-slate-500 block text-xs uppercase font-semibold mb-3">Curated Resources</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeSkill.resources.map((res, i) => (
                        <a key={i} href={res.url} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 transition-colors group">
                          {res.type === "Video" ? <PlayCircle className="w-4 h-4 text-rose-400 shrink-0" /> :
                           res.type === "Documentation" ? <BookOpen className="w-4 h-4 text-blue-400 shrink-0" /> :
                           res.type === "Project" ? <SearchCode className="w-4 h-4 text-purple-400 shrink-0" /> :
                           <BrainCircuit className="w-4 h-4 text-amber-400 shrink-0" />}
                          <span className="text-xs font-medium text-slate-300 truncate group-hover:text-white">{res.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-600 ml-auto group-hover:text-cyan-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                  
                </div>
              ) : null}
            </div>
          ) : (
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 h-full min-h-[400px] flex items-center justify-center">
               <p className="text-slate-500 text-sm">Select a stage to view details</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Completed Section */}
      {realCompletedSkills > 0 && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-6">
           <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Completed Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {stages.flatMap(stage => stage.skills).filter(s => getSkillProgress(s) === 100).map(skill => (
               <div key={skill.id} className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-sm font-medium text-green-400">
                 <CheckCircle2 className="w-4 h-4" />
                 {skill.name}
               </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default RoadmapView;
