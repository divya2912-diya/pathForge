import {
  Home, Radar, Route, LayoutGrid, Sparkles, FileText, FolderKanban, Award,
  Compass, User, Settings, Video, BookOpen, FileCode2
} from "lucide-react";

export const STUDENT = {
  name: "Alex Chen",
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
};

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
  { id: "build-path", label: "Build My Learning Path", icon: Sparkles },
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "roadmap", label: "Learning Roadmap", icon: Route },
  { id: "resources", label: "Resources", icon: LayoutGrid },
  { id: "resume", label: "Resume Intelligence", icon: FileText },
  { id: "career", label: "Career Intelligence", icon: Compass },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

export const PREVIOUS_LEARNING = [
  { title: "Python Programming Fundamentals", provider: "University coursework", when: "Completed · Year 1" },
  { title: "Data Structures & Algorithms", provider: "University coursework", when: "Completed · Year 2" },
  { title: "Intro to Machine Learning", provider: "Self-paced online course", when: "Completed · Year 3" },
  { title: "Relational Databases & SQL", provider: "University coursework", when: "Completed · Year 2" },
];

export const OWNED_PROJECTS = [
  { title: "AI Chatbot", desc: "A rule-based + intent-classification chatbot for campus FAQs." },
  { title: "Smart Attendance System", desc: "Face-recognition attendance tracker built with OpenCV." },
  { title: "Movie Recommendation System", desc: "Content-based recommender using cosine similarity." },
];

export const OWNED_CERTIFICATIONS = [
  { title: "Python (Basic)", provider: "HackerRank" },
  { title: "Cloud Fundamentals", provider: "Google Cloud Skills Boost" },
];

export const INTERESTS = ["Artificial Intelligence", "Backend Development", "Cloud & DevOps"];

export const RESOURCE_ICONS = { video: Video, doc: FileText, code: FileCode2, book: BookOpen };
export const ONBOARD_STEPS = ["Academic Background", "Current Skills", "Projects & Certifications", "Interests", "Target Career", "Learning Preferences"];
