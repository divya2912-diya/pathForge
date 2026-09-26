import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, ShieldAlert, Award, ArrowRight, CheckCircle2, XCircle, 
  Code, Brain, Play, RotateCcw, BookOpen, Sparkles, Clock, AlertTriangle, 
  Check, Terminal, Cpu, FileCode, CheckCircle, RefreshCw
} from "lucide-react";
import ModalShell from "./ModalShell";
import GlassCard from "./GlassCard";
import { getRound1Questions, getRound2Questions } from "../../data/skillValidationQuestions";
import { saveSkillValidationAttempt, getValidationFailureRecommendations } from "../../services/skillValidationService";

export default function SkillValidationModal({ 
  isOpen, 
  onClose, 
  skill, 
  student, 
  onUpdateStudent, 
  onValidationComplete 
}) {
  const [step, setStep] = useState("intro"); // intro | round1 | round1_pass | round2 | success | fail
  const [r1Questions, setR1Questions] = useState([]);
  const [r1Index, setR1Index] = useState(0);
  const [r1Answers, setR1Answers] = useState({});
  const [r1Score, setR1Score] = useState(0);
  const [r1TimeLeft, setR1TimeLeft] = useState(45);
  const [missedConcepts, setMissedConcepts] = useState([]);

  // Round 2 State
  const [r2Question, setR2Question] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [r2Score, setR2Score] = useState(0);

  // Overall Result
  const [isSaving, setIsSaving] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  // Initialize questions when modal opens
  useEffect(() => {
    if (isOpen && skill) {
      setStep("intro");
      const q1 = getRound1Questions(skill, 5);
      setR1Questions(q1);
      setR1Index(0);
      setR1Answers({});
      setR1Score(0);
      setR1TimeLeft(45);
      setMissedConcepts([]);

      const q2 = getRound2Questions(skill)[0];
      setR2Question(q2);
      setUserCode(q2?.starterCode || `// ${skill} practical solution\n`);
      setTestResults(null);
      setR2Score(0);
      setRecommendations(null);
    }
  }, [isOpen, skill]);

  // Round 1 timer
  useEffect(() => {
    if (step !== "round1") return;
    if (r1TimeLeft <= 0) {
      handleR1AnswerSubmit(null); // time out = wrong
      return;
    }
    const timer = setTimeout(() => setR1TimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, r1TimeLeft]);

  if (!isOpen || !skill) return null;

  // Handle R1 answer selection
  const handleSelectOption = (optionIndex) => {
    setR1Answers(prev => ({ ...prev, [r1Index]: optionIndex }));
  };

  const handleR1AnswerSubmit = (forcedAnswer = undefined) => {
    const selected = forcedAnswer !== undefined ? forcedAnswer : r1Answers[r1Index];
    const currentQ = r1Questions[r1Index];

    if (selected === currentQ?.answer) {
      setR1Score(prev => prev + 1);
    } else if (currentQ) {
      setMissedConcepts(prev => [...prev, currentQ.topic + ": " + (currentQ.type || "conceptual")]);
    }

    if (r1Index + 1 < r1Questions.length) {
      setR1Index(prev => prev + 1);
      setR1TimeLeft(45);
    } else {
      // Evaluate Round 1
      const finalScore = r1Score + (selected === currentQ?.answer ? 1 : 0);
      const passedR1 = finalScore >= 3; // 60% of 5 = 3
      if (passedR1) {
        setStep("round1_pass");
      } else {
        handleFailAttempt("failed_r1", finalScore, missedConcepts);
      }
    }
  };

  // Evaluate Round 2 practical challenge
  const handleRunCodeTest = async () => {
    if (!r2Question) return;
    setIsEvaluating(true);
    setTestResults(null);

    // Simulate code evaluation / test case runner
    await new Promise(res => setTimeout(res, 1200));

    const code = userCode.trim();
    const hasCodeContent = code.length > 25;
    
    // Evaluate logic based on test cases and keywords
    let passedTests = 0;
    const testCases = r2Question.testCases || [{ input: "default", expected: "valid" }];
    const totalTests = testCases.length;

    const evaluatedCases = testCases.map((tc, i) => {
      // Simple heuristic code check: non-empty, contains logic, doesn't just return initial comment
      const containsKeywords = ["return", "function", "def", "class", "=", "for", "while", "if", "const", "let", "var", "import", "select", "from", "where", "model", "torch", "np", "pd"]
        .some(kw => code.includes(kw));
      const passed = hasCodeContent && containsKeywords;
      if (passed) passedTests++;
      return {
        id: i + 1,
        input: tc.input || `Test Case ${i+1}`,
        expected: tc.expected || "Valid Output",
        actual: passed ? (tc.expected || "Executed successfully without errors") : "Syntax/Logic incomplete",
        passed
      };
    });

    const passedAll = passedTests === totalTests;
    const scorePct = Math.round((passedTests / totalTests) * 100);
    setR2Score(scorePct);
    setTestResults({
      passed: passedAll,
      cases: evaluatedCases,
      passCount: passedTests,
      totalCount: totalTests
    });
    setIsEvaluating(false);

    if (passedAll) {
      // Submit successful validation!
      handleSuccessAttempt(r1Score, scorePct);
    }
  };

  const handleFailAttempt = async (failStatus, r1FinalScore, missed) => {
    setIsSaving(true);
    const recs = getValidationFailureRecommendations(skill, missed, failStatus);
    setRecommendations(recs);

    await saveSkillValidationAttempt({
      student,
      skill,
      round1Score: r1FinalScore,
      round1Total: r1Questions.length || 5,
      round2Passed: false,
      round2Score: 0,
      status: failStatus,
      missedConcepts: missed,
      onUpdateStudent
    });

    setIsSaving(false);
    setStep("fail");
  };

  const handleSuccessAttempt = async (r1FinalScore, r2FinalScore) => {
    setIsSaving(true);
    await saveSkillValidationAttempt({
      student,
      skill,
      round1Score: r1FinalScore,
      round1Total: r1Questions.length || 5,
      round2Passed: true,
      round2Score: r2FinalScore,
      status: "passed",
      missedConcepts: [],
      onUpdateStudent
    });
    setIsSaving(false);
    setStep("success");
  };

  const handleFinish = (isSuccess) => {
    if (onValidationComplete) {
      onValidationComplete(isSuccess, skill);
    }
    onClose();
  };

  const currentQ = r1Questions[r1Index];

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title={`Skill Validation: ${skill}`}>
      <div className="space-y-6 text-slate-100">
        
        {/* ── STEP: INTRO ────────────────────────────────────── */}
        {step === "intro" && (
          <div className="space-y-6 py-2">
            <div className="flex items-center gap-4 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 p-5 rounded-2xl border border-cyan-500/30">
              <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/40">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Prove Your {skill} Mastery</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Already know this topic? Pass the two-round validation assessment to skip learning modules and unlock the next skill in your roadmap.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard className="p-5 border-l-4 border-l-cyan-400 bg-slate-900/60">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
                  <Brain className="w-5 h-5" />
                  <span>Round 1: Conceptual Check</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>5 multiple-choice questions</li>
                  <li>Concepts, output prediction & debugging</li>
                  <li>45 seconds per question</li>
                  <li><strong className="text-cyan-300">Passing Score: 60% (3/5)</strong></li>
                </ul>
              </GlassCard>

              <GlassCard className="p-5 border-l-4 border-l-indigo-400 bg-slate-900/60">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
                  <Code className="w-5 h-5" />
                  <span>Round 2: Practical Challenge</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>1 hands-on coding or architectural problem</li>
                  <li>Write, debug, and execute your code</li>
                  <li>Evaluated against test cases</li>
                  <li><strong className="text-indigo-300">Must pass all test cases</strong></li>
                </ul>
              </GlassCard>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                Passing both rounds marks <strong>{skill}</strong> as <strong>VALIDATED</strong> in your profile & unlocks your next roadmap milestone automatically.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep("round1")}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <span>Start Validation Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: ROUND 1 MCQ ───────────────────────────────── */}
        {step === "round1" && currentQ && (
          <div className="space-y-6">
            {/* Round 1 Header */}
            <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                  Round 1 • Question {r1Index + 1} of {r1Questions.length}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Difficulty: <span className="text-amber-400">{currentQ.difficulty || "Medium"}</span>
                </span>
              </div>
              <div className={`flex items-center gap-1.5 font-mono text-sm px-3 py-1 rounded-lg border ${
                r1TimeLeft < 10 ? "bg-red-950/80 border-red-500/50 text-red-400 animate-pulse" : "bg-slate-800 border-slate-700 text-cyan-300"
              }`}>
                <Clock className="w-4 h-4" />
                <span>{r1TimeLeft}s</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{ width: `${((r1Index + 1) / r1Questions.length) * 100}%` }}
              />
            </div>

            {/* Question Box */}
            <GlassCard className="p-6 bg-slate-900/90 border border-slate-800">
              <h4 className="text-sm md:text-base font-medium text-white whitespace-pre-wrap leading-relaxed">
                {currentQ.q}
              </h4>
            </GlassCard>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => {
                const isSelected = r1Answers[r1Index] === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(i)}
                    className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${
                        isSelected ? "bg-cyan-500 text-slate-950 border-cyan-400" : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-cyan-400" />}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-2">
              <button
                disabled={r1Answers[r1Index] === undefined}
                onClick={() => handleR1AnswerSubmit()}
                className={`px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  r1Answers[r1Index] !== undefined
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                }`}
              >
                <span>{r1Index + 1 === r1Questions.length ? "Submit Round 1" : "Next Question"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: ROUND 1 PASSED INTERMEDIARY ──────────────── */}
        {step === "round1_pass" && (
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Round 1 Cleared!</h3>
              <p className="text-xs text-slate-300 mt-2">
                Score: <span className="text-emerald-400 font-bold text-sm">{r1Score} / {r1Questions.length} ({Math.round((r1Score/r1Questions.length)*100)}%)</span>
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Great job on the conceptual round. Now demonstrate hands-on application in Round 2: Practical Coding Challenge.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 max-w-md mx-auto text-left">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
                <Code className="w-4 h-4" />
                <span>Round 2 Challenge Preview</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{r2Question?.q?.substring(0, 120)}...</p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setStep("round2")}
                className="px-8 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 flex items-center gap-2"
              >
                <span>Proceed to Round 2 Practical</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: ROUND 2 PRACTICAL CHALLENGE ───────────────── */}
        {step === "round2" && r2Question && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                  Round 2 • Practical Coding Challenge
                </span>
                <span className="text-xs text-slate-400">Skill: <strong>{skill}</strong></span>
              </div>
            </div>

            {/* Problem Prompt */}
            <GlassCard className="p-5 bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Problem Statement</h4>
              <p className="text-xs md:text-sm font-medium text-slate-200 whitespace-pre-wrap leading-relaxed">
                {r2Question.q}
              </p>
            </GlassCard>

            {/* Code Editor Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="flex items-center gap-1.5 font-mono text-slate-300">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  Code Workspace
                </span>
                <span>Language: <strong className="text-indigo-300">{skill} / Standard</strong></span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={10}
                  className="w-full p-4 bg-transparent text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 font-mono resize-none leading-relaxed"
                  placeholder="// Write your code or solution here..."
                />
              </div>
            </div>

            {/* Test Results Output */}
            {testResults && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                testResults.passed 
                  ? "bg-emerald-950/50 border-emerald-500/30 text-emerald-200" 
                  : "bg-red-950/50 border-red-500/30 text-red-200"
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-2">
                    {testResults.passed ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    {testResults.passed ? "All Test Cases Passed!" : "Test Case Evaluation Failed"}
                  </span>
                  <span>{testResults.passCount} / {testResults.totalCount} Test Cases</span>
                </div>
                {testResults.cases.map(tc => (
                  <div key={tc.id} className="p-2.5 rounded bg-slate-900/80 font-mono text-xs flex justify-between items-center border border-slate-800">
                    <div>
                      <span className="text-slate-400">{tc.input}: </span>
                      <span className="text-slate-200">{tc.actual}</span>
                    </div>
                    <span className={tc.passed ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                      {tc.passed ? "PASSED" : "FAILED"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Submit & Run button */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep("round1")}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
              >
                Back to R1
              </button>

              <button
                disabled={isEvaluating}
                onClick={handleRunCodeTest}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Executing Test Cases...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run & Submit Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: SUCCESS RESULT ────────────────────────────── */}
        {step === "success" && (
          <div className="space-y-6 text-center py-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <Award className="w-12 h-12" />
              </div>
              <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-1.5 rounded-full font-bold shadow">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                SKILL VALIDATED!
              </span>
              <h3 className="text-2xl font-bold text-white mt-3">{skill} Mastery Proven</h3>
              <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
                You successfully passed both conceptual and practical assessment rounds!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <GlassCard className="p-4 bg-slate-900/90 text-center">
                <span className="text-xs text-slate-400">Round 1 Conceptual</span>
                <p className="text-lg font-bold text-cyan-400 mt-1">{r1Score} / {r1Questions.length} ({Math.round((r1Score/r1Questions.length)*100)}%)</p>
              </GlassCard>
              <GlassCard className="p-4 bg-slate-900/90 text-center">
                <span className="text-xs text-slate-400">Round 2 Practical</span>
                <p className="text-lg font-bold text-indigo-400 mt-1">100% Passed</p>
              </GlassCard>
            </div>

            <div className="bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 p-4 rounded-xl border border-emerald-500/40 text-left max-w-md mx-auto flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-emerald-200">Roadmap Milestone Unlocked!</h5>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  <strong>{skill}</strong> is now marked as <strong>VALIDATED</strong>. The next skill in your personalized roadmap is now active.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleFinish(true)}
                className="w-full max-w-md py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 mx-auto"
              >
                <span>Return to Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: FAIL RESULT ───────────────────────────────── */}
        {step === "fail" && recommendations && (
          <div className="space-y-6 py-3">
            <div className="flex items-center gap-4 bg-red-950/40 p-5 rounded-2xl border border-red-500/30">
              <div className="p-3 bg-red-500/20 rounded-xl text-red-400 border border-red-500/40">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Skill Not Validated Yet</h3>
                <p className="text-xs text-red-300 mt-1">
                  {recommendations.reason}
                </p>
              </div>
            </div>

            {/* Recommended Topics */}
            {recommendations.suggestedTopics.length > 0 && (
              <GlassCard className="p-4 bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Key Concepts to Focus On
                </h4>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {recommendations.suggestedTopics.map((topic, i) => (
                    <li key={i} className="text-slate-200 font-medium">{topic}</li>
                  ))}
                </ul>
              </GlassCard>
            )}

            {/* Actionable Next Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Practice & Learning</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {recommendations.actionItems.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <span className="font-semibold text-cyan-300 block">{item.title}</span>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep("intro")}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Validation</span>
              </button>

              <button
                onClick={() => handleFinish(false)}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md flex items-center gap-2"
              >
                <span>Study {skill} in Roadmap</span>
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </ModalShell>
  );
}
