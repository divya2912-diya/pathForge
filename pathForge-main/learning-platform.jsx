import React, { useState, useEffect, useRef } from "react";
import {
  Home, LayoutDashboard, Radar, Route, LayoutGrid, Sparkles, FileText, FolderKanban, Award,
  Compass, User, Settings, Send, X, ChevronRight, ChevronDown, Check,
  Clock, TrendingUp, Brain, Zap, ArrowRight, Menu, Search, Star,
  AlertTriangle, UploadCloud, BookOpen, Github, MessageCircle, Bot,
  CircleDot, Flame, Target, ShieldCheck, Database, GraduationCap,
  ArrowLeft, PlayCircle, Lock, CheckCircle2, XCircle, Loader2, Video,
  FileCode2, Layers, RefreshCw, Mail, Edit3, Camera, MapPin, ExternalLink,
  Phone, Globe, Trash2, Briefcase, DollarSign, LogIn, Eye, EyeOff, UserCheck, AlertCircle
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar,
  ResponsiveContainer, Tooltip as RTooltip
} from "recharts";

/* ============================== MOCK DATA ============================== */

const DEMO_STUDENT_CREDENTIALS = {
  email: "alex.chen@university.edu",
  studentId: "STU-2026-8941",
  password: "demoPassword123",
  role: "student",
};

const STUDENT = {
  name: "Alex Chen",
  username: "alexchen",
  email: "alex.chen@university.edu",
  degree: "B.Tech Computer Science",
  year: "3rd Year",
  targetCareer: "AI/ML Engineer",
  bio: "Aspiring AI/ML engineer focused on deep learning, neural architectures, and building intelligent web applications.",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  github: "github.com/alexchen-dev",
  linkedin: "linkedin.com/in/alexchen-ai",
  avatarColor: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
  profilePicture: null,
};

const SKILL_GROUPS = [
  {
    name: "Programming",
    level: 91,
    skills: [
      { name: "Python", level: 96 },
      { name: "Java", level: 74 },
      { name: "JavaScript", level: 63 },
    ],
  },
  {
    name: "Data & Databases",
    level: 61,
    skills: [
      { name: "SQL", level: 68 },
      { name: "Pandas / NumPy", level: 55 },
    ],
  },
  {
    name: "AI / Machine Learning",
    level: 48,
    skills: [
      { name: "Machine Learning", level: 61 },
      { name: "Deep Learning", level: 38 },
      { name: "NLP", level: 27 },
    ],
  },
  {
    name: "Tools & Systems",
    level: 24,
    skills: [
      { name: "Git", level: 70 },
      { name: "Docker", level: 12 },
      { name: "System Design", level: 9 },
    ],
  },
];

const RADAR_DATA = [
  { subject: "Programming", value: 91 },
  { subject: "Data", value: 61 },
  { subject: "ML/AI", value: 48 },
  { subject: "Systems", value: 24 },
  { subject: "Math/Stats", value: 44 },
  { subject: "Communication", value: 66 },
];

const STRENGTHS = ["Python", "Problem Solving", "Object-Oriented Design"];
const GAPS = ["Deep Learning", "Docker", "System Design"];

const ROADMAP = [
  { id: 1, title: "Python Foundations", status: "done", duration: "3 weeks", difficulty: "Beginner",
    desc: "Core syntax, data structures, functions, and file handling in Python.", relevance: "Base language for every ML/AI role." },
  { id: 2, title: "Data Structures & Algorithms", status: "done", duration: "4 weeks", difficulty: "Intermediate",
    desc: "Arrays, trees, graphs, complexity analysis and problem solving patterns.", relevance: "Required for technical interviews at every top AI company." },
  { id: 3, title: "Statistics & Probability", status: "in-progress", progress: 45, duration: "3 weeks", difficulty: "Intermediate",
    desc: "Distributions, hypothesis testing, Bayesian reasoning, linear algebra basics.", relevance: "The mathematical backbone of every ML model you'll build next." },
  { id: 4, title: "Machine Learning Foundations", status: "upcoming", duration: "5 weeks", difficulty: "Intermediate",
    desc: "Regression, classification, model evaluation, scikit-learn workflows.", relevance: "Core skill tested in 90% of AI/ML Engineer interviews." },
  { id: 5, title: "Deep Learning", status: "upcoming", duration: "5 weeks", difficulty: "Advanced",
    desc: "Neural networks, CNNs, RNNs, PyTorch/TensorFlow fundamentals.", relevance: "Your largest current skill gap — unlocks 40% more job matches." },
  { id: 6, title: "Generative AI & LLMs", status: "locked", duration: "4 weeks", difficulty: "Advanced",
    desc: "Transformers, prompt engineering, fine-tuning, embeddings.", relevance: "Fastest-growing specialization in the AI job market right now." },
  { id: 7, title: "Retrieval-Augmented Generation (RAG)", status: "locked", duration: "3 weeks", difficulty: "Advanced",
    desc: "Vector databases, retrieval pipelines, grounding AI answers in real sources.", relevance: "Differentiates you for production-grade AI engineering roles." },
  { id: 8, title: "Applied AI Projects", status: "locked", duration: "4 weeks", difficulty: "Advanced",
    desc: "Ship 2-3 portfolio projects combining ML, RAG and deployment.", relevance: "What recruiters actually look at before your GPA." },
  { id: 9, title: "Internship / Job Readiness", status: "locked", duration: "Ongoing", difficulty: "All levels",
    desc: "Resume polish, mock interviews, system design basics, applications.", relevance: "The final step from learner to hire-ready candidate." },
];

const GAP_TO_HIRE_PLAN = {
  roleOverview: {
    targetRole: "AI/ML Engineer",
    baselineScore: 72,
    projectedScore: 94,
    avgSalary: "$142,000 / yr",
    marketDemand: "Very High (3,400+ active roles)",
    timeline: "8-10 weeks at 6 hrs/week",
  },
  milestones: [
    {
      id: 1,
      step: 1,
      title: "Deep Learning & Neural Architectures",
      status: "in-progress",
      progress: 45,
      boost: "+8%",
      scoreRange: "72% → 80%",
      priority: "Critical Gap",
      priorityTone: "amber",
      gap: "Neural networks, CNNs, Transformers, PyTorch model optimization",
      project: "Multi-modal Image & Text Classifier with PyTorch",
      skills: ["PyTorch", "Transfer Learning", "TensorRT", "CNNs"],
      whyCompaniesTest: "Over 85% of AI/ML Engineer postings require direct experience training, profiling, and fine-tuning neural architectures.",
      duration: "3 weeks",
      difficulty: "Advanced",
    },
    {
      id: 2,
      step: 2,
      title: "Docker & Containerized Model Serving",
      status: "upcoming",
      progress: 0,
      boost: "+7%",
      scoreRange: "80% → 87%",
      priority: "High Impact",
      priorityTone: "cyan",
      gap: "Docker containerization, GPU CUDA runtimes, FastAPI inference endpoints",
      project: "Scalable ML Model Serving API with Docker & FastAPI",
      skills: ["Docker", "FastAPI", "Triton Server", "GPU CUDA Runtime"],
      whyCompaniesTest: "Production AI roles require packaging models as reliable, portable containerized microservices ready for cloud deployment.",
      duration: "2 weeks",
      difficulty: "Intermediate",
    },
    {
      id: 3,
      step: 3,
      title: "Production System Design & RAG Architecture",
      status: "locked",
      progress: 0,
      boost: "+4%",
      scoreRange: "87% → 91%",
      priority: "Specialization",
      priorityTone: "violet",
      gap: "Low-latency vector indexing, cache hierarchies, distributed inference",
      project: "Enterprise Document Search with Pinecone & LangChain",
      skills: ["Vector DBs", "RAG Pipelines", "Embedding Indexes", "System Design"],
      whyCompaniesTest: "RAG is the primary enterprise generative AI workload; validating unhallucinated answer retrieval distinguishes senior candidates.",
      duration: "2.5 weeks",
      difficulty: "Advanced",
    },
    {
      id: 4,
      step: 4,
      title: "Interview Simulation & Portfolio Verification",
      status: "locked",
      progress: 0,
      boost: "+3%",
      scoreRange: "91% → 94%",
      priority: "Final Polish",
      priorityTone: "green",
      gap: "Live algorithmic coding, architecture defense, production code review",
      project: "Verified GitHub Portfolio Showcase & Architecture Deck",
      skills: ["Live Coding", "System Architecture Defense", "Code Review"],
      whyCompaniesTest: "Ensures you can clearly articulate architectural trade-offs and code clean, testable models under real interview scrutiny.",
      duration: "1.5 weeks",
      difficulty: "Advanced",
    },
  ],
  foundationalCompleted: [
    { id: 101, title: "Python Programming Fundamentals", status: "done", score: "100%", duration: "3 weeks", provider: "University Coursework" },
    { id: 102, title: "Data Structures & Algorithms", status: "done", score: "96%", duration: "4 weeks", provider: "University Coursework" },
  ],
};


const RESOURCES = [
  { id: 1, title: "Python for Data Science", type: "Course", icon: "video", difficulty: "Beginner", time: "6h", match: 96,
    reason: "You have strong Python fundamentals but limited NumPy/Pandas exposure." },
  { id: 2, title: "Probability & Statistics for ML", type: "Course", icon: "video", difficulty: "Intermediate", time: "8h", match: 93,
    reason: "Probability is your lowest-scoring assessment topic — this closes it fast." },
  { id: 3, title: "Deep Learning Specialization Notes", type: "Documentation", icon: "doc", difficulty: "Advanced", time: "10h", match: 89,
    reason: "Directly maps to the next roadmap milestone: Deep Learning." },
  { id: 4, title: "SQL Joins & Window Functions", type: "Practice Problems", icon: "code", difficulty: "Intermediate", time: "3h", match: 87,
    reason: "You missed 3 of 4 SQL join questions in your last assessment." },
  { id: 5, title: "Hands-On PyTorch", type: "Book", icon: "book", difficulty: "Intermediate", time: "12h", match: 84,
    reason: "Practical companion for the upcoming Deep Learning module." },
  { id: 6, title: "Docker for Beginners", type: "Course", icon: "video", difficulty: "Beginner", time: "4h", match: 81,
    reason: "Docker appears in 78% of AI/ML Engineer job listings you're targeting." },
];

const PROJECTS = [
  { id: 1, title: "AI Resume Analyzer", difficulty: "Intermediate", skills: ["Python", "NLP", "RAG", "FastAPI"], impact: 5, match: 94,
    desc: "Build a resume-to-JD matcher using embeddings and retrieval, exactly like this platform's own resume module." },
  { id: 2, title: "Real-Time Fraud Detection Pipeline", difficulty: "Advanced", skills: ["Python", "ML", "Kafka", "SQL"], impact: 5, match: 88,
    desc: "Stream transaction data and flag anomalies with a trained classifier and a live dashboard." },
  { id: 3, title: "Movie Recommendation Engine v2", difficulty: "Intermediate", skills: ["Python", "Collaborative Filtering"], impact: 4, match: 85,
    desc: "Extend a classic recommender with hybrid filtering and cold-start handling." },
  { id: 4, title: "Containerized ML Model API", difficulty: "Intermediate", skills: ["Docker", "FastAPI", "ML"], impact: 4, match: 82,
    desc: "Package and deploy a trained model behind a REST API — closes your Docker skill gap directly." },
  { id: 5, title: "Chat-with-Your-Docs Assistant", difficulty: "Advanced", skills: ["RAG", "LLMs", "Vector DB"], impact: 5, match: 90,
    desc: "A retrieval-augmented Q&A app over a custom document set — the same pattern used by this platform's AI Mentor." },
  { id: 6, title: "Distributed Task Scheduler", difficulty: "Advanced", skills: ["System Design", "Python"], impact: 4, match: 76,
    desc: "Design a fault-tolerant job scheduler to build real System Design intuition." },
];

const CERTIFICATIONS = [
  { id: 1, title: "TensorFlow Developer Certificate", provider: "DeepLearning.AI", difficulty: "Intermediate", duration: "6-8 weeks", match: 92,
    skills: ["Deep Learning", "TensorFlow"] },
  { id: 2, title: "Docker & Kubernetes Essentials", provider: "Cloud Native Foundation", difficulty: "Beginner", duration: "3 weeks", match: 88,
    skills: ["Docker", "Kubernetes"] },
  { id: 3, title: "AWS Certified Machine Learning – Associate", provider: "AWS", difficulty: "Advanced", duration: "10 weeks", match: 85,
    skills: ["ML", "Cloud", "MLOps"] },
  { id: 4, title: "SQL for Data Analysis", provider: "Coursera", difficulty: "Beginner", duration: "2 weeks", match: 79,
    skills: ["SQL", "Data Analysis"] },
];

const QUIZ = [
  { id: 1, topic: "Python", difficulty: "Easy", q: "What does the following return? len([1,2,[3,4]])",
    options: ["4", "3", "2", "Error"], answer: 1 },
  { id: 2, topic: "OOP", difficulty: "Medium", q: "Which principle allows a child class to provide a specific implementation of a method already defined in its parent class?",
    options: ["Encapsulation", "Abstraction", "Polymorphism", "Composition"], answer: 2 },
  { id: 3, topic: "SQL", difficulty: "Medium", q: "Which JOIN returns all rows from the left table, and matched rows from the right table?",
    options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "CROSS JOIN"], answer: 2 },
  { id: 4, topic: "Probability", difficulty: "Hard", q: "Two fair coins are tossed. What is the probability of getting at least one head?",
    options: ["1/4", "1/2", "3/4", "1"], answer: 2 },
  { id: 5, topic: "Machine Learning", difficulty: "Medium", q: "Which metric is most appropriate for a highly imbalanced classification problem?",
    options: ["Accuracy", "F1 Score", "Mean Squared Error", "R² Score"], answer: 1 },
  { id: 6, topic: "Probability", difficulty: "Hard", q: "If P(A)=0.4 and P(B)=0.5 and A, B are independent, what is P(A ∩ B)?",
    options: ["0.9", "0.2", "0.1", "0.45"], answer: 1 },
];

const CAREER_SKILLS = [
  { skill: "Python", have: true },
  { skill: "SQL", have: true },
  { skill: "Machine Learning", have: true },
  { skill: "Statistics", have: true },
  { skill: "Deep Learning", have: false },
  { skill: "Docker", have: false },
  { skill: "System Design", have: false },
];

const ONBOARD_CAREERS = [
  "AI/ML Engineer", "Software Engineer", "Data Scientist", "Cybersecurity Analyst",
  "Cloud Engineer", "Full Stack Developer", "UI/UX Designer",
];

const NAV_MENU = [
  { id: "home", label: "Home", icon: Home },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "build-path", label: "Build My Learning Path", icon: Sparkles },
  { id: "roadmap", label: "Learning Roadmap", icon: Route },
  { id: "resources", label: "Resources", icon: LayoutGrid },
  { id: "resume", label: "Resume Intelligence", icon: FileText },
  { id: "career", label: "Career Intelligence", icon: Compass },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

const PREVIOUS_LEARNING = [];

const OWNED_PROJECTS = [
  { title: "AI Chatbot", desc: "A rule-based + intent-classification chatbot for campus FAQs." },
  { title: "Smart Attendance System", desc: "Face-recognition attendance tracker built with OpenCV." },
  { title: "Movie Recommendation System", desc: "Content-based recommender using cosine similarity." },
];

const OWNED_CERTIFICATIONS = [];

const INTERESTS = [];

/* ============================== GLOBAL STYLE ============================== */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

      .lp-root {
        --bg: #060911;
        --bg-2: #0a0f1c;
        --cyan: #22d3ee;
        --blue: #3b82f6;
        --violet: #a78bfa;
        --glass: rgba(255,255,255,0.045);
        --glass-strong: rgba(255,255,255,0.075);
        --border: rgba(255,255,255,0.09);
        --border-strong: rgba(255,255,255,0.16);
        --text-dim: #8b93a7;
        font-family: 'Inter', -apple-system, sans-serif;
        background: var(--bg);
        color: #eef1f7;
        min-height: 100%;
        position: relative;
      }
      .lp-display { font-family: 'Space Grotesk', 'Inter', sans-serif; }

      .lp-glass {
        background: var(--glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border);
      }
      .lp-glass-strong {
        background: var(--glass-strong);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid var(--border-strong);
      }
      .lp-card-hover { transition: transform .35s cubic-bezier(.2,.8,.2,1), border-color .35s, box-shadow .35s; }
      .lp-card-hover:hover { transform: translateY(-4px); border-color: rgba(34,211,238,0.35); box-shadow: 0 20px 60px -20px rgba(34,211,238,0.18); }

      .lp-gradient-text {
        background: linear-gradient(100deg, #67e8f9, #93c5fd 45%, #c4b5fd);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .lp-noise {
        position: absolute; inset: 0; opacity: 0.035; pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }

      @keyframes lp-float-1 { 0%,100%{ transform: translateY(0) translateX(0);} 50%{ transform: translateY(-18px) translateX(6px);} }
      @keyframes lp-float-2 { 0%,100%{ transform: translateY(0) translateX(0);} 50%{ transform: translateY(14px) translateX(-8px);} }
      @keyframes lp-float-3 { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-10px);} }
      .lp-float-1 { animation: lp-float-1 7s ease-in-out infinite; }
      .lp-float-2 { animation: lp-float-2 8.5s ease-in-out infinite; }
      .lp-float-3 { animation: lp-float-3 6s ease-in-out infinite; }

      @keyframes lp-pulse-orb { 0%,100%{ box-shadow: 0 0 90px 10px rgba(34,211,238,0.25), 0 0 160px 40px rgba(139,92,246,0.12); } 50%{ box-shadow: 0 0 130px 20px rgba(34,211,238,0.4), 0 0 220px 60px rgba(139,92,246,0.22); } }
      .lp-orb { animation: lp-pulse-orb 4.5s ease-in-out infinite; }

      @keyframes lp-spin-slow { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
      .lp-spin-slow { animation: lp-spin-slow 18s linear infinite; }

      @keyframes lp-drift { 0%{ transform: translate(0,0); opacity:.5;} 50%{ opacity:1;} 100%{ transform: translate(var(--dx,20px), var(--dy,-30px)); opacity:.5;} }
      .lp-particle { animation: lp-drift linear infinite; }

      @keyframes lp-fade-up { from { opacity:0; transform: translateY(16px);} to { opacity:1; transform: translateY(0);} }
      .lp-fade-up { animation: lp-fade-up .7s cubic-bezier(.2,.8,.2,1) both; }

      @keyframes lp-grow-width { from { width: 0%; } }

      .lp-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
      .lp-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 8px; }
      .lp-scrollbar::-webkit-scrollbar-track { background: transparent; }

      .lp-btn-primary {
        background: linear-gradient(100deg, #22d3ee, #3b82f6 60%, #8b5cf6);
        color: #04121a; font-weight: 600;
        transition: transform .25s ease, box-shadow .25s ease, filter .25s ease;
        box-shadow: 0 8px 30px -8px rgba(34,211,238,0.5);
      }
      .lp-btn-primary:hover { transform: translateY(-2px); filter: brightness(1.08); box-shadow: 0 14px 40px -10px rgba(34,211,238,0.65); }
      .lp-btn-primary:active { transform: translateY(0); }

      .lp-btn-ghost {
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--border-strong);
        transition: all .25s ease;
      }
      .lp-btn-ghost:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.3); }

      .lp-nav-item { position: relative; transition: background .25s, color .25s; }
      .lp-nav-item.active { background: linear-gradient(90deg, rgba(34,211,238,0.14), rgba(139,92,246,0.08)); color: #fff; }
      .lp-nav-item.active::before {
        content: ''; position: absolute; left: -1px; top: 8px; bottom: 8px; width: 3px; border-radius: 4px;
        background: linear-gradient(180deg, #22d3ee, #8b5cf6);
      }

      .lp-line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    `}</style>
  );
}

/* ============================== SMALL UI PRIMITIVES ============================== */

function GlassCard({ children, className = "", strong = false, hover = false, style = {} }) {
  return (
    <div
      className={`${strong ? "lp-glass-strong" : "lp-glass"} rounded-2xl ${hover ? "lp-card-hover" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function Pill({ children, tone = "default" }) {
  const tones = {
    default: { background: "rgba(255,255,255,0.06)", color: "#c7cede", border: "1px solid rgba(255,255,255,0.12)" },
    cyan: { background: "rgba(34,211,238,0.12)", color: "#67e8f9", border: "1px solid rgba(34,211,238,0.3)" },
    violet: { background: "rgba(139,92,246,0.12)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.3)" },
    amber: { background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" },
    green: { background: "rgba(52,211,153,0.12)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.3)" },
    red: { background: "rgba(248,113,113,0.12)", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.3)" },
  };
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={tones[tone]}>
      {children}
    </span>
  );
}

function ProgressBar({ value, tone = "cyan", height = 8, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), 150 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  const grad = {
    cyan: "linear-gradient(90deg,#22d3ee,#3b82f6)",
    violet: "linear-gradient(90deg,#8b5cf6,#c084fc)",
    green: "linear-gradient(90deg,#34d399,#22d3ee)",
    amber: "linear-gradient(90deg,#fbbf24,#f97316)",
  }[tone];
  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: 999 }}>
      <div style={{ width: `${w}%`, height: "100%", borderRadius: 999, background: grad, transition: "width 1.1s cubic-bezier(.2,.8,.2,1)" }} />
    </div>
  );
}

function ProgressRing({ value, size = 120, stroke = 10, label, sublabel, tone = "#22d3ee" }) {
  const [animVal, setAnimVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimVal(value), 200);
    return () => clearTimeout(t);
  }, [value]);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (animVal / 100) * c;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={tone} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="lp-display text-2xl font-semibold">{label ?? `${value}%`}</span>
        {sublabel && <span className="text-xs text-slate-400 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}

function AnimatedCounter({ to, suffix = "", duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * to));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span>{val}{suffix}</span>;
}

function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
      <div>
        {eyebrow && <p className="text-xs font-medium mb-1" style={{ color: "#67e8f9" }}>{eyebrow}</p>}
        <h2 className="lp-display text-xl md:text-2xl font-semibold">{title}</h2>
        {subtitle && <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 lp-fade-up">
      <div className="lp-glass-strong rounded-xl px-4 py-3 flex items-center gap-2 shadow-2xl">
        <CheckCircle2 size={18} color="#34d399" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}

/* ============================== LANDING PAGE ============================== */

function FloatingCard({ className, style, children }) {
  return (
    <div className={`lp-glass-strong rounded-2xl px-4 py-3 absolute ${className}`} style={{ ...style }}>
      {children}
    </div>
  );
}

/* ============================== LOGIN VIEW ============================== */

function LoginView({
  onDemoLogin,
  onStudentLogin,
  onBackToHome,
  onStartOnboarding,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickFill = () => {
    setEmail(DEMO_STUDENT_CREDENTIALS.email);
    setPassword(DEMO_STUDENT_CREDENTIALS.password);
    setError("");
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your Student Email or ID");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError("");
    setTimeout(() => {
      setIsLoading(false);
      onStudentLogin({ email: email.trim(), rememberMe });
    }, 400);
  };

  return (
    <div className="relative min-h-screen bg-[#060911] text-[#eef1f7] overflow-hidden flex flex-col justify-between">
      <div className="lp-noise" />

      {/* Ambient background glows */}
      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.16), transparent 70%)" }}
      />
      <div
        className="absolute bottom-10 -right-40 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)" }}
      />

      {/* Top Navigation */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-[50px] md:h-[50px] rounded-xl sm:rounded-[14px] md:rounded-[16px] flex items-center justify-center shadow-lg relative overflow-hidden shrink-0"
            style={{ background: "linear-gradient(135deg, #22d3ee, #3b82f6 50%, #f97316)" }}
          >
            <Flame
              size={28}
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              color="#04121a"
              fill="#04121a"
            />
          </div>
          <span className="lp-display font-bold tracking-tight text-xl sm:text-[22px] md:text-[26px] leading-none bg-gradient-to-r from-cyan-300 via-blue-200 to-orange-400 bg-clip-text text-transparent select-none">
            PathForge
          </span>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-5 py-8 w-full lp-fade-up flex-1 flex flex-col justify-center">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="lp-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Welcome to <span className="lp-gradient-text">PathForge</span>
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-dim)" }}>
            Our platform is built specifically for <strong>Students</strong>. Choose an option below to sign in or explore instantly.
          </p>
        </div>

        {/* Dual Login Grid */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* OPTION 1: DEMO LOGIN (For Hackathon Judges) */}
          <div
            className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group"
            style={{
              background: "linear-gradient(145deg, rgba(34,211,238,0.09), rgba(139,92,246,0.12), rgba(6,9,17,0.85))",
              border: "1px solid rgba(34,211,238,0.35)",
              boxShadow: "0 0 35px -5px rgba(34,211,238,0.18)",
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 uppercase tracking-wider">
                <Sparkles size={13} className="text-cyan-300" /> Fast-Track
              </span>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> Zero Credentials
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <UserCheck size={20} />
                </div>
                <h2 className="lp-display text-xl sm:text-2xl font-semibold text-white">
                  Demo Login
                </h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: "var(--text-dim)" }}>
                Designed specifically for <strong>Hackathon Judges</strong> to enter instantly without registration or typing credentials.
              </p>

              {/* Feature checklist */}
              <div className="space-y-3 mb-8 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check size={15} className="text-emerald-400 shrink-0" />
                  <span>Instant Access to Full Student Portal</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check size={15} className="text-emerald-400 shrink-0" />
                  <span>Pre-configured Student Persona</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check size={15} className="text-emerald-400 shrink-0" />
                  <span>No sign-up or typing required</span>
                </div>
              </div>
            </div>

            <button
              onClick={onDemoLogin}
              className="lp-btn-primary w-full py-3.5 px-5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/35 transition-all"
            >
              <Sparkles size={16} /> Enter pathForge <ArrowRight size={16} />
            </button>
          </div>

          {/* OPTION 2: STUDENT LOGIN */}
          <GlassCard className="p-6 sm:p-7 flex flex-col justify-between" hover>
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 text-slate-300 border border-white/10 uppercase tracking-wider">
                  <GraduationCap size={13} /> Registered
                </span>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
                >
                  Fill Demo Credentials
                </button>
              </div>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-violet-400/10 border border-violet-400/30 flex items-center justify-center text-violet-300">
                  <Lock size={18} />
                </div>
                <h2 className="lp-display text-xl sm:text-2xl font-semibold text-white">
                  Student Login
                </h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: "var(--text-dim)" }}>
                Sign in with your university student email or student ID to access your personalized roadmap.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Student Email / ID
                  </label>
                  <div className="relative">
                    {!email && (
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    )}
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="e.g. alex.chen@university.edu"
                      className="lp-input w-full py-2.5 rounded-xl text-sm"
                      style={{ paddingLeft: email ? "0.875rem" : "2.5rem", paddingRight: "1rem" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    {!password && (
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    )}
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="Enter your student password"
                      className="lp-input w-full py-2.5 rounded-xl text-sm"
                      style={{ paddingLeft: password ? "0.875rem" : "2.5rem", paddingRight: "2.5rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 cursor-pointer"
                    />
                    Remember this device
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="lp-btn-primary w-full py-3 px-5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
                >
                  {isLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      Sign In as Student <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <p className="text-xs text-slate-400">
                New student?{" "}
                <button
                  type="button"
                  onClick={onStartOnboarding}
                  className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline cursor-pointer"
                >
                  Build your learning path
                </button>
              </p>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}

function LandingPage({ onStart, onExplore, onProfile, student, onLogin, onDemoLogin }) {
  return (
    <div className="relative overflow-hidden">
      <div className="lp-noise" />
      {/* ambient glows */}
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.16), transparent 70%)" }} />
      <div className="absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14), transparent 70%)" }} />

      {/* NAV */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-[50px] md:h-[50px] rounded-xl sm:rounded-[14px] md:rounded-[16px] flex items-center justify-center shadow-lg relative overflow-hidden shrink-0"
            style={{ background: "linear-gradient(135deg, #22d3ee, #3b82f6 50%, #f97316)" }}
          >
            <Flame
              size={28}
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              color="#04121a"
              fill="#04121a"
            />
          </div>
          <span className="lp-display font-bold tracking-tight text-xl sm:text-[22px] md:text-[26px] leading-none bg-gradient-to-r from-cyan-300 via-blue-200 to-orange-400 bg-clip-text text-transparent select-none">
            PathForge
          </span>
        </div>
        <button
          onClick={onProfile}
          aria-label="View Profile"
          title={`${student?.name || "Alex"}'s Profile`}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer group shrink-0 overflow-hidden"
          style={{
            background: student?.profilePicture ? "transparent" : "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(139,92,246,0.18))",
            border: "1px solid rgba(34,211,238,0.35)",
            boxShadow: "0 0 15px -3px rgba(34,211,238,0.25)",
          }}
        >
          {student?.profilePicture ? (
            <img src={student.profilePicture} alt={student.name || "Profile"} className="w-full h-full object-cover rounded-full" />
          ) : (
            <User size={18} className="text-cyan-300 group-hover:scale-110 transition-transform" />
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#060911]" />
        </button>
      </nav>

      {/* HERO */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-28 grid md:grid-cols-2 gap-14 items-center">
        <div className="lp-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.25)", color: "#67e8f9" }}>
            <Sparkles size={13} /> AI-powered education to employment
          </div>
          <h1 className="lp-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-semibold tracking-tight">
            Your learning path.
            <br />
            <span className="lp-gradient-text">Powered by intelligence.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg max-w-lg" style={{ color: "var(--text-dim)" }}>
            Discover what you know, understand what you're missing, and follow an AI-guided path from learning to career readiness.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <button onClick={onStart} className="lp-btn-primary px-6 py-3.5 rounded-xl flex items-center gap-2 text-[15px]">
              Build my learning path <ArrowRight size={17} />
            </button>
            <button onClick={onExplore} className="lp-btn-ghost px-5 py-3.5 rounded-xl text-[14px] text-slate-300 hover:text-white">
              Explore platform
            </button>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="relative h-[440px] md:h-[520px] lp-fade-up" style={{ animationDelay: ".15s" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="lp-orb lp-spin-slow rounded-full" style={{
              width: 210, height: 210,
              background: "radial-gradient(circle at 35% 30%, rgba(103,232,249,0.55), rgba(139,92,246,0.35) 55%, rgba(6,9,17,0.1) 75%)",
              border: "1px solid rgba(255,255,255,0.15)",
            }} />
            <div className="absolute rounded-full" style={{ width: 90, height: 90, background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(103,232,249,0.4))", filter: "blur(1px)" }} />
          </div>

          {/* connection lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.35 }}>
            <line x1="18%" y1="20%" x2="48%" y2="46%" stroke="#67e8f9" strokeWidth="1" strokeDasharray="4 5" />
            <line x1="82%" y1="18%" x2="55%" y2="45%" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="4 5" />
            <line x1="12%" y1="78%" x2="48%" y2="55%" stroke="#67e8f9" strokeWidth="1" strokeDasharray="4 5" />
            <line x1="85%" y1="80%" x2="55%" y2="56%" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="4 5" />
          </svg>

          <FloatingCard className="lp-float-1" style={{ top: "6%", left: "2%" }}>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Python</p>
            <p className="lp-display text-lg font-semibold text-cyan-300">92% Mastery</p>
          </FloatingCard>
          <FloatingCard className="lp-float-2" style={{ top: "2%", right: "0%" }}>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Machine Learning</p>
            <p className="lp-display text-lg font-semibold text-blue-300">67% Mastery</p>
          </FloatingCard>
          <FloatingCard className="lp-float-3" style={{ bottom: "20%", left: "-2%" }}>
            <div className="flex items-center gap-1.5 text-amber-300 text-xs mb-1"><AlertTriangle size={12} /> Skill gap detected</div>
            <p className="lp-display text-sm font-medium">→ Deep Learning</p>
          </FloatingCard>
          <FloatingCard className="lp-float-1" style={{ bottom: "8%", right: "2%", animationDelay: "1.2s" }}>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Career match</p>
            <p className="lp-display text-lg font-semibold" style={{ color: "#c4b5fd" }}>AI Engineer · 94%</p>
          </FloatingCard>
          <FloatingCard className="lp-float-2" style={{ top: "42%", left: "-4%", animationDelay: ".6s" }}>
            <div className="flex items-center gap-1.5 text-xs"><Route size={12} color="#67e8f9" /> Roadmap node</div>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>Statistics → ML</p>
          </FloatingCard>
        </div>
      </div>

      {/* what the platform does */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <SectionHeader eyebrow="What PathForge does" title="Everything between your last course and your first job" subtitle="One system that reads your profile and keeps every recommendation current as you learn." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Radar, title: "Skill profiling", desc: "Detects what you already know from courses, projects and certifications, then maps strengths and gaps." },
            { icon: Route, title: "Adaptive roadmap", desc: "Sequences exactly what to learn next toward your target career, and reorders itself as you progress." },
            { icon: LayoutGrid, title: "Resource matching", desc: "Surfaces the videos, docs and problem sets most likely to close your specific gaps — with a reason for each." },
            { icon: Sparkles, title: "Adaptive assessments", desc: "Validates real understanding with difficulty that adjusts to you, not a fixed quiz bank." },
            { icon: FileText, title: "Resume intelligence", desc: "Scores your resume against your target role and points out exactly what's missing." },
            { icon: Compass, title: "Career matching", desc: "Compares your skills to real industry requirements and tells you what closes the gap fastest." },
          ].map(({ icon: Icon, title, desc }) => (
            <GlassCard key={title} hover className="p-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(34,211,238,0.1)" }}>
                <Icon size={18} color="#67e8f9" />
              </div>
              <p className="text-sm font-semibold mb-1.5">{title}</p>
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>{desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* trusted AI / RAG */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-28">
        <GlassCard strong className="p-8 md:p-10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} color="#34d399" />
            <span className="lp-display font-semibold">Trusted AI knowledge</span>
          </div>
          <p className="text-sm mb-8 max-w-xl" style={{ color: "var(--text-dim)" }}>
            Every recommendation is grounded in retrieval over verified sources — not a hallucinated guess.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-6">
            {["Student question", "AI retrieval", "Verified knowledge", "Personalized answer"].map((step, i, arr) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ background: i === arr.length - 1 ? "#34d399" : "#67e8f9" }} />
                  {step}
                </div>
                {i < arr.length - 1 && <ArrowRight size={16} className="hidden sm:block" style={{ color: "var(--text-dim)" }} />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-8">
            {["Documentation", "Academic Resources", "Verified Courses", "Industry Resources"].map(s => <Pill key={s}>{s}</Pill>)}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ============================== ONBOARDING ============================== */

const ONBOARD_STEPS = ["Academic Background", "Current Skills", "Projects & Certifications", "Interests", "Target Career", "Learning Preferences"];

function OnboardingFlow({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    degree: "B.Tech Computer Science", year: "3rd Year",
    skills: ["Python", "Java", "SQL"],
    projects: "AI Chatbot, Smart Attendance System",
    interests: ["Artificial Intelligence", "Backend Development"],
    career: "AI/ML Engineer",
    pace: "Balanced",
  });

  const toggle = (key, val) => {
    setData(d => ({ ...d, [key]: d[key].includes(val) ? d[key].filter(x => x !== val) : [...d[key], val] }));
  };

  const next = () => step < ONBOARD_STEPS.length - 1 ? setStep(step + 1) : onComplete(data);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <div className="absolute -top-20 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.1), transparent 70%)" }} />
      <div className="w-full max-w-2xl relative z-10">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-dim)" }}>
          <ArrowLeft size={15} /> Back
        </button>

        <div className="flex items-center gap-2 mb-8">
          {ONBOARD_STEPS.map((s, i) => (
            <div key={s} className="flex-1 h-1.5 rounded-full" style={{
              background: i <= step ? "linear-gradient(90deg,#22d3ee,#8b5cf6)" : "rgba(255,255,255,0.08)",
              transition: "background .4s",
            }} />
          ))}
        </div>
        <p className="text-xs mb-1" style={{ color: "#67e8f9" }}>Step {step + 1} of {ONBOARD_STEPS.length}</p>
        <h2 className="lp-display text-2xl font-semibold mb-6">{ONBOARD_STEPS[step]}</h2>

        <GlassCard strong className="p-7 lp-fade-up" key={step}>
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Degree program">
                <select className="lp-input" value={data.degree} onChange={e => setData({ ...data, degree: e.target.value })}>
                  {["B.Tech Computer Science", "B.Tech IT", "B.Sc Data Science", "BCA"].map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Current year">
                <select className="lp-input" value={data.year} onChange={e => setData({ ...data, year: e.target.value })}>
                  {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>
          )}
          {step === 1 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-dim)" }}>Select skills you already have some experience with.</p>
              <div className="flex flex-wrap gap-2">
                {["Python", "Java", "C++", "SQL", "JavaScript", "Machine Learning", "Statistics", "Git"].map(s => (
                  <button key={s} onClick={() => toggle("skills", s)}
                    className="px-3.5 py-1.5 rounded-full text-sm transition-all"
                    style={data.skills.includes(s)
                      ? { background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7cede" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <Field label="List your past projects or certifications">
              <textarea className="lp-input" rows={4} value={data.projects} onChange={e => setData({ ...data, projects: e.target.value })} />
            </Field>
          )}
          {step === 3 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-dim)" }}>What are you most curious about?</p>
              <div className="flex flex-wrap gap-2">
                {["Artificial Intelligence", "Backend Development", "Cloud & DevOps", "Cybersecurity", "Product Design", "Data Analytics"].map(s => (
                  <button key={s} onClick={() => toggle("interests", s)}
                    className="px-3.5 py-1.5 rounded-full text-sm transition-all"
                    style={data.interests.includes(s)
                      ? { background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "#c4b5fd" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7cede" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {ONBOARD_CAREERS.map(c => (
                <button key={c} onClick={() => setData({ ...data, career: c })}
                  className="text-left px-4 py-3.5 rounded-xl text-sm flex items-center justify-between transition-all"
                  style={data.career === c
                    ? { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)" }
                    : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}>
                  {c}
                  {data.career === c && <Check size={16} color="#67e8f9" />}
                </button>
              ))}
            </div>
          )}
          {step === 5 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-dim)" }}>Pick your preferred learning pace.</p>
              <div className="grid grid-cols-3 gap-3">
                {["Relaxed", "Balanced", "Intensive"].map(p => (
                  <button key={p} onClick={() => setData({ ...data, pace: p })}
                    className="py-3.5 rounded-xl text-sm transition-all"
                    style={data.pace === p
                      ? { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" }
                      : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        <div className="flex justify-between mt-6">
          <button onClick={() => step > 0 && setStep(step - 1)} className={`lp-btn-ghost px-5 py-2.5 rounded-lg text-sm ${step === 0 ? "opacity-30 pointer-events-none" : ""}`}>
            Previous
          </button>
          <button onClick={next} className="lp-btn-primary px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
            {step === ONBOARD_STEPS.length - 1 ? "Analyze my profile" : "Continue"} <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <style>{`.lp-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:10px 12px;color:#eef1f7;font-size:14px;outline:none;} .lp-input:focus{border-color:rgba(34,211,238,0.5);}`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs mb-1.5 block" style={{ color: "var(--text-dim)" }}>{label}</span>
      {children}
    </label>
  );
}

/* ============================== ANALYZING SCREEN ============================== */

function AnalyzingScreen({ onDone }) {
  const messages = [
    "Reading your academic profile...",
    "Mapping previous learning and skills...",
    "Cross-referencing verified sources...",
    "Detecting skill gaps for AI/ML Engineer...",
    "Generating your personalized roadmap...",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= messages.length - 1) {
      const t = setTimeout(onDone, 1100);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx(i => i + 1), 700);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.08), transparent 60%)" }} />
      <div className="relative z-10 flex flex-col items-center">
        <div className="lp-orb lp-spin-slow rounded-full mb-10" style={{
          width: 130, height: 130,
          background: "radial-gradient(circle at 35% 30%, rgba(103,232,249,0.6), rgba(139,92,246,0.35) 60%, transparent 75%)",
          border: "1px solid rgba(255,255,255,0.15)",
        }} />
        <h2 className="lp-display text-2xl font-semibold mb-3">AI is analyzing your profile...</h2>
        <p className="text-sm" style={{ color: "#67e8f9" }}>{messages[idx]}</p>
        <div className="w-64 h-1.5 rounded-full mt-8" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#22d3ee,#8b5cf6)", width: `${((idx + 1) / messages.length) * 100}%`, transition: "width .6s ease" }} />
        </div>
      </div>
    </div>
  );
}

/* ============================== NAV DRAWER + TOPBAR ============================== */

function HamburgerButton({ onClick }) {
  return (
    <button onClick={onClick} className="lp-glass-strong fixed top-5 left-5 z-50 w-11 h-11 rounded-xl flex items-center justify-center">
      <Menu size={19} />
    </button>
  );
}

function HomeButton({ onClick }) {
  return (
    <button onClick={onClick} className="lp-glass-strong fixed top-5 left-[68px] z-50 h-11 px-4 rounded-xl flex items-center gap-2 text-sm">
      <ArrowLeft size={16} /> <span className="hidden sm:inline">Home</span>
    </button>
  );
}

function NavDrawer({ open, onClose, active, onNavigate }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 lp-fade-up" style={{ animationDuration: ".25s" }} onClick={onClose} />}
      <aside className="fixed top-0 left-0 h-screen z-50 w-72 lp-glass-strong flex flex-col transition-transform duration-300"
        style={{ transform: open ? "translateX(0)" : "translateX(-110%)" }}>
        <div className="flex items-center justify-between px-5 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate("home")} title="Go to Home">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden" style={{ background: "linear-gradient(135deg, #22d3ee, #3b82f6 50%, #f97316)" }}>
              <Flame size={18} color="#04121a" fill="#04121a" />
            </div>
            <span className="lp-display font-bold text-[16px] bg-gradient-to-r from-cyan-300 via-blue-200 to-orange-400 bg-clip-text text-transparent">PathForge</span>
          </div>
          <button onClick={onClose}><X size={18} style={{ color: "var(--text-dim)" }} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto lp-scrollbar px-3 py-4 space-y-1">
          {NAV_MENU.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => onNavigate(id)}
              className={`lp-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left ${active === id ? "active" : ""}`}
              style={{ color: active === id ? "#fff" : "var(--text-dim)" }}>
              <Icon size={17} className="shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => onNavigate("login")}
            className={`lp-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left cursor-pointer ${active === "login" ? "active" : ""}`}
            style={{ color: active === "login" ? "#fff" : "var(--text-dim)" }}
          >
            <LogIn size={17} className="shrink-0 text-cyan-400" />
            <span>Login / Switch</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ title, onProfileClick, student }) {
  return (
    <div className="flex items-center justify-between pl-20 sm:pl-24 pr-5 md:pr-8 py-5 sticky top-0 z-20" style={{ background: "rgba(6,9,17,0.7)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <h1 className="lp-display text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Search size={14} style={{ color: "var(--text-dim)" }} />
          <input placeholder="Search resources, skills, careers..." className="bg-transparent text-sm outline-none w-56" style={{ color: "#eef1f7" }} />
        </div>
        <button
          onClick={onProfileClick}
          aria-label="Open Profile"
          title={`${student?.name || "Alex"}'s Profile`}
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 cursor-pointer hover:ring-2 hover:ring-cyan-400/50 hover:scale-105 active:scale-95 transition-all overflow-hidden"
          style={{ background: student?.avatarColor || "linear-gradient(135deg,#22d3ee,#8b5cf6)", color: "#04121a" }}
        >
          {student?.profilePicture ? (
            <img src={student.profilePicture} alt={student.name || "Profile"} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span>{student?.name ? student.name.charAt(0) : "A"}</span>
          )}
        </button>
      </div>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */

function DashboardView({ go }) {
  const stats = [
    { label: "Overall career readiness", value: 72, icon: Compass, tone: "cyan" },
    { label: "Learning progress", value: 64, icon: TrendingUp, tone: "violet" },
    { label: "Skills mastered", value: 18, icon: Radar, tone: "green", raw: true },
    { label: "Current streak", value: 12, icon: Flame, tone: "amber", raw: true, suffix: " days" },
  ];

  const plan = GAP_TO_HIRE_PLAN;

  return (
    <div className="space-y-8">
      {/* Greeting Banner */}
      <GlassCard strong className="p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="lp-display text-xl md:text-2xl font-semibold">Good morning, {STUDENT.name} 👋</h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>
            Your AI career companion identified 3 high-impact gaps to unlock 94% hireability for <span className="text-cyan-300 font-medium">{STUDENT.targetCareer}</span>.
          </p>
        </div>
        <button onClick={() => go("profile")} className="lp-btn-primary px-5 py-2.5 rounded-xl text-sm whitespace-nowrap cursor-pointer">
          {"Take today's assessment"}
        </button>
      </GlassCard>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <GlassCard key={s.label} hover className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,211,238,0.1)" }}>
                <s.icon size={16} color="#67e8f9" />
              </div>
            </div>
            <p className="lp-display text-2xl font-semibold">
              <AnimatedCounter to={s.value} suffix={s.raw ? (s.suffix || "") : "%"} />
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Role Gap-to-Hire Action Plan Card + Skill Gap Analysis */}
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2" hover>
          <SectionHeader
            eyebrow="CAREER GAP CLOSER"
            title="Role Gap-to-Hire Action Plan"
            subtitle={`Close 3 critical skill gaps to boost your ${STUDENT.targetCareer} hireability from 72% to 94%.`}
            action={
              <button
                onClick={() => go("roadmap")}
                className="text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors cursor-pointer"
              >
                View full action plan <ChevronRight size={13} />
              </button>
            }
          />

          {/* Hireability Stepper Tracker */}
          <div className="my-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">Current Readiness: <strong className="text-white">72%</strong></span>
              <span className="text-cyan-400 font-medium flex items-center gap-1">
                <Target size={13} /> Target Hireability: <strong>94%</strong>
              </span>
            </div>
            <div className="relative h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 bottom-0 rounded-full transition-all duration-1000"
                style={{ width: "72%", background: "linear-gradient(90deg, #22d3ee, #8b5cf6)" }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
              <span>Baseline: 72%</span>
              <span className="text-cyan-300">+8% Deep Learning</span>
              <span className="text-violet-300">+7% Docker/FastAPI</span>
              <span className="text-emerald-400 font-semibold">94% Hired</span>
            </div>
          </div>

          {/* Priority Gap Items */}
          <div className="space-y-3">
            {plan.milestones.slice(0, 3).map((m) => (
              <div
                key={m.id}
                onClick={() => go("roadmap")}
                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-cyan-400/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: "rgba(34,211,238,0.12)", color: "#67e8f9" }}>
                    0{m.step}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white truncate">{m.title}</p>
                      <Pill tone={m.priorityTone}>{m.priority}</Pill>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{m.project}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(52,211,153,0.12)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.25)" }}>
                    {m.boost} boost
                  </span>
                  <StatusDot status={m.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Skill Gap Analysis */}
        <GlassCard className="p-6" hover>
          <SectionHeader title="Skill gap analysis" />
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}>
            <CheckCircle2 size={13} /> Strengths
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {STRENGTHS.map(s => <Pill key={s} tone="green">{s}</Pill>)}
          </div>
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#fbbf24" }}>
            <AlertTriangle size={13} /> High-Priority Gaps
          </p>
          <div className="flex flex-wrap gap-1.5">
            {GAPS.map(s => <Pill key={s} tone="amber">{s}</Pill>)}
          </div>
          <button onClick={() => go("profile")} className="text-xs flex items-center gap-1 mt-6 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
            Full skill profile <ChevronRight size={13} />
          </button>
        </GlassCard>
      </div>

      {/* AI Recommendations & Upcoming Assessment */}
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2" hover>
          <SectionHeader
            title="AI recommendations"
            subtitle="Matched to your current skill gaps"
            action={
              <button onClick={() => go("resources")} className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "#67e8f9" }}>
                All resources <ChevronRight size={13} />
              </button>
            }
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {RESOURCES.slice(0, 4).map(r => (
              <div key={r.id} className="p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <Pill tone="cyan">{r.match}% match</Pill>
                  <span className="text-xs" style={{ color: "var(--text-dim)" }}>{r.time}</span>
                </div>
                <p className="text-sm font-medium lp-line-clamp-2 text-white">{r.title}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col" hover>
          <SectionHeader title="Upcoming assessment" />
          <div className="flex-1 flex flex-col items-center justify-center text-center py-2">
            <Sparkles size={26} color="#67e8f9" className="mb-3" />
            <p className="text-sm font-medium mb-1 text-white">Adaptive Knowledge Check</p>
            <p className="text-xs mb-5" style={{ color: "var(--text-dim)" }}>6 questions · ~10 minutes · Statistics & ML focus</p>
            <button onClick={() => go("profile")} className="lp-btn-primary px-5 py-2.5 rounded-xl text-sm w-full cursor-pointer">
              Start assessment
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Recommended Projects & Career Readiness */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover>
          <SectionHeader
            title="Recommended projects"
            action={
              <button onClick={() => go("projects")} className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "#67e8f9" }}>
                All projects <ChevronRight size={13} />
              </button>
            }
          />
          {PROJECTS.slice(0, 2).map(p => (
            <div key={p.id} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <p className="text-sm font-medium text-white">{p.title}</p>
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>{p.skills.slice(0, 3).join(" · ")}</p>
              </div>
              <Pill tone="cyan">{p.match}%</Pill>
            </div>
          ))}
        </GlassCard>

        <GlassCard className="p-6" hover>
          <SectionHeader
            title="Career readiness"
            action={
              <button onClick={() => go("career")} className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "#67e8f9" }}>
                Details <ChevronRight size={13} />
              </button>
            }
          />
          <div className="flex items-center gap-6">
            <ProgressRing value={72} size={96} stroke={8} sublabel="ready" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-white">Target: <span className="font-semibold text-cyan-300">{STUDENT.targetCareer}</span></p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>18 of 25 required skills matched</p>
              <p className="text-xs" style={{ color: "#fbbf24" }}>Focus: Docker, System Design, Deep Learning</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}


function StatusDot({ status }) {
  const map = {
    done: { bg: "#34d399", icon: Check },
    "in-progress": { bg: "#22d3ee", icon: PlayCircle },
    upcoming: { bg: "#64748b", icon: CircleDot },
    locked: { bg: "#475569", icon: Lock },
  };
  const { bg } = map[status] || map.upcoming;
  return <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: bg, boxShadow: status !== "locked" ? `0 0 8px ${bg}` : "none" }} />;
}

/* ============================== SKILLS VIEW ============================== */

function SkillsView() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Skill intelligence" title="Your skill profile" subtitle="Detected from courses, projects, certifications and assessment results." />
      <div className="grid lg:grid-cols-5 gap-6">
        <GlassCard className="p-6 lg:col-span-3" hover>
          {SKILL_GROUPS.map((g, gi) => (
            <div key={g.name} className="mb-6 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{g.name}</span>
                <span className="text-sm" style={{ color: "#67e8f9" }}>{g.level}%</span>
              </div>
              <ProgressBar value={g.level} tone="cyan" height={9} delay={gi * 80} />
              <div className="mt-3 space-y-2.5 pl-1">
                {g.skills.map((s, si) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>{s.name}</span>
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>{s.level}%</span>
                    </div>
                    <ProgressBar value={s.level} tone={s.level > 60 ? "green" : s.level > 30 ? "cyan" : "amber"} height={6} delay={gi * 80 + si * 60} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </GlassCard>

        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6" hover>
            <SectionHeader title="Knowledge map" />
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer>
                <RadarChart data={RADAR_DATA} outerRadius="75%">
                  <PolarGrid stroke="rgba(255,255,255,0.12)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#8b93a7", fontSize: 11 }} />
                  <RechartsRadar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.28} />
                  <RTooltip contentStyle={{ background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <p className="text-xs font-medium mb-2.5 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}><CheckCircle2 size={14} /> Strengths</p>
            <div className="flex flex-wrap gap-1.5 mb-5">{STRENGTHS.map(s => <Pill key={s} tone="green">{s}</Pill>)}</div>
            <p className="text-xs font-medium mb-2.5 flex items-center gap-1.5" style={{ color: "#fbbf24" }}><AlertTriangle size={14} /> Skill gaps</p>
            <div className="flex flex-wrap gap-1.5">{GAPS.map(s => <Pill key={s} tone="amber">{s}</Pill>)}</div>
            <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>Recommended starting point</p>
              <p className="text-sm font-medium">Statistics & Probability → Deep Learning</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

/* ============================== ROADMAP VIEW ============================== */

function RoadmapView() {
  const [expanded, setExpanded] = useState(1);
  const [tab, setTab] = useState("all"); // all | active | foundational

  const plan = GAP_TO_HIRE_PLAN;
  const overview = plan.roleOverview;

  const displayMilestones = tab === "foundational"
    ? []
    : tab === "active"
      ? plan.milestones.filter(m => m.status !== "done")
      : plan.milestones;

  return (
    <div className="space-y-7">
      {/* Header */}
      <SectionHeader
        eyebrow="CAREER ACCELERATOR BLUEPRINT"
        title={`Role Gap-to-Hire Action Plan: ${overview.targetRole}`}
        subtitle={`A prioritized hiring roadmap bridging your current skills (${STUDENT.name}) directly to top-tier ${overview.targetRole} job postings.`}
      />

      {/* Market Intelligence Hero Card */}
      <GlassCard strong className="p-6 md:p-8 relative overflow-hidden" hover>
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.14), transparent 70%)" }}
        />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Target Role: {overview.targetRole}
                </span>
                <span className="text-xs text-slate-400">· Timeline: {overview.timeline}</span>
              </div>
              <h2 className="lp-display text-2xl font-bold text-white">4 Actionable Steps to Reach 94% Hireability</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-right">
                <p className="text-[11px] text-slate-400">Avg. Market Salary</p>
                <p className="lp-display text-lg font-bold text-emerald-400">{overview.avgSalary}</p>
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Readiness Trajectory</span>
              <span className="text-cyan-400 font-semibold">{overview.baselineScore}% Baseline → {overview.projectedScore}% Fully Qualified</span>
            </div>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 bottom-0 rounded-full transition-all duration-1000"
                style={{ width: "72%", background: "linear-gradient(90deg, #22d3ee, #8b5cf6)" }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
              <span>Current: 72%</span>
              <span>Step 1: +8%</span>
              <span>Step 2: +7%</span>
              <span>Step 3: +4%</span>
              <span className="text-emerald-400 font-bold">Target: 94%</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setTab("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            tab === "all" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
          }`}
        >
          All Milestones ({plan.milestones.length})
        </button>
        <button
          onClick={() => setTab("active")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            tab === "active" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
          }`}
        >
          Active Gaps ({plan.milestones.filter(m => m.status !== "done").length})
        </button>
        <button
          onClick={() => setTab("foundational")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            tab === "foundational" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
          }`}
        >
          Foundational Credits ({plan.foundationalCompleted.length})
        </button>
      </div>

      {/* Action Milestones Timeline */}
      {tab !== "foundational" && (
        <div className="relative pl-8 space-y-5">
          <div
            className="absolute left-[15px] top-4 bottom-4 w-0.5"
            style={{ background: "linear-gradient(180deg, rgba(34,211,238,0.7), rgba(139,92,246,0.6), rgba(255,255,255,0.1))" }}
          />

          {displayMilestones.map((m) => {
            const isOpen = expanded === m.id;
            return (
              <div key={m.id} className="relative">
                <div className="absolute -left-[29px] top-5 z-10">
                  <StatusDot status={m.status} />
                </div>

                <GlassCard hover className={`p-5 md:p-6 transition-all ${m.status === "locked" ? "opacity-75" : ""}`}>
                  <div
                    onClick={() => setExpanded(isOpen ? null : m.id)}
                    className="w-full flex items-start justify-between gap-4 text-left cursor-pointer"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <span className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5" style={{ background: "rgba(34,211,238,0.12)", color: "#67e8f9", border: "1px solid rgba(34,211,238,0.25)" }}>
                        0{m.step}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="lp-display text-base font-semibold text-white">{m.title}</h3>
                          <Pill tone={m.priorityTone}>{m.priority}</Pill>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            {m.boost} Hireability ({m.scoreRange})
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1"><Clock size={12} /> {m.duration}</span>
                          <span>·</span>
                          <span className="text-cyan-300 font-medium">Required Project: {m.project}</span>
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      size={20}
                      className="shrink-0 text-slate-400 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                    />
                  </div>

                  {m.status === "in-progress" && (
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Milestone Progress</span>
                        <span className="text-cyan-400 font-semibold">{m.progress}%</span>
                      </div>
                      <ProgressBar value={m.progress} tone="cyan" height={6} />
                    </div>
                  )}

                  {isOpen && (
                    <div className="mt-5 pt-4 space-y-4 lp-fade-up" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <p className="text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                            <Target size={13} /> Identified Skill Gap
                          </p>
                          <p className="text-xs text-slate-300 leading-relaxed">{m.gap}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <p className="text-xs font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                            <Briefcase size={13} /> Why Top Companies Test This
                          </p>
                          <p className="text-xs text-slate-300 leading-relaxed">{m.whyCompaniesTest}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-300 mb-2">Key Skills Unlocked</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.skills.map((sk) => (
                            <Pill key={sk} tone="cyan">{sk}</Pill>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <FolderKanban size={14} className="text-violet-400" />
                          <span>Deliverable: <strong>{m.project}</strong></span>
                        </div>
                        <button className="lp-btn-primary px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer">
                          <span>{m.status === "in-progress" ? "Continue Sprint" : "Start Milestone"}</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </div>
            );
          })}
        </div>
      )}

      {/* Foundational Completed Credits View */}
      {(tab === "foundational" || tab === "all") && (
        <div className="space-y-3 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" /> Foundational Credits Completed
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {plan.foundationalCompleted.map((f) => (
              <GlassCard key={f.id} className="p-4" hover>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{f.provider} · {f.duration}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {f.score}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


const RESOURCE_ICONS = { video: Video, doc: FileText, code: FileCode2, book: BookOpen };

function ResourcesView() {
  const [filter, setFilter] = useState("All");
  const types = ["All", "Course", "Documentation", "Practice Problems", "Book"];
  const filtered = filter === "All" ? RESOURCES : RESOURCES.filter(r => r.type === filter);
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Intelligent recommendations" title="Learning resources" subtitle="Ranked by AI match score based on your skill profile and current gaps." />
      <div className="flex flex-wrap gap-2">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} className="px-3.5 py-1.5 rounded-full text-xs transition-all"
            style={filter === t ? { background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" } : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7cede" }}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(r => {
          const Icon = RESOURCE_ICONS[r.icon];
          return (
            <GlassCard key={r.id} hover className="p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.12)" }}>
                  <Icon size={16} color="#c4b5fd" />
                </div>
                <Pill tone="cyan">{r.match}% match</Pill>
              </div>
              <p className="text-sm font-semibold mb-1">{r.title}</p>
              <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: "var(--text-dim)" }}>
                <span>{r.type}</span><span>·</span><span>{r.difficulty}</span><span>·</span><span>{r.time}</span>
              </div>
              <p className="text-xs flex-1 mb-4" style={{ color: "#8b93a7" }}>{r.reason}</p>
              <button className="lp-btn-ghost text-xs py-2 rounded-lg w-full flex items-center justify-center gap-1.5">
                <PlayCircle size={13} /> Open resource
              </button>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== ASSESSMENT VIEW ============================== */

function AssessmentView() {
  const [phase, setPhase] = useState("intro"); // intro | quiz | results
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (phase !== "quiz") return;
    if (seconds === 0) { handleNext(null); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, phase]);

  const start = () => { setPhase("quiz"); setQi(0); setAnswers([]); setSeconds(30); };

  const handleNext = (choice) => {
    const updated = [...answers, choice];
    setAnswers(updated);
    if (qi + 1 < QUIZ.length) { setQi(qi + 1); setSeconds(30); }
    else setPhase("results");
  };

  const score = answers.filter((a, i) => a === QUIZ[i]?.answer).length;
  const pct = Math.round((score / QUIZ.length) * 100);
  const topicResults = {};
  QUIZ.forEach((q, i) => {
    topicResults[q.topic] = topicResults[q.topic] || { correct: 0, total: 0 };
    topicResults[q.topic].total++;
    if (answers[i] === q.answer) topicResults[q.topic].correct++;
  });

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto">
        <SectionHeader eyebrow="Adaptive assessment" title="Knowledge validation check" subtitle="6 questions · MCQ & conceptual · difficulty adapts to your profile" />
        <GlassCard strong className="p-8 text-center">
          <Sparkles size={30} color="#67e8f9" className="mx-auto mb-4" />
          <p className="text-sm mb-6" style={{ color: "var(--text-dim)" }}>
            This assessment covers Python, OOP, SQL, Probability and Machine Learning — the topics most relevant to your current roadmap stage.
            You'll have 30 seconds per question.
          </p>
          <button onClick={start} className="lp-btn-primary px-7 py-3 rounded-xl text-sm">Start assessment</button>
        </GlassCard>
      </div>
    );
  }

  if (phase === "quiz") {
    const q = QUIZ[qi];
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>Question {qi + 1} of {QUIZ.length}</span>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: seconds <= 10 ? "#f87171" : "#67e8f9" }}>
            <Clock size={13} /> {seconds}s
          </div>
        </div>
        <div className="h-1.5 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div style={{ width: `${((qi) / QUIZ.length) * 100}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#22d3ee,#8b5cf6)", transition: "width .4s" }} />
        </div>
        <GlassCard strong className="p-7 lp-fade-up" key={qi}>
          <div className="flex items-center gap-2 mb-4">
            <Pill tone="violet">{q.topic}</Pill>
            <Pill tone={q.difficulty === "Hard" ? "red" : q.difficulty === "Medium" ? "amber" : "green"}>{q.difficulty}</Pill>
          </div>
          <p className="text-base font-medium mb-6">{q.q}</p>
          <div className="space-y-2.5">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => handleNext(i)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all lp-btn-ghost">
                {opt}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader eyebrow="Results" title="Assessment complete" />
      <GlassCard strong className="p-8 flex flex-col items-center text-center">
        <ProgressRing value={pct} size={140} stroke={11} label={`${pct}%`} sublabel="knowledge score" tone={pct >= 70 ? "#34d399" : pct >= 40 ? "#fbbf24" : "#f87171"} />
        <p className="text-sm mt-4" style={{ color: "var(--text-dim)" }}>{score} of {QUIZ.length} answered correctly</p>
      </GlassCard>
      <div className="grid sm:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}><CheckCircle2 size={14} /> Strong areas</p>
          <div className="space-y-2">
            {Object.entries(topicResults).filter(([, v]) => v.correct === v.total).map(([topic]) => (
              <div key={topic} className="flex items-center gap-2 text-sm"><Check size={14} color="#34d399" /> {topic}</div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "#fbbf24" }}><AlertTriangle size={14} /> Needs improvement</p>
          <div className="space-y-2">
            {Object.entries(topicResults).filter(([, v]) => v.correct < v.total).map(([topic, v]) => (
              <div key={topic} className="flex items-center gap-2 text-sm"><XCircle size={14} color="#fbbf24" /> {topic} ({v.correct}/{v.total})</div>
            ))}
          </div>
        </GlassCard>
      </div>
      <GlassCard className="p-5 flex items-center gap-3">
        <RefreshCw size={16} color="#67e8f9" className="shrink-0" />
        <p className="text-sm" style={{ color: "#c7cede" }}>Your learning path has been updated — Probability now appears earlier in your roadmap.</p>
      </GlassCard>
      <button onClick={() => setPhase("intro")} className="lp-btn-ghost px-5 py-2.5 rounded-lg text-sm">Retake assessment</button>
    </div>
  );
}

/* ============================== RESUME VIEW ============================== */

function ResumeView() {
  const [phase, setPhase] = useState("idle"); // idle | analyzing | results
  const [fileName, setFileName] = useState(null);

  const analyze = () => { setPhase("analyzing"); setTimeout(() => setPhase("results"), 1800); };

  if (phase === "idle") {
    return (
      <div className="max-w-xl mx-auto">
        <SectionHeader eyebrow="Resume intelligence" title="Analyze your resume" subtitle="Simulated ATS scoring and skill-gap analysis against your target role." />
        <GlassCard strong className="p-10 text-center border-dashed">
          <UploadCloud size={30} color="#67e8f9" className="mx-auto mb-4" />
          <p className="text-sm mb-1">{fileName || "Drop your resume here, or browse"}</p>
          <p className="text-xs mb-6" style={{ color: "var(--text-dim)" }}>PDF or DOCX, up to 5MB</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setFileName("Alex_Resume_2026.pdf")} className="lp-btn-ghost px-5 py-2.5 rounded-lg text-sm">Choose file</button>
            <button onClick={analyze} disabled={!fileName} className="lp-btn-primary px-5 py-2.5 rounded-lg text-sm" style={{ opacity: fileName ? 1 : 0.4, pointerEvents: fileName ? "auto" : "none" }}>Analyze resume</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (phase === "analyzing") {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <Loader2 size={30} color="#67e8f9" className="animate-spin mb-4" />
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>Parsing {fileName} against AI/ML Engineer requirements...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SectionHeader eyebrow="Results" title="Resume analysis" />
      <div className="grid sm:grid-cols-3 gap-4">
        <GlassCard strong className="p-6 flex flex-col items-center">
          <ProgressRing value={78} size={100} stroke={9} sublabel="ATS score" tone="#22d3ee" />
        </GlassCard>
        <GlassCard className="p-6 flex flex-col justify-center">
          <p className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>Technical skills</p>
          <p className="lp-display text-2xl font-semibold mb-2">8<span className="text-base" style={{ color: "var(--text-dim)" }}>/12 required</span></p>
          <ProgressBar value={67} tone="cyan" height={6} />
        </GlassCard>
        <GlassCard className="p-6 flex flex-col justify-center">
          <p className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>Soft skills</p>
          <p className="lp-display text-2xl font-semibold mb-2">4<span className="text-base" style={{ color: "var(--text-dim)" }}>/7 required</span></p>
          <ProgressBar value={57} tone="violet" height={6} />
        </GlassCard>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "#fbbf24" }}><AlertTriangle size={14} /> Missing skills</p>
          <div className="flex flex-wrap gap-1.5">{["Docker", "Kubernetes", "System Design"].map(s => <Pill key={s} tone="amber">{s}</Pill>)}</div>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "#67e8f9" }}><Sparkles size={14} /> Suggested improvements</p>
          <ul className="space-y-2 text-sm" style={{ color: "#c7cede" }}>
            {["Add measurable project outcomes", "Expand technical skills section", "Add a relevant certification", "Link your GitHub projects"].map(t => (
              <li key={t} className="flex items-start gap-2"><ChevronRight size={13} className="mt-0.5 shrink-0" style={{ color: "#67e8f9" }} /> {t}</li>
            ))}
          </ul>
        </GlassCard>
      </div>
      <button onClick={() => setPhase("idle")} className="lp-btn-ghost px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 w-fit"><RefreshCw size={14} /> Analyze another resume</button>
    </div>
  );
}

/* ============================== PROJECTS / CERTIFICATIONS ============================== */

function ProjectsView({ added, toggleAdded }) {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Build to prove it" title="Recommended projects" subtitle="Chosen to close your current skill gaps and strengthen your portfolio." />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {PROJECTS.map(p => (
          <GlassCard key={p.id} hover className="p-5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Pill tone={p.difficulty === "Advanced" ? "violet" : "cyan"}>{p.difficulty}</Pill>
              <Pill tone="cyan">{p.match}% match</Pill>
            </div>
            <p className="text-sm font-semibold mb-1.5">{p.title}</p>
            <p className="text-xs mb-3 flex-1" style={{ color: "#8b93a7" }}>{p.desc}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">{p.skills.map(s => <Pill key={s}>{s}</Pill>)}</div>
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill={i < p.impact ? "#fbbf24" : "none"} color="#fbbf24" />)}
              <span className="text-xs ml-1" style={{ color: "var(--text-dim)" }}>career impact</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button className="lp-btn-ghost text-xs py-2 rounded-lg flex-1">View project</button>
              <button onClick={() => toggleAdded(p.id)} className="text-xs py-2 rounded-lg flex-1 flex items-center justify-center gap-1"
                style={added.has(p.id) ? { background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.4)", color: "#6ee7b7" } : { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.35)", color: "#67e8f9" }}>
                {added.has(p.id) ? <><Check size={13} /> Added</> : "Add to roadmap"}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function CertificationsView({ added, toggleAdded }) {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Validate your skills" title="Recommended certifications" subtitle="Ranked by relevance to your target role and current gaps." />
      <div className="grid md:grid-cols-2 gap-5">
        {CERTIFICATIONS.map(c => (
          <GlassCard key={c.id} hover className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.14)" }}>
              <Award size={20} color="#c4b5fd" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-semibold">{c.title}</p>
                <Pill tone="cyan">{c.match}%</Pill>
              </div>
              <p className="text-xs mb-2" style={{ color: "var(--text-dim)" }}>{c.provider} · {c.duration} · {c.difficulty}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">{c.skills.map(s => <Pill key={s}>{s}</Pill>)}</div>
              <button onClick={() => toggleAdded(c.id)} className="text-xs px-3 py-1.5 rounded-lg"
                style={added.has(c.id) ? { background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.4)", color: "#6ee7b7" } : { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.35)", color: "#67e8f9" }}>
                {added.has(c.id) ? "Added to roadmap ✓" : "Add to roadmap"}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ============================== CAREER INTELLIGENCE ============================== */

function CareerView() {
  const matched = CAREER_SKILLS.filter(s => s.have).length;
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Career intelligence" title="Target career: AI / ML Engineer" />
      <div className="grid sm:grid-cols-3 gap-4">
        <GlassCard strong className="p-6 flex flex-col items-center"><ProgressRing value={94} size={100} stroke={9} sublabel="career match" tone="#22d3ee" /></GlassCard>
        <GlassCard strong className="p-6 flex flex-col items-center"><ProgressRing value={72} size={100} stroke={9} sublabel="readiness" tone="#8b5cf6" /></GlassCard>
        <GlassCard className="p-6 flex flex-col justify-center items-center text-center">
          <p className="lp-display text-2xl font-semibold">{matched}<span className="text-base" style={{ color: "var(--text-dim)" }}>/{CAREER_SKILLS.length}</span></p>
          <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>skills matched</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <SectionHeader title="Skills comparison" subtitle="Your skills vs. industry requirements" />
        <div className="space-y-2">
          {CAREER_SKILLS.map(s => (
            <div key={s.skill} className="flex items-center justify-between py-2.5 px-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-sm">{s.skill}</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-xs w-24" style={{ color: s.have ? "#6ee7b7" : "#f87171" }}>
                  {s.have ? <CheckCircle2 size={14} /> : <XCircle size={14} />} You
                </div>
                <div className="flex items-center gap-1.5 text-xs w-24" style={{ color: "#6ee7b7" }}>
                  <CheckCircle2 size={14} /> Required
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard strong className="p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(34,211,238,0.12)" }}>
          <Bot size={18} color="#67e8f9" />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">AI career advice</p>
          <p className="text-sm" style={{ color: "#c7cede" }}>
            You're 72% ready for your target role. Focus on Docker, System Design and Deep Learning over the next 6 weeks to close the largest gaps.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

/* ============================== PROFILE ============================== */

function ImagePreviewModal({ open, imageSrc, fileInfo, onConfirm, onCancel }) {
  if (!open || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md lp-fade-up">
      <div className="w-full max-w-md lp-glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)" }}>
              <Camera size={16} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="lp-display text-base font-semibold text-white">Preview Profile Picture</h3>
              <p className="text-xs text-slate-400">Confirm circular crop for your profile</p>
            </div>
          </div>
          <button type="button" onClick={onCancel} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="relative w-36 h-36 rounded-full p-1 ring-4 ring-cyan-400/40 shadow-2xl overflow-hidden bg-black/40 flex items-center justify-center">
            <img
              src={imageSrc}
              alt="Profile preview"
              className="w-full h-full object-cover rounded-full select-none"
            />
          </div>
          {fileInfo && (
            <div className="text-center text-xs text-slate-300 space-y-0.5">
              <p className="font-medium truncate max-w-xs">{fileInfo.name}</p>
              <p className="text-slate-400">{fileInfo.size}</p>
            </div>
          )}
          <p className="text-[11px] text-center text-cyan-300/80 max-w-xs">
            This image will be displayed across your profile, navigation header, and landing page.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Check size={15} /> Save Picture
          </button>
        </div>
      </div>
    </div>
  );
}

function EditProfileModal({ open, onClose, student, onSave }) {
  const [formData, setFormData] = useState(student || STUDENT);

  useEffect(() => {
    if (student) setFormData(student);
  }, [student, open]);

  if (!open) return null;

  const avatarStyles = [
    { name: "Cyan / Violet", value: "linear-gradient(135deg, #22d3ee, #8b5cf6)" },
    { name: "Blue / Orange", value: "linear-gradient(135deg, #3b82f6, #f97316)" },
    { name: "Emerald / Cyan", value: "linear-gradient(135deg, #10b981, #06b6d4)" },
    { name: "Violet / Pink", value: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
    { name: "Amber / Fire", value: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md lp-fade-up">
      <div className="w-full max-w-xl lp-glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)" }}>
              <Edit3 size={16} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="lp-display text-base font-semibold text-white">Edit Profile</h3>
              <p className="text-xs text-slate-400">Update your personal and academic information</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto lp-scrollbar p-6 space-y-4">
          {/* Avatar Theme Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Avatar Theme (Fallback for photo)</label>
            <div className="flex items-center gap-3">
              {avatarStyles.map((s) => (
                <button
                  type="button"
                  key={s.name}
                  onClick={() => setFormData({ ...formData, avatarColor: s.value })}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    formData.avatarColor === s.value ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#060911] scale-110" : "opacity-70 hover:opacity-100"
                  }`}
                  style={{ background: s.value }}
                  title={s.name}
                >
                  {formData.avatarColor === s.value && <Check size={14} color="#04121a" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. Alex Chen"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Username *</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 text-sm">@</span>
                <input
                  type="text"
                  required
                  value={(formData.username || "").replace(/^@/, "")}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/^@/, "") })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="alexchen"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. alex.chen@university.edu"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone Number</label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. +1 (555) 234-5678"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree / Major</label>
              <input
                type="text"
                value={formData.degree || ""}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Academic Year</label>
              <input
                type="text"
                value={formData.year || ""}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. 3rd Year"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Career</label>
              <select
                value={formData.targetCareer || ""}
                onChange={(e) => setFormData({ ...formData, targetCareer: e.target.value })}
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
              >
                {ONBOARD_CAREERS.map((c) => (
                  <option key={c} value={c} className="bg-[#0a0f1c] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Location</label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g. San Francisco, CA"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Bio / Professional Headline</label>
            <textarea
              rows={3}
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your learning goals and tech passions..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">GitHub Profile</label>
              <input
                type="text"
                value={formData.github || ""}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="github.com/username"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">LinkedIn Profile</label>
              <input
                type="text"
                value={formData.linkedin || ""}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="linkedin.com/in/username"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="lp-btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Check size={15} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileView({ student = STUDENT, onUpdateStudent, onBack }) {
  const [showAssessment, setShowAssessment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingFileInfo, setPendingFileInfo] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const fileInputRef = useRef(null);
  const profile = student || STUDENT;

  const handleTriggerFileSelect = () => {
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError("Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("Image size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result) {
        setPendingImage(result);
        const formattedSize = file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
        setPendingFileInfo({ name: file.name, size: formattedSize });
        setPreviewOpen(true);
        setUploadError(null);
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmImage = () => {
    if (pendingImage) {
      const updated = { ...profile, profilePicture: pendingImage };
      if (onUpdateStudent) {
        onUpdateStudent(updated, "Profile picture updated successfully");
      }
    }
    setPreviewOpen(false);
    setPendingImage(null);
    setPendingFileInfo(null);
  };

  const handleCancelImage = () => {
    setPreviewOpen(false);
    setPendingImage(null);
    setPendingFileInfo(null);
  };

  const handleRemovePicture = () => {
    const updated = { ...profile, profilePicture: null };
    if (onUpdateStudent) {
      onUpdateStudent(updated, "Profile picture removed");
    }
  };

  if (showAssessment) {
    return (
      <div className="space-y-6">
        <button onClick={() => setShowAssessment(false)} className="flex items-center gap-1.5 text-sm cursor-pointer hover:text-white transition-colors" style={{ color: "var(--text-dim)" }}>
          <ArrowLeft size={15} /> Back to profile
        </button>
        <AssessmentView />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input for picture upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">Account & Portfolio</span>
            </div>
            <h1 className="lp-display text-2xl font-bold text-white">Profile</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search profile..."
              className="bg-transparent text-sm text-white placeholder-slate-400 outline-none w-36 md:w-48"
            />
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ring-2 ring-cyan-400/40 overflow-hidden"
            style={{ background: profile.avatarColor || "linear-gradient(135deg,#22d3ee,#8b5cf6)", color: "#04121a" }}
          >
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span>{profile.name ? profile.name.charAt(0) : "A"}</span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Header Hero Card */}
      <GlassCard strong className="p-6 md:p-8 relative overflow-hidden" hover>
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%)" }} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar with status and edit overlay */}
            <div className="relative group shrink-0 self-start sm:self-center">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-2xl transition-transform group-hover:scale-105 overflow-hidden relative border-2 border-white/15"
                style={{ background: profile.avatarColor || "linear-gradient(135deg,#22d3ee,#8b5cf6)", color: "#04121a" }}
              >
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{profile.name ? profile.name.charAt(0) : "A"}</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleTriggerFileSelect}
                title="Upload Profile Picture"
                className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-[#0a0f1c] border border-white/20 flex items-center justify-center text-cyan-400 hover:text-white hover:border-cyan-400 transition-colors shadow-lg cursor-pointer"
              >
                <Camera size={15} />
              </button>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#060911]" title="Active status: Online" />
            </div>

            {/* Main Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="lp-display text-2xl md:text-3xl font-semibold tracking-tight text-white">{profile.name}</h2>
                <span className="text-sm font-medium text-cyan-400">@{profile.username || "alexchen"}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)", color: "#67e8f9" }}>
                  <ShieldCheck size={12} /> Verified Learner
                </span>
              </div>

              {/* Email and Meta */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
                  <Mail size={14} className="text-cyan-400" />
                  <span>{profile.email}</span>
                </a>
                <span>•</span>
                <span>{profile.degree} · {profile.year}</span>
                {profile.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-violet-400" />
                      <span>{profile.location}</span>
                    </span>
                  </>
                )}
              </div>

              {/* Bio summary */}
              {profile.bio && (
                <p className="text-xs md:text-sm max-w-2xl pt-1 text-slate-300 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Career Goal & Readiness Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                <Pill tone="violet">Target: {profile.targetCareer}</Pill>
                <Pill tone="cyan">94% career match</Pill>
                <Pill tone="green">72% Readiness</Pill>
              </div>

              {/* Picture Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleTriggerFileSelect}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera size={12} /> {profile.profilePicture ? "Change Picture" : "Add Picture"}
                </button>
                {profile.profilePicture && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} /> Remove Picture
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile Action Button */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="lp-btn-primary px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle size={14} />
            <span>{uploadError}</span>
          </div>
        )}
      </GlassCard>

      {/* Profile Overview Description */}
      <p className="text-sm max-w-4xl" style={{ color: "var(--text-dim)" }}>
        This profile combines your academic background, previous learning, technical skills, projects, certifications, interests, assessments and
        career aspirations to generate your adaptive learning pathway, recommend personalized resources, identify skill gaps, validate conceptual
        understanding and drive your AI career guidance.
      </p>

      {/* Grid: Academic & Contact Profile */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover>
          <SectionHeader title="Academic profile" />
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "var(--text-dim)" }}>Full name</span>
              <span className="font-medium text-white">{profile.name}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "var(--text-dim)" }}>Username</span>
              <span className="font-medium text-cyan-300">@{profile.username || "alexchen"}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "var(--text-dim)" }}>Degree program</span>
              <span className="font-medium text-white">{profile.degree}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "var(--text-dim)" }}>Current standing</span>
              <span className="font-medium text-white">{profile.year}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "var(--text-dim)" }}>Target career</span>
              <span className="font-medium text-cyan-300">{profile.targetCareer}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span style={{ color: "var(--text-dim)" }}>Enrollment status</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 size={13} /> Active Student
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover>
          <SectionHeader title="Contact & Social links" />
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
                <Mail size={14} className="text-cyan-400" /> Email
              </span>
              <a href={`mailto:${profile.email}`} className="text-white hover:text-cyan-300 transition-colors font-medium">
                {profile.email}
              </a>
            </div>
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
                <Phone size={14} className="text-violet-400" /> Phone
              </span>
              <span className="font-medium text-white">{profile.phone || "+1 (555) 234-5678"}</span>
            </div>
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
                <MapPin size={14} className="text-amber-400" /> Location
              </span>
              <span className="font-medium text-white">{profile.location || "San Francisco, CA"}</span>
            </div>
            <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
                <Globe size={14} className="text-slate-300" /> GitHub
              </span>
              <span className="font-medium text-cyan-400 flex items-center gap-1 cursor-pointer hover:underline">
                {profile.github || "github.com/alexchen-dev"} <ExternalLink size={11} />
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
                <Globe size={14} className="text-blue-400" /> LinkedIn
              </span>
              <span className="font-medium text-blue-400 flex items-center gap-1 cursor-pointer hover:underline">
                {profile.linkedin || "linkedin.com/in/alexchen-ai"} <ExternalLink size={11} />
              </span>
             {/* Grid: Previous Learning & Certifications/Interests */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Previous Learning Card */}
        <GlassCard className="p-6 relative overflow-hidden" hover>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/10">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-wide">Previous Learning</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {(profile.learningRecords || []).length} Completed
                  </span>
                </div>
                <p className="text-xs text-slate-400">Completed coursework, degrees, or online studies</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setLearningToEdit && setLearningToEdit(null); setLearningModalOpen && setLearningModalOpen(true); }}
              className="lp-btn-primary px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus size={14} /> Add Learning
            </button>
          </div>

          {(profile.learningRecords || []).length > 0 ? (
            <div className="grid gap-3">
              {profile.learningRecords.map(c => (
                <div key={c.id || c.courseName || c.title} className="group relative p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/40 transition-all duration-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">{c.courseName || c.title}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 font-medium">Verified</span>
                        {handleDeleteLearning && (
                          <button type="button" onClick={() => handleDeleteLearning(c.id)} className="text-slate-400 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity p-0.5">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="text-slate-300 font-medium">{c.provider || "Self-Paced"}</span>
                      {(c.completionYear || c.when) && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">{c.completionYear || c.when}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-2.5">
              <BookOpen size={32} className="text-slate-600" />
              <p className="text-sm text-slate-300 font-medium">No previous learning added yet.</p>
              <p className="text-xs text-slate-500">Click "+ Add Learning" to add your completed coursework.</p>
            </div>
          )}
        </GlassCard>

        {/* Certifications & Interests Card */}
        <GlassCard className="p-6 relative overflow-hidden" hover>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-md shadow-violet-500/10">
                <Award size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-wide">Certifications & Interests</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    {(profile.certificationsList || []).length} Credentials
                  </span>
                </div>
                <p className="text-xs text-slate-400">Verified credentials & target technical domains</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setCertToEdit && setCertToEdit(null); setCertModalOpen && setCertModalOpen(true); }}
              className="lp-btn-primary px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus size={14} /> Add Cert
            </button>
          </div>

          {/* Certifications Section */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award size={13} className="text-violet-400" /> Active Certifications
              </p>
            </div>

            {(profile.certificationsList || []).length > 0 ? (
              <div className="grid gap-2.5">
                {profile.certificationsList.map(c => (
                  <div key={c.id || c.name || c.title} className="group p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-violet-500/40 transition-all duration-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Award size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">{c.name || c.title}</p>
                        <p className="text-xs text-slate-400">{c.issuer || c.provider || "Organization"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-medium shrink-0">
                        Credential
                      </span>
                      {handleDeleteCert && (
                        <button type="button" onClick={() => handleDeleteCert(c.id)} className="text-slate-400 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity p-0.5">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">No certifications added yet. Click "+ Add Cert" above.</p>
            )}
          </div>

          {/* Areas of Interest Section */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan-400" /> Areas of Interest
              </p>
              {setInterestModalOpen && (
                <button
                  type="button"
                  onClick={() => setInterestModalOpen(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Plus size={12} /> Add Interest
                </button>
              )}
            </div>
            {(profile.interests || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map(i => (
                  <div key={i} className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/15 to-cyan-500/15 border border-violet-500/30 text-xs text-violet-200 hover:border-cyan-400/60 transition-all shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>{i}</span>
                    {handleDeleteInterest && (
                      <button type="button" onClick={() => handleDeleteInterest(i)} className="text-slate-400 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5">
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-1">No interests added yet.</p>
            )}
          </div>
        </GlassCard>
      </div>         </div>
          </div>
        </GlassCard>
      </div>

      {/* Technical Skills with Radar Chart */}
      <GlassCard className="p-6" hover>
        <SectionHeader title="Technical skills" subtitle="Detected from courses, projects, certifications and assessments" />
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            {SKILL_GROUPS.map((g, gi) => (
              <div key={g.name} className="mb-5 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{g.name}</span>
                  <span className="text-sm" style={{ color: "#67e8f9" }}>{g.level}%</span>
                </div>
                <ProgressBar value={g.level} tone="cyan" height={8} delay={gi * 80} />
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="text-xs mr-1 flex items-center gap-1" style={{ color: "#6ee7b7" }}><CheckCircle2 size={13} /></span>
              {STRENGTHS.map(s => <Pill key={s} tone="green">{s}</Pill>)}
              {GAPS.map(s => <Pill key={s} tone="amber">{s}</Pill>)}
            </div>
          </div>
          <div className="lg:col-span-2" style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <RadarChart data={RADAR_DATA} outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.12)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#8b93a7", fontSize: 10 }} />
                <RechartsRadar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.28} />
                <RTooltip contentStyle={{ background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* Projects */}
      <GlassCard className="p-6" hover>
        <SectionHeader title="Projects portfolio" subtitle="Shipped applications and repositories" />
        <div className="grid md:grid-cols-3 gap-4">
          {OWNED_PROJECTS.map(p => (
            <div key={p.title} className="p-4 rounded-xl lp-glass flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-white mb-1.5">{p.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>{p.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-cyan-400">
                <span>Verified repository</span>
                <FolderKanban size={13} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Assessments */}
      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <SectionHeader title="Assessments" subtitle="Latest knowledge validation results" />
          <button onClick={() => setShowAssessment(true)} className="lp-btn-primary px-4 py-2 rounded-lg text-sm cursor-pointer">
            Take new assessment
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing value={78} size={96} stroke={8} sublabel="last score" />
          <div className="flex-1 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}><CheckCircle2 size={13} /> Strong</p>
              <div className="flex flex-wrap gap-1.5">{["Python", "OOP"].map(s => <Pill key={s} tone="green">{s}</Pill>)}</div>
            </div>
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#fbbf24" }}><AlertTriangle size={13} /> Needs improvement</p>
              <div className="flex flex-wrap gap-1.5">{["SQL joins", "Probability"].map(s => <Pill key={s} tone="amber">{s}</Pill>)}</div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Career Aspirations */}
      <GlassCard strong className="p-6" hover>
        <SectionHeader title="Career aspirations" />
        <div className="flex flex-wrap items-center gap-8">
          <div><p className="lp-display text-xl font-semibold text-white">{profile.targetCareer}</p><p className="text-xs" style={{ color: "var(--text-dim)" }}>Target career</p></div>
          <div><p className="lp-display text-xl font-semibold" style={{ color: "#67e8f9" }}>94%</p><p className="text-xs" style={{ color: "var(--text-dim)" }}>Career match</p></div>
          <div><p className="lp-display text-xl font-semibold" style={{ color: "#c4b5fd" }}>72%</p><p className="text-xs" style={{ color: "var(--text-dim)" }}>Readiness</p></div>
        </div>
      </GlassCard>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        student={profile}
        onSave={(updated) => {
          if (onUpdateStudent) onUpdateStudent(updated, "Profile updated successfully");
        }}
      />

      {/* Image Preview & Confirmation Modal */}
      <ImagePreviewModal
        open={previewOpen}
        imageSrc={pendingImage}
        fileInfo={pendingFileInfo}
        onConfirm={handleConfirmImage}
        onCancel={handleCancelImage}
      />
    </div>
  );
}

/* ============================== SETTINGS ============================== */

function SettingsView({ student = STUDENT }) {
  const [prefs, setPrefs] = useState({ dailyReminders: true, weeklyDigest: true, aiSuggestions: true, pace: "Balanced" });
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));
  const user = student || STUDENT;
  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader eyebrow="Account" title="Settings" />
      <GlassCard className="p-6" hover>
        <SectionHeader title="Notifications" />
        {[
          ["dailyReminders", "Daily learning reminders", "A short nudge to keep your streak going."],
          ["weeklyDigest", "Weekly progress digest", "A summary of roadmap progress and new recommendations."],
          ["aiSuggestions", "AI Mentor proactive tips", "Let your AI Mentor message you when it detects a gap."],
        ].map(([key, label, desc]) => (
          <div key={key} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p className="text-sm">{label}</p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>{desc}</p>
            </div>
            <button onClick={() => toggle(key)} className="w-11 h-6 rounded-full relative shrink-0 transition-colors"
              style={{ background: prefs[key] ? "linear-gradient(90deg,#22d3ee,#3b82f6)" : "rgba(255,255,255,0.12)" }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: prefs[key] ? 22 : 2 }} />
            </button>
          </div>
        ))}
      </GlassCard>
      <GlassCard className="p-6" hover>
        <SectionHeader title="Learning pace" subtitle="Adjusts how densely your roadmap schedules new material" />
        <div className="grid grid-cols-3 gap-3">
          {["Relaxed", "Balanced", "Intensive"].map(p => (
            <button key={p} onClick={() => setPrefs({ ...prefs, pace: p })} className="py-3 rounded-xl text-sm transition-all"
              style={prefs.pace === p
                ? { background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)", color: "#67e8f9" }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}>
              {p}
            </button>
          ))}
        </div>
      </GlassCard>
      <GlassCard className="p-6" hover>
        <SectionHeader title="Account" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}><span style={{ color: "var(--text-dim)" }}>Name</span><span className="text-white font-medium">{user.name}</span></div>
          <div className="flex justify-between py-1.5"><span style={{ color: "var(--text-dim)" }}>Email</span><span className="text-cyan-400 font-medium">{user.email}</span></div>
        </div>
      </GlassCard>
    </div>
  );
}

/* ============================== AI ASSISTANT ============================== */

function AIAssistant({ open, setOpen }) {
  const [messages, setMessages] = useState([
    { from: "ai", text: `Hi ${STUDENT.name} 👋\n\nYou're currently learning Machine Learning. Your biggest knowledge gap is Probability.\n\nWould you like me to explain it, or build you a 3-day study plan?` },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const reply = (text) => {
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { from: "ai", text }]);
      setTyping(false);
    }, 900);
  };

  const send = (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { from: "user", text }]);
    setInput("");
    const canned = {
      "Explain this": "Probability measures how likely an event is, from 0 (impossible) to 1 (certain). For independent events A and B, P(A ∩ B) = P(A) × P(B) — this shows up constantly in ML for Bayesian models and Naive Bayes classifiers.",
      "Create study plan": "Here's a 3-day plan:\nDay 1 — Core probability rules & Bayes' theorem (2h)\nDay 2 — Distributions: binomial, normal, Poisson (2h)\nDay 3 — Practice problems + a short quiz to confirm mastery (1.5h)",
      "Test my knowledge": "Sure — I've queued a short 4-question probability check into your Assessment tab. Head there whenever you're ready.",
      "Recommend resources": "Try 'Probability & Statistics for ML' (93% match, 8h) — it's already in your Resources tab and maps directly to this gap.",
      "Analyze my progress": "You're at 64% overall learning progress, 12-day streak. Statistics is 45% complete — finishing it unlocks Machine Learning Foundations.",
    };
    reply(canned[text] || "Good question — based on your profile, I'd suggest starting with your current roadmap milestone: Statistics & Probability. Want a study plan for it?");
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="lp-btn-primary fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl">
        <Bot size={22} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[92vw] max-w-sm h-[70vh] max-h-[560px] lp-glass-strong rounded-2xl flex flex-col overflow-hidden lp-fade-up shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#22d3ee,#8b5cf6)" }}><Bot size={15} color="#04121a" /></div>
          <div>
            <p className="text-sm font-semibold leading-tight">AI Mentor</p>
            <p className="text-xs leading-tight" style={{ color: "#6ee7b7" }}>Online</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)}><X size={18} style={{ color: "var(--text-dim)" }} /></button>
      </div>

      <div className="flex-1 overflow-y-auto lp-scrollbar px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line"
              style={m.from === "user"
                ? { background: "linear-gradient(100deg,#22d3ee,#3b82f6)", color: "#04121a" }
                : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#eef1f7" }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl text-sm flex items-center gap-1" style={{ background: "rgba(255,255,255,0.06)" }}>
              <span className="lp-float-3" style={{ animationDuration: ".9s" }}>●</span>
              <span className="lp-float-3" style={{ animationDuration: ".9s", animationDelay: ".15s" }}>●</span>
              <span className="lp-float-3" style={{ animationDuration: ".9s", animationDelay: ".3s" }}>●</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {["Explain this", "Create study plan", "Test my knowledge", "Recommend resources", "Analyze my progress"].map(q => (
          <button key={q} onClick={() => send(q)} className="text-xs px-2.5 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#c7cede" }}>{q}</button>
        ))}
      </div>
      <div className="p-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="Ask your AI mentor..." className="flex-1 bg-transparent text-sm outline-none px-2" style={{ color: "#eef1f7" }} />
        <button onClick={() => send(input)} className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#22d3ee,#8b5cf6)" }}>
          <Send size={14} color="#04121a" />
        </button>
      </div>
    </div>
  );
}

/* ============================== ROOT APP ============================== */

export default function App() {
  const [stage, setStage] = useState("login"); // landing | login | onboarding | analyzing | app
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

  const handleDemoLogin = () => {
    setStudent(STUDENT);
    setToast("Welcome Hackathon Judge! Signed in as Alex Chen");
    setStage("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStudentLogin = ({ email, rememberMe }) => {
    const current = loadStoredProfile();
    const updated = { ...current, email: email || current.email };
    setStudent(updated);
    if (rememberMe) {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("pathforge_user_profile", JSON.stringify(updated));
        }
      } catch (e) {}
    }
    setToast(`Welcome back, ${updated.name}!`);
    setStage("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleAdded = (id) => {
    setAdded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else { next.add(id); setToast("Added to your roadmap"); }
      return next;
    });
  };

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

  const go = (id) => { setStage("app"); setActive(id); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const navigate = (id) => {
    setDrawerOpen(false);
    if (id === "home") { setStage("landing"); return; }
    if (id === "login") { setStage("login"); return; }
    if (id === "build-path") { setStage("onboarding"); return; }
    go(id);
  };

  const titleMap = Object.fromEntries(NAV_MENU.map(n => [n.id, n.label]));
  const activeDrawerId = stage === "landing" ? "home" : (stage === "login" ? "login" : (stage === "onboarding" || stage === "analyzing" ? "build-path" : (stage === "app" ? active : null)));

  return (
    <div className="lp-root">
      <GlobalStyle />
      <HamburgerButton onClick={() => setDrawerOpen(true)} />
      
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} active={activeDrawerId} onNavigate={navigate} />

      {stage === "landing" && (
        <LandingPage
          onStart={() => setStage("onboarding")}
          onExplore={() => go("dashboard")}
          onProfile={() => go("profile")}
          student={student}
          onLogin={() => setStage("login")}
          onDemoLogin={handleDemoLogin}
        />
      )}

      {stage === "login" && (
        <LoginView
          onDemoLogin={handleDemoLogin}
          onStudentLogin={handleStudentLogin}
          onBackToHome={() => setStage("landing")}
          onStartOnboarding={() => setStage("onboarding")}
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
            {active === "settings" && <SettingsView student={student} />}
          </main>
          <AIAssistant open={assistantOpen} setOpen={setAssistantOpen} />
          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
      )}
    </div>
  );
}
