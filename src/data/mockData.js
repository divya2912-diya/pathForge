import {
  Home, LayoutDashboard, Radar, Route, LayoutGrid, Sparkles, FileText, FolderKanban, Award,
  Compass, User, Settings, Video, BookOpen, FileCode2
} from "lucide-react";

export const SKILL_GROUPS = [
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

export const RADAR_DATA = [
  { subject: "Programming", value: 91 },
  { subject: "Data", value: 61 },
  { subject: "ML/AI", value: 48 },
  { subject: "Systems", value: 24 },
  { subject: "Math/Stats", value: 44 },
  { subject: "Communication", value: 66 },
];

export const STRENGTHS = ["Python", "Problem Solving", "Object-Oriented Design"];
export const GAPS = ["Deep Learning", "Docker", "System Design"];

export const ROADMAP = [
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

export const RESOURCES = [
  // AI / Data Science
  { id: 1, title: "Python for Data Science", type: "Course", icon: "video", difficulty: "Beginner", time: "6h", match: 96,
    reason: "You have strong Python fundamentals but limited NumPy/Pandas exposure.", domain: "Data Science", url: "https://www.youtube.com/embed/LHBE6Q9XlzI" },
  { id: 2, title: "Probability & Statistics for ML", type: "Course", icon: "video", difficulty: "Intermediate", time: "8h", match: 93,
    reason: "Probability is your lowest-scoring assessment topic — this closes it fast.", domain: "Data Science", url: "https://www.youtube.com/embed/v9qA2ZgD-oA" },
  { id: 3, title: "Deep Learning Specialization Notes", type: "Documentation", icon: "doc", difficulty: "Advanced", time: "10h", match: 89,
    reason: "Directly maps to the next roadmap milestone: Deep Learning.", domain: "Data Science", url: "https://www.deeplearning.ai/" },
  
  // Web Development
  { id: 4, title: "React Crash Course 2024", type: "Course", icon: "video", difficulty: "Beginner", time: "2h", match: 95,
    reason: "Essential for modern frontend development.", domain: "Web Development", url: "https://www.youtube.com/embed/w7ejDZ8SWv8" },
  { id: 5, title: "Next.js Official Documentation", type: "Documentation", icon: "doc", difficulty: "Intermediate", time: "12h", match: 92,
    reason: "The industry standard for production React apps.", domain: "Web Development", url: "https://nextjs.org/docs" },
  { id: 6, title: "Full Stack Web Developer Roadmap", type: "Book", icon: "book", difficulty: "All levels", time: "24h", match: 85,
    reason: "Comprehensive guide to mastering the modern web.", domain: "Web Development", url: "https://roadmap.sh/full-stack" },
    
  // Cybersecurity
  { id: 7, title: "Ethical Hacking Full Course", type: "Course", icon: "video", difficulty: "Beginner", time: "14h", match: 98,
    reason: "Foundational knowledge for a career in InfoSec.", domain: "Cybersecurity", url: "https://www.youtube.com/embed/dz7Ntp7KQGA" },
  { id: 8, title: "OWASP Top 10 Explained", type: "Documentation", icon: "doc", difficulty: "Intermediate", time: "4h", match: 90,
    reason: "Critical web application vulnerabilities you must know.", domain: "Cybersecurity", url: "https://owasp.org/www-project-top-ten/" },
  { id: 9, title: "CTF Practice Problems", type: "Practice Problems", icon: "code", difficulty: "Advanced", time: "20h+", match: 87,
    reason: "Hands-on experience bypassing security controls.", domain: "Cybersecurity", url: "https://ctftime.org/" },
    
  // Cloud & DevOps
  { id: 10, title: "Docker for Beginners", type: "Course", icon: "video", difficulty: "Beginner", time: "4h", match: 88,
    reason: "Docker appears in 78% of engineering job listings you're targeting.", domain: "Cloud Computing", url: "https://www.youtube.com/embed/3c-iBn73dDE" },
  { id: 11, title: "AWS Certified Cloud Practitioner", type: "Course", icon: "video", difficulty: "Beginner", time: "13h", match: 94,
    reason: "The most demanded entry-level cloud certification.", domain: "Cloud Computing", url: "https://www.youtube.com/embed/SOTamWNgDKc" },
  { id: 12, title: "Kubernetes Official Docs", type: "Documentation", icon: "doc", difficulty: "Advanced", time: "15h", match: 82,
    reason: "Essential for enterprise scale orchestration.", domain: "Cloud Computing", url: "https://kubernetes.io/docs/home/" },
];

export const PROJECTS = [
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

export const CERTIFICATIONS = [
  { id: 1, title: "TensorFlow Developer Certificate", provider: "DeepLearning.AI", difficulty: "Intermediate", duration: "6-8 weeks", match: 92,
    skills: ["Deep Learning", "TensorFlow"] },
  { id: 2, title: "Docker & Kubernetes Essentials", provider: "Cloud Native Foundation", difficulty: "Beginner", duration: "3 weeks", match: 88,
    skills: ["Docker", "Kubernetes"] },
  { id: 3, title: "AWS Certified Machine Learning – Associate", provider: "AWS", difficulty: "Advanced", duration: "10 weeks", match: 85,
    skills: ["ML", "Cloud", "MLOps"] },
  { id: 4, title: "SQL for Data Analysis", provider: "Coursera", difficulty: "Beginner", duration: "2 weeks", match: 79,
    skills: ["SQL", "Data Analysis"] },
];

export const QUIZ = [
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

export const CAREER_SKILLS = [
  { skill: "Python", have: true },
  { skill: "SQL", have: true },
  { skill: "Machine Learning", have: true },
  { skill: "Statistics", have: true },
  { skill: "Deep Learning", have: false },
  { skill: "Docker", have: false },
  { skill: "System Design", have: false },
];

export const ONBOARD_CAREERS = [
  "AI/ML Engineer", "Software Engineer", "Data Scientist", "Cybersecurity Analyst",
  "Cloud Engineer", "Full Stack Developer", "UI/UX Designer",
];

export const NAV_MENU = [
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

export const PREVIOUS_LEARNING = [];

export const OWNED_PROJECTS = [
  { title: "AI Chatbot", desc: "A rule-based + intent-classification chatbot for campus FAQs." },
  { title: "Smart Attendance System", desc: "Face-recognition attendance tracker built with OpenCV." },
  { title: "Movie Recommendation System", desc: "Content-based recommender using cosine similarity." },
];

export const OWNED_CERTIFICATIONS = [];

export const INTERESTS = [];

export const RESOURCE_ICONS = { video: Video, doc: FileText, code: FileCode2, book: BookOpen };
export const ONBOARD_STEPS = ["Academic Background", "Current Skills", "Projects & Certifications", "Interests", "Target Career", "Learning Preferences"];
