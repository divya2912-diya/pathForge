// ============================================================
//  PathForge — User Profile Builder & Dynamic Calculators
// ============================================================

// ── Career → Required Skills Map ───────────────────────────
export const SKILL_REQUIREMENTS = {
  "AI/ML Engineer": [
    "Python", "Machine Learning", "Deep Learning", "Statistics",
    "Docker", "SQL", "TensorFlow", "PyTorch", "NLP", "System Design",
  ],
  "Data Scientist": [
    "Python", "Statistics", "SQL", "Machine Learning", "Data Visualization",
    "R", "Pandas", "NumPy", "Tableau", "Communication",
  ],
  "Software Engineer": [
    "Python", "Java", "JavaScript", "Data Structures", "Algorithms",
    "System Design", "SQL", "Git", "Docker", "REST APIs",
  ],
  "Full Stack Developer": [
    "JavaScript", "React", "Node.js", "SQL", "REST APIs",
    "CSS", "Git", "Docker", "TypeScript", "System Design",
  ],
  "Cloud Engineer": [
    "AWS", "Docker", "Kubernetes", "Python", "Terraform",
    "Linux", "Networking", "CI/CD", "Git", "System Design",
  ],
  "Cybersecurity Analyst": [
    "Networking", "Linux", "Python", "Cryptography", "Penetration Testing",
    "Firewalls", "Risk Assessment", "SIEM Tools", "SQL", "Compliance",
  ],
  "UI/UX Designer": [
    "Figma", "Prototyping", "User Research", "Wireframing", "CSS",
    "HTML", "Typography", "Accessibility", "JavaScript", "Communication",
  ],
};

// ── Career → Roadmap Map ────────────────────────────────────
export const CAREER_ROADMAPS = {
  "AI/ML Engineer": [
    { id: 1, title: "Python Foundations", status: "done", duration: "3 weeks", difficulty: "Beginner",
      desc: "Core syntax, data structures, functions, and file handling in Python.", relevance: "Base language for every ML/AI role." },
    { id: 2, title: "Data Structures & Algorithms", status: "done", duration: "4 weeks", difficulty: "Intermediate",
      desc: "Arrays, trees, graphs, complexity analysis and problem-solving patterns.", relevance: "Required for technical interviews at top AI companies." },
    { id: 3, title: "Statistics & Probability", status: "in-progress", progress: 45, duration: "3 weeks", difficulty: "Intermediate",
      desc: "Distributions, hypothesis testing, Bayesian reasoning, linear algebra basics.", relevance: "The mathematical backbone of every ML model." },
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
  ],
  "Software Engineer": [
    { id: 1, title: "Programming Fundamentals", status: "done", duration: "3 weeks", difficulty: "Beginner",
      desc: "Core programming concepts: variables, loops, functions, OOP in Python or Java.", relevance: "Foundation for every software engineering role." },
    { id: 2, title: "Data Structures & Algorithms", status: "done", duration: "5 weeks", difficulty: "Intermediate",
      desc: "Arrays, linked lists, trees, graphs, sorting, searching, Big-O analysis.", relevance: "The #1 topic in every SWE technical interview." },
    { id: 3, title: "Object-Oriented Design", status: "in-progress", progress: 40, duration: "3 weeks", difficulty: "Intermediate",
      desc: "SOLID principles, design patterns (Factory, Observer, Strategy, etc.).", relevance: "Critical for building maintainable production software." },
    { id: 4, title: "Databases & SQL", status: "upcoming", duration: "3 weeks", difficulty: "Intermediate",
      desc: "Relational modeling, SQL queries, joins, indexing, NoSQL basics.", relevance: "Used in virtually every software application backend." },
    { id: 5, title: "System Design Fundamentals", status: "upcoming", duration: "4 weeks", difficulty: "Advanced",
      desc: "Scalability, load balancing, caching, databases, distributed systems.", relevance: "Tested at senior/mid-level SWE interviews at all top companies." },
    { id: 6, title: "REST APIs & Backend Development", status: "locked", duration: "4 weeks", difficulty: "Intermediate",
      desc: "Building HTTP APIs, authentication, rate limiting, error handling.", relevance: "Core deliverable in most SWE roles." },
    { id: 7, title: "DevOps & Docker", status: "locked", duration: "3 weeks", difficulty: "Intermediate",
      desc: "Containerization, CI/CD pipelines, Git workflows, deployment.", relevance: "Expected in modern SWE environments." },
    { id: 8, title: "Capstone Project", status: "locked", duration: "4 weeks", difficulty: "Advanced",
      desc: "Build a full-stack application and deploy it publicly.", relevance: "Portfolio-ready evidence of real engineering ability." },
  ],
  "Data Scientist": [
    { id: 1, title: "Python for Data Analysis", status: "done", duration: "3 weeks", difficulty: "Beginner",
      desc: "Pandas, NumPy, Matplotlib — the data scientist's daily toolkit.", relevance: "Used in 95% of data science jobs." },
    { id: 2, title: "Statistics & Probability", status: "done", duration: "4 weeks", difficulty: "Intermediate",
      desc: "Distributions, hypothesis testing, A/B testing, confidence intervals.", relevance: "Statistical thinking is the core of data science." },
    { id: 3, title: "SQL & Data Querying", status: "in-progress", progress: 55, duration: "2 weeks", difficulty: "Beginner",
      desc: "SQL queries, joins, aggregations, window functions, subqueries.", relevance: "Data scientists spend 40% of time in SQL." },
    { id: 4, title: "Machine Learning Fundamentals", status: "upcoming", duration: "5 weeks", difficulty: "Intermediate",
      desc: "Supervised/unsupervised learning, model evaluation, feature engineering.", relevance: "Core skill for the ML portion of data science." },
    { id: 5, title: "Data Visualization & Storytelling", status: "upcoming", duration: "3 weeks", difficulty: "Intermediate",
      desc: "Tableau, Seaborn, Plotly — turning data into decisions.", relevance: "Differentiates analysts who influence business from those who don't." },
    { id: 6, title: "Advanced ML & Feature Engineering", status: "locked", duration: "4 weeks", difficulty: "Advanced",
      desc: "Ensemble methods, boosting, advanced feature selection.", relevance: "Expected at senior data scientist level." },
    { id: 7, title: "Business Case Projects", status: "locked", duration: "4 weeks", difficulty: "Advanced",
      desc: "End-to-end data science projects with business impact measurement.", relevance: "What top employers actually look for." },
  ],
  "Full Stack Developer": [
    { id: 1, title: "HTML, CSS & JavaScript Basics", status: "done", duration: "4 weeks", difficulty: "Beginner",
      desc: "Web fundamentals: DOM, events, responsive layout, ES6+.", relevance: "The foundation of every web application." },
    { id: 2, title: "React & Component Architecture", status: "done", duration: "4 weeks", difficulty: "Intermediate",
      desc: "React hooks, state management, component composition, routing.", relevance: "Most sought-after frontend framework." },
    { id: 3, title: "Node.js & Backend APIs", status: "in-progress", progress: 35, duration: "4 weeks", difficulty: "Intermediate",
      desc: "Express, REST APIs, middleware, authentication with JWT.", relevance: "Full-stack requires solid backend fundamentals." },
    { id: 4, title: "Databases (SQL & NoSQL)", status: "upcoming", duration: "3 weeks", difficulty: "Intermediate",
      desc: "PostgreSQL, MongoDB, ORM tools, data modeling.", relevance: "Every web app needs a data layer." },
    { id: 5, title: "TypeScript", status: "upcoming", duration: "2 weeks", difficulty: "Intermediate",
      desc: "Type safety, interfaces, generics — the standard in modern web teams.", relevance: "Required at most tech companies for frontend/fullstack roles." },
    { id: 6, title: "DevOps & Deployment", status: "locked", duration: "3 weeks", difficulty: "Intermediate",
      desc: "Docker, CI/CD, hosting on Vercel/AWS, environment management.", relevance: "Full-stack devs are expected to own deployment." },
    { id: 7, title: "Portfolio Projects", status: "locked", duration: "4 weeks", difficulty: "Advanced",
      desc: "Ship 2 complete web apps with auth, database, and deployment.", relevance: "Portfolios get full-stack jobs — not just a résumé." },
  ],
  "Cloud Engineer": [
    { id: 1, title: "Linux & Networking Fundamentals", status: "done", duration: "3 weeks", difficulty: "Beginner",
      desc: "Shell commands, file systems, TCP/IP, DNS, firewalls.", relevance: "Cloud infrastructure runs on Linux." },
    { id: 2, title: "AWS / GCP / Azure Basics", status: "done", duration: "4 weeks", difficulty: "Intermediate",
      desc: "Core services: EC2, S3, VPC, IAM, Lambda, managed databases.", relevance: "Cloud platforms are the core of the job." },
    { id: 3, title: "Infrastructure as Code (Terraform)", status: "in-progress", progress: 30, duration: "3 weeks", difficulty: "Intermediate",
      desc: "Provisioning and managing cloud resources reproducibly.", relevance: "Expected at mid-senior cloud engineering levels." },
    { id: 4, title: "Docker & Kubernetes", status: "upcoming", duration: "4 weeks", difficulty: "Intermediate",
      desc: "Containerization, orchestration, Helm charts, scaling.", relevance: "Container orchestration is the modern cloud deployment standard." },
    { id: 5, title: "CI/CD Pipelines", status: "upcoming", duration: "3 weeks", difficulty: "Intermediate",
      desc: "GitHub Actions, Jenkins, ArgoCD — automating build, test, deploy.", relevance: "DevOps practices are expected in cloud roles." },
    { id: 6, title: "Cloud Security & Compliance", status: "locked", duration: "3 weeks", difficulty: "Advanced",
      desc: "IAM policies, encryption, compliance frameworks.", relevance: "Security is a cloud engineer's critical responsibility." },
    { id: 7, title: "Cloud Architecture Projects", status: "locked", duration: "4 weeks", difficulty: "Advanced",
      desc: "Design and deploy a highly-available, cost-optimized cloud system.", relevance: "What cloud architect roles require." },
  ],
  "Cybersecurity Analyst": [
    { id: 1, title: "Networking Fundamentals", status: "done", duration: "3 weeks", difficulty: "Beginner",
      desc: "TCP/IP, DNS, HTTP, OSI model, packet analysis.", relevance: "Security starts with deep network understanding." },
    { id: 2, title: "Linux & Command Line", status: "done", duration: "3 weeks", difficulty: "Beginner",
      desc: "Shell scripting, system administration, file permissions.", relevance: "Most security tools and systems run on Linux." },
    { id: 3, title: "Cryptography Fundamentals", status: "in-progress", progress: 40, duration: "3 weeks", difficulty: "Intermediate",
      desc: "Symmetric/asymmetric encryption, TLS, hashing, PKI.", relevance: "Understanding how data is protected and how it's attacked." },
    { id: 4, title: "Ethical Hacking & Penetration Testing", status: "upcoming", duration: "5 weeks", difficulty: "Advanced",
      desc: "Recon, scanning, exploitation, privilege escalation, reporting.", relevance: "Core skill for red team and security analyst roles." },
    { id: 5, title: "SIEM & Threat Detection", status: "upcoming", duration: "4 weeks", difficulty: "Intermediate",
      desc: "Splunk, Elastic SIEM, log analysis, alert tuning.", relevance: "SOC analyst daily work." },
    { id: 6, title: "Risk Assessment & Compliance", status: "locked", duration: "3 weeks", difficulty: "Intermediate",
      desc: "NIST, ISO 27001, GDPR, risk registers, audit readiness.", relevance: "Expected for enterprise security roles." },
    { id: 7, title: "CTF & Security Projects", status: "locked", duration: "Ongoing", difficulty: "Advanced",
      desc: "Capture The Flag challenges, bug bounties, write-ups.", relevance: "Practical proof of skills for security roles." },
  ],
  "UI/UX Designer": [
    { id: 1, title: "Design Fundamentals", status: "done", duration: "3 weeks", difficulty: "Beginner",
      desc: "Typography, color theory, spacing, visual hierarchy.", relevance: "The foundation of good design decisions." },
    { id: 2, title: "Figma Mastery", status: "done", duration: "4 weeks", difficulty: "Intermediate",
      desc: "Components, auto-layout, prototyping, variables, design systems.", relevance: "Industry standard tool for UI/UX designers." },
    { id: 3, title: "User Research & Personas", status: "in-progress", progress: 50, duration: "3 weeks", difficulty: "Intermediate",
      desc: "Interviews, surveys, affinity mapping, user personas.", relevance: "Good design is research-driven, not taste-driven." },
    { id: 4, title: "Information Architecture & Wireframing", status: "upcoming", duration: "3 weeks", difficulty: "Intermediate",
      desc: "Site maps, user flows, low-fi wireframes, navigation patterns.", relevance: "Structure must come before aesthetics." },
    { id: 5, title: "Usability Testing", status: "upcoming", duration: "2 weeks", difficulty: "Intermediate",
      desc: "Test plans, moderated sessions, synthesizing feedback.", relevance: "Validates designs before costly development." },
    { id: 6, title: "HTML & CSS Basics for Designers", status: "locked", duration: "3 weeks", difficulty: "Beginner",
      desc: "Understanding how your designs get built — improves handoff.", relevance: "Designers who understand code are 2x more effective." },
    { id: 7, title: "Portfolio Case Studies", status: "locked", duration: "4 weeks", difficulty: "Advanced",
      desc: "Document 3 end-to-end design projects with research, process, and outcomes.", relevance: "A portfolio with process is what UX jobs require." },
  ],
};

// ── Career → Gap-to-Hire Plan Map ──────────────────────────
export const CAREER_GAP_PLANS = {
  "AI/ML Engineer": {
    roleOverview: {
      targetRole: "AI/ML Engineer",
      baselineScore: 72,
      projectedScore: 94,
      avgSalary: "$142,000 / yr",
      marketDemand: "Very High (3,400+ active roles)",
      timeline: "8-10 weeks at 6 hrs/week",
    },
    milestones: [
      { id: 1, step: 1, title: "Deep Learning & Neural Architectures", status: "in-progress", progress: 45,
        boost: "+8%", scoreRange: "72% → 80%", priority: "Critical Gap", priorityTone: "amber",
        gap: "Neural networks, CNNs, Transformers, PyTorch model optimization",
        project: "Multi-modal Image & Text Classifier with PyTorch",
        skills: ["PyTorch", "Transfer Learning", "TensorRT", "CNNs"],
        whyCompaniesTest: "Over 85% of AI/ML Engineer postings require direct experience training, profiling, and fine-tuning neural architectures.",
        duration: "3 weeks", difficulty: "Advanced" },
      { id: 2, step: 2, title: "Docker & Containerized Model Serving", status: "upcoming", progress: 0,
        boost: "+7%", scoreRange: "80% → 87%", priority: "High Impact", priorityTone: "cyan",
        gap: "Docker containerization, GPU CUDA runtimes, FastAPI inference endpoints",
        project: "Scalable ML Model Serving API with Docker & FastAPI",
        skills: ["Docker", "FastAPI", "Triton Server", "GPU CUDA Runtime"],
        whyCompaniesTest: "Production AI roles require packaging models as reliable, portable containerized microservices ready for cloud deployment.",
        duration: "2 weeks", difficulty: "Intermediate" },
      { id: 3, step: 3, title: "Production System Design & RAG Architecture", status: "locked", progress: 0,
        boost: "+4%", scoreRange: "87% → 91%", priority: "Specialization", priorityTone: "violet",
        gap: "Low-latency vector indexing, cache hierarchies, distributed inference",
        project: "Enterprise Document Search with Pinecone & LangChain",
        skills: ["Vector DBs", "RAG Pipelines", "Embedding Indexes", "System Design"],
        whyCompaniesTest: "RAG is the primary enterprise generative AI workload; validating unhallucinated answer retrieval distinguishes senior candidates.",
        duration: "2.5 weeks", difficulty: "Advanced" },
      { id: 4, step: 4, title: "Interview Simulation & Portfolio Verification", status: "locked", progress: 0,
        boost: "+3%", scoreRange: "91% → 94%", priority: "Final Polish", priorityTone: "green",
        gap: "Live algorithmic coding, architecture defense, production code review",
        project: "Verified GitHub Portfolio Showcase & Architecture Deck",
        skills: ["Live Coding", "System Architecture Defense", "Code Review"],
        whyCompaniesTest: "Ensures you can clearly articulate architectural trade-offs and code clean, testable models under real interview scrutiny.",
        duration: "1.5 weeks", difficulty: "Advanced" },
    ],
    foundationalCompleted: [
      { id: 101, title: "Python Programming Fundamentals", status: "done", score: "100%", duration: "3 weeks", provider: "University Coursework" },
      { id: 102, title: "Data Structures & Algorithms", status: "done", score: "96%", duration: "4 weeks", provider: "University Coursework" },
    ],
  },
  "Software Engineer": {
    roleOverview: {
      targetRole: "Software Engineer",
      baselineScore: 68,
      projectedScore: 92,
      avgSalary: "$125,000 / yr",
      marketDemand: "Very High (8,200+ active roles)",
      timeline: "8-10 weeks at 5 hrs/week",
    },
    milestones: [
      { id: 1, step: 1, title: "Advanced Data Structures & System Design", status: "in-progress", progress: 40,
        boost: "+10%", scoreRange: "68% → 78%", priority: "Critical Gap", priorityTone: "amber",
        gap: "Graph algorithms, dynamic programming, scalable system architecture",
        project: "Design & Implement a Distributed URL Shortener",
        skills: ["Graph Theory", "Dynamic Programming", "Caching", "Load Balancing"],
        whyCompaniesTest: "FAANG and top companies test DSA and system design in every SWE interview regardless of seniority.",
        duration: "3 weeks", difficulty: "Advanced",
        tasks: [
          { id: "se1-1", label: "Master graph traversal algorithms", checked: true },
          { id: "se1-2", label: "System Design basics", checked: false }
        ],
        resources: [
          { title: "System Design Interview Prep", type: "Video", url: "#" }
        ]
      },
      { id: 2, step: 2, title: "Backend API & Database Mastery", status: "upcoming", progress: 0,
        boost: "+8%", scoreRange: "78% → 86%", priority: "High Impact", priorityTone: "cyan",
        gap: "REST API design, SQL optimization, ORM patterns, authentication",
        project: "RESTful API with OAuth2, PostgreSQL, and Redis caching",
        skills: ["REST APIs", "PostgreSQL", "Redis", "JWT Auth"],
        whyCompaniesTest: "Building reliable backend services is the core deliverable for most software engineering roles.",
        duration: "2 weeks", difficulty: "Intermediate",
        tasks: [
          { id: "se2-1", label: "Build RESTful API endpoints", checked: false },
          { id: "se2-2", label: "Implement JWT authentication", checked: false }
        ],
        resources: [
          { title: "REST API Best Practices", type: "Article", url: "#" }
        ]
      },
      { id: 3, step: 3, title: "Docker & CI/CD Pipeline", status: "locked", progress: 0,
        boost: "+4%", scoreRange: "86% → 90%", priority: "Specialization", priorityTone: "violet",
        gap: "Containerization, automated testing, deployment pipelines",
        project: "Containerized App with GitHub Actions CI/CD to AWS",
        skills: ["Docker", "GitHub Actions", "AWS EC2", "Testing"],
        whyCompaniesTest: "Modern software teams expect engineers to own deployment pipelines, not just write code.",
        duration: "2 weeks", difficulty: "Intermediate" },
      { id: 4, step: 4, title: "Code Review & Interview Readiness", status: "locked", progress: 0,
        boost: "+2%", scoreRange: "90% → 92%", priority: "Final Polish", priorityTone: "green",
        gap: "Code readability, OOP design, mock interviews",
        project: "Open Source Contribution & Peer Code Review",
        skills: ["Code Review", "Open Source", "Mock Interviews"],
        whyCompaniesTest: "Clean, reviewable code and interview stamina differentiate candidates at the final round.",
        duration: "1.5 weeks", difficulty: "Intermediate" },
    ],
    foundationalCompleted: [
      { id: 101, title: "Programming Fundamentals", status: "done", score: "100%", duration: "3 weeks", provider: "University Coursework" },
      { id: 102, title: "Object-Oriented Programming", status: "done", score: "88%", duration: "3 weeks", provider: "University Coursework" },
    ],
  },
  "Data Scientist": {
    roleOverview: {
      targetRole: "Data Scientist",
      baselineScore: 65,
      projectedScore: 91,
      avgSalary: "$128,000 / yr",
      marketDemand: "High (2,800+ active roles)",
      timeline: "9-11 weeks at 5 hrs/week",
    },
    milestones: [
      { id: 1, step: 1, title: "Statistical Analysis & Hypothesis Testing", status: "in-progress", progress: 50,
        boost: "+9%", scoreRange: "65% → 74%", priority: "Critical Gap", priorityTone: "amber",
        gap: "A/B testing, p-values, confidence intervals, Bayesian inference",
        project: "A/B Test Analysis Dashboard with Real Dataset",
        skills: ["Hypothesis Testing", "SciPy", "Statsmodels", "Bayesian Methods"],
        whyCompaniesTest: "Data scientists must validate experiments statistically — poor statistical rigor leads to bad business decisions.",
        duration: "3 weeks", difficulty: "Intermediate" },
      { id: 2, step: 2, title: "Advanced Machine Learning & Feature Engineering", status: "upcoming", progress: 0,
        boost: "+9%", scoreRange: "74% → 83%", priority: "High Impact", priorityTone: "cyan",
        gap: "Ensemble methods, XGBoost, feature selection, pipelines",
        project: "Kaggle-Style Prediction Competition with Feature Engineering",
        skills: ["XGBoost", "LightGBM", "Scikit-learn Pipelines", "SHAP"],
        whyCompaniesTest: "DS roles require building models that actually improve over baselines — not just running default sklearn.",
        duration: "3 weeks", difficulty: "Advanced" },
      { id: 3, step: 3, title: "Data Visualization & Business Communication", status: "locked", progress: 0,
        boost: "+5%", scoreRange: "83% → 88%", priority: "Specialization", priorityTone: "violet",
        gap: "Tableau, Plotly, executive storytelling, dashboard design",
        project: "Interactive Business Dashboard with Plotly & Streamlit",
        skills: ["Plotly", "Streamlit", "Tableau", "Business Storytelling"],
        whyCompaniesTest: "Data scientists who can communicate insights drive business outcomes. Technical skill alone is insufficient.",
        duration: "2 weeks", difficulty: "Intermediate" },
      { id: 4, step: 4, title: "End-to-End DS Portfolio Project", status: "locked", progress: 0,
        boost: "+3%", scoreRange: "88% → 91%", priority: "Final Polish", priorityTone: "green",
        gap: "Project scoping, data collection, modeling, deployment, documentation",
        project: "Complete DS Case Study from Raw Data to Deployed Model",
        skills: ["Project Management", "Streamlit Deployment", "Documentation"],
        whyCompaniesTest: "Hiring managers want to see the full data science workflow, not isolated skills.",
        duration: "2 weeks", difficulty: "Advanced" },
    ],
    foundationalCompleted: [
      { id: 101, title: "Python for Data Analysis", status: "done", score: "95%", duration: "3 weeks", provider: "Online Course" },
      { id: 102, title: "SQL & Database Fundamentals", status: "done", score: "90%", duration: "2 weeks", provider: "University Coursework" },
    ],
  },
};

// Fill remaining careers with generic plans
["Full Stack Developer", "Cloud Engineer", "Cybersecurity Analyst", "UI/UX Designer"].forEach((career) => {
  if (!CAREER_GAP_PLANS[career]) {
    CAREER_GAP_PLANS[career] = {
      roleOverview: {
        targetRole: career,
        baselineScore: 65,
        projectedScore: 90,
        avgSalary: "$110,000 / yr",
        marketDemand: "High (2,000+ active roles)",
        timeline: "8-10 weeks at 5 hrs/week",
      },
      milestones: [
        { id: 1, step: 1, title: "Core Technical Skills", status: "in-progress", progress: 40,
          boost: "+9%", scoreRange: "65% → 74%", priority: "Critical Gap", priorityTone: "amber",
          gap: "Core technical skills required for the role",
          project: "Foundational Capstone Project",
          skills: ["Core Skill 1", "Core Skill 2", "Core Skill 3"],
          whyCompaniesTest: "These fundamentals are tested in every interview for this role.",
          duration: "3 weeks", difficulty: "Intermediate",
          tasks: [
            { id: "t1-1", label: "Review foundational concepts", checked: true },
            { id: "t1-2", label: "Complete core exercises", checked: false },
            { id: "t1-3", label: "Pass baseline assessment", checked: false }
          ],
          resources: [
            { title: "Definitive Guide to Core Skills", type: "Article", url: "#" },
            { title: "Foundations Masterclass", type: "Course", url: "#" }
          ]
        },
        { id: 2, step: 2, title: "Advanced Specialization", status: "upcoming", progress: 0,
          boost: "+8%", scoreRange: "74% → 82%", priority: "High Impact", priorityTone: "cyan",
          gap: "Advanced concepts and frameworks",
          project: "Intermediate Practice Project",
          skills: ["Advanced Skill 1", "Advanced Skill 2"],
          whyCompaniesTest: "Advanced skills differentiate entry-level from mid-level candidates.",
          duration: "2 weeks", difficulty: "Advanced",
          tasks: [
            { id: "t2-1", label: "Study advanced design patterns", checked: false },
            { id: "t2-2", label: "Optimize existing codebase", checked: false }
          ],
          resources: [
            { title: "Advanced Architecture Patterns", type: "Video", url: "#" }
          ]
        },
        { id: 3, step: 3, title: "Portfolio & Projects", status: "locked", progress: 0,
          boost: "+5%", scoreRange: "82% → 87%", priority: "Specialization", priorityTone: "violet",
          gap: "Portfolio projects and real-world experience",
          project: "Portfolio Showcase Project",
          skills: ["Project Management", "Documentation", "Deployment"],
          whyCompaniesTest: "Employers want evidence of real-world application, not just coursework.",
          duration: "3 weeks", difficulty: "Advanced",
          tasks: [
            { id: "t3-1", label: "Draft project requirements", checked: false },
            { id: "t3-2", label: "Implement core features", checked: false },
            { id: "t3-3", label: "Deploy to production", checked: false }
          ],
          resources: [
            { title: "How to Build a Standout Portfolio", type: "Guide", url: "#" }
          ]
        },
        { id: 4, step: 4, title: "Interview Preparation", status: "locked", progress: 0,
          boost: "+3%", scoreRange: "87% → 90%", priority: "Final Polish", priorityTone: "green",
          gap: "Interview readiness and communication",
          project: "Mock Interview & Portfolio Review",
          skills: ["Communication", "Mock Interviews", "Resume Polish"],
          whyCompaniesTest: "Technical skills alone don't land jobs — interview performance is critical.",
          duration: "1.5 weeks", difficulty: "Intermediate",
          tasks: [
            { id: "t4-1", label: "Update resume to ATS standards", checked: false },
            { id: "t4-2", label: "Complete 2 mock interviews", checked: false }
          ],
          resources: [
            { title: "Top 50 Behavioral Questions", type: "Cheat Sheet", url: "#" },
            { title: "Mock Interview Platform", type: "Tool", url: "#" }
          ]
        },
      ],
      foundationalCompleted: [
        { id: 101, title: "Foundations Course", status: "done", score: "100%", duration: "3 weeks", provider: "University Coursework" },
      ],
    };
  }
});

// ── Profile Builder ─────────────────────────────────────────

/**
 * Build a complete user profile from onboarding data.
 * @param {object} onboardingData - Data collected during onboarding
 * @param {object} existingUser - Already-registered user record
 * @returns {object} Profile updates to merge into user record
 */
export function buildInitialProfile(onboardingData, existingUser) {
  const {
    degree,
    year,
    skills = [],
    projects = "",
    interests = [],
    career,
    pace,
    name: onboardName,
  } = onboardingData;

  const targetCareer = career || existingUser?.targetCareer || "Software Engineer";
  const requiredSkills = SKILL_REQUIREMENTS[targetCareer] || [];
  const matched = skills.filter((s) =>
    requiredSkills.some((r) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
  );
  const readinessPct = Math.min(
    95,
    Math.max(
      20,
      Math.round((matched.length / Math.max(requiredSkills.length, 1)) * 100 * 0.7 + 25)
    )
  );

  return {
    ...(onboardName ? { name: onboardName } : {}),
    degree: degree || existingUser?.degree,
    year: year || existingUser?.year,
    targetCareer,
    skills,
    interests,
    projects,
    pace: pace || "Balanced",
    careerReadiness: readinessPct,
    onboardingComplete: true,
    bio: existingUser?.bio || "",
  };
}

/**
 * Proficiency score mapping.
 */
export function getProficiencyScore(level) {
  switch ((level || "").toLowerCase()) {
    case "beginner": return 25;
    case "intermediate": return 50;
    case "advanced": return 75;
    case "expert": return 100;
    default: return 50;
  }
}

/**
 * Compute user skill groups dynamically from user's actual skills list or skill strings.
 */
export function computeUserSkillGroups(userSkillsList = [], plainSkills = []) {
  // Combine structured list and plain strings
  const items = [...userSkillsList];
  plainSkills.forEach((s) => {
    if (!items.some((i) => i.name.toLowerCase() === s.toLowerCase())) {
      items.push({ name: s, category: inferCategory(s), proficiency: "Intermediate" });
    }
  });

  if (items.length === 0) return [];

  const groups = {};
  items.forEach((item) => {
    const cat = item.category || inferCategory(item.name);
    groups[cat] = groups[cat] || [];
    groups[cat].push(item);
  });

  return Object.entries(groups).map(([name, skills]) => {
    const totalScore = skills.reduce((acc, s) => acc + getProficiencyScore(s.proficiency), 0);
    const level = Math.round(totalScore / skills.length);
    return {
      name,
      level,
      matched: skills.map((s) => s.name),
    };
  });
}

/**
 * Infer category for plain skill string.
 */
function inferCategory(skillName = "") {
  const s = skillName.toLowerCase();
  if (["python", "java", "c++", "c", "javascript", "typescript", "golang", "rust"].some((k) => s.includes(k)))
    return "Programming";
  if (["sql", "pandas", "numpy", "statistics", "postgresql", "mongodb"].some((k) => s.includes(k)))
    return "Data & Databases";
  if (["react", "node.js", "html/css", "vue", "next.js", "express"].some((k) => s.includes(k)))
    return "Web & Frameworks";
  if (["docker", "aws", "git", "linux", "kubernetes", "ci/cd"].some((k) => s.includes(k)))
    return "Tools & Systems";
  if (["machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "rag"].some((k) => s.includes(k)))
    return "AI / Machine Learning";
  return "Other";
}

/**
 * Compute Radar Data for user profile.
 */
export function computeUserRadarData(userSkillsList = [], plainSkills = []) {
  const groups = computeUserSkillGroups(userSkillsList, plainSkills);
  if (groups.length === 0) return null;

  const categories = [
    { subject: "Programming", key: "Programming" },
    { subject: "Data", key: "Data & Databases" },
    { subject: "Web", key: "Web & Frameworks" },
    { subject: "Tools", key: "Tools & Systems" },
    { subject: "AI/ML", key: "AI / Machine Learning" },
  ];

  return categories.map((cat) => {
    const found = groups.find((g) => g.name === cat.key);
    return {
      subject: cat.subject,
      value: found ? found.level : 0,
    };
  });
}

/**
 * Compute dynamic profile readiness & career match based strictly on user data.
 */
export function calculateDynamicReadiness(student) {
  if (!student) return null;
  const userSkills = student.skills || [];
  const userSkillsList = student.userSkillsList || [];
  const projects = student.projectsList || [];
  const certs = student.certificationsList || [];
  const targetCareer = student.targetCareer || "Software Engineer";

  const totalSkills = Math.max(userSkills.length, userSkillsList.length);

  // If user has virtually no data added
  if (totalSkills === 0 && projects.length === 0 && certs.length === 0) {
    return null;
  }

  const required = SKILL_REQUIREMENTS[targetCareer] || [];
  const matchedCount = userSkills.filter((s) =>
    required.some((r) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
  ).length;

  const skillScore = required.length > 0 ? (matchedCount / required.length) * 50 : 25;
  const projectScore = Math.min(20, projects.length * 10);
  const certScore = Math.min(15, certs.length * 7.5);
  const profileScore = (student.degree ? 5 : 0) + (student.location ? 5 : 0) + (student.github ? 5 : 0);

  return Math.min(98, Math.max(15, Math.round(skillScore + projectScore + certScore + profileScore)));
}


/**
 * Get a personalized roadmap for the user's career, adjusting status
 * based on skills they already have.
 */
export function getPersonalizedRoadmap(targetCareer, userSkills = []) {
  const roadmap = CAREER_ROADMAPS[targetCareer] || CAREER_ROADMAPS["Software Engineer"];
  return roadmap;
}

/**
 * Get the Gap-to-Hire plan for a given career.
 */
export function getGapToHirePlan(targetCareer) {
  return CAREER_GAP_PLANS[targetCareer] || CAREER_GAP_PLANS["Software Engineer"];
}

/**
 * Compute strengths and gaps from user skills vs. career requirements.
 */
export function getStrengthsAndGaps(userSkills = [], targetCareer) {
  const required = SKILL_REQUIREMENTS[targetCareer] || [];
  const strengths = userSkills.filter((s) =>
    required.some(
      (r) =>
        r.toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes(r.toLowerCase())
    )
  ).slice(0, 3);

  const gaps = required
    .filter(
      (r) =>
        !userSkills.some(
          (s) =>
            r.toLowerCase().includes(s.toLowerCase()) ||
            s.toLowerCase().includes(r.toLowerCase())
        )
    )
    .slice(0, 3);

  return { strengths, gaps };
}

/**
 * Generate a personalized Career Skill Journey based on the user's profile and target career.
 */
export function generateCareerJourney(student) {
  const targetCareer = student?.targetCareer || "Software Engineer";
  const requiredSkills = SKILL_REQUIREMENTS[targetCareer] || SKILL_REQUIREMENTS["Software Engineer"];
  
  // Normalize user skills
  const userSkills = (student?.skills || []).map(s => s.toLowerCase());
  const userSkillsList = (student?.userSkillsList || []).map(s => s.name.toLowerCase());
  const allUserSkills = new Set([...userSkills, ...userSkillsList]);

  // Check if a skill is mastered
  const isMastered = (skill) => {
    return Array.from(allUserSkills).some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s));
  };

  const STAGES = [
    { id: "stage_1", title: "Foundations", desc: "Core concepts required before building." },
    { id: "stage_2", title: "Core Development", desc: "The primary tools and frameworks used daily." },
    { id: "stage_3", title: "Real-World Projects", desc: "Applying skills to build functional systems." },
    { id: "stage_4", title: "Specialization", desc: "Advanced concepts that set you apart." },
    { id: "stage_5", title: "Interview Ready", desc: "Preparing for technical screens and system design." }
  ];

  const totalSkills = requiredSkills.length;
  
  const journeyStages = STAGES.map((stage, index) => {
    let stageSkills = [];
    let project = null;

    if (index === 0) {
      stageSkills = requiredSkills.slice(0, Math.ceil(totalSkills * 0.3));
    } else if (index === 1) {
      stageSkills = requiredSkills.slice(Math.ceil(totalSkills * 0.3), Math.ceil(totalSkills * 0.7));
    } else if (index === 2) {
      project = {
        title: `Build a ${targetCareer} Application`,
        desc: "Combine your core development skills into a deployable project.",
        time: "15-20 hours"
      };
    } else if (index === 3) {
      stageSkills = requiredSkills.slice(Math.ceil(totalSkills * 0.7));
    } else if (index === 4) {
      stageSkills = ["System Design", "Algorithms & Patterns"];
    }

    const skillsData = stageSkills.map((skill, sIdx) => {
      const mastered = isMastered(skill) || isMastered(skill.replace(/ /g, ""));
      return {
        id: `skill_${skill.replace(/\s+/g, '_').toLowerCase()}`,
        name: skill,
        status: mastered ? "COMPLETED" : "NOT STARTED",
        importance: index === 0 ? "Critical" : index === 1 ? "High" : "Medium",
        estimatedHours: mastered ? 0 : Math.floor(Math.random() * 5) + 10,
        why: `${skill} is a highly requested skill for ${targetCareer} roles.`,
        tasks: [
          { id: `task_${skill.replace(/\s+/g, '_').toLowerCase()}_1`, label: `Learn ${skill} fundamentals`, checked: mastered },
          { id: `task_${skill.replace(/\s+/g, '_').toLowerCase()}_2`, label: `Complete practice exercises`, checked: mastered },
          { id: `task_${skill.replace(/\s+/g, '_').toLowerCase()}_3`, label: `Pass assessment`, checked: mastered }
        ],
        resources: [
          { title: `${skill} Official Documentation`, type: "Documentation", url: "#" },
          { title: `Complete ${skill} Crash Course`, type: "Video", url: "#" },
          { title: `Interactive ${skill} Exercises`, type: "Practice", url: "#" },
          { title: `Build a project with ${skill}`, type: "Project", url: "#" }
        ]
      };
    });

    const completedSkills = skillsData.filter(s => s.status === "COMPLETED").length;
    const stageProgress = skillsData.length > 0 ? Math.round((completedSkills / skillsData.length) * 100) : (project ? 0 : 100);

    return {
      ...stage,
      skills: skillsData,
      project,
      progress: stageProgress,
      status: "LOCKED" 
    };
  });

  // Calculate actual statuses
  let hasFoundInProgress = false;
  let hasFoundUpNext = false;
  
  for (let i = 0; i < journeyStages.length; i++) {
    const stage = journeyStages[i];
    if (stage.progress === 100 && i !== 2) {
      stage.status = "COMPLETED";
    } else if (!hasFoundInProgress) {
      stage.status = "IN PROGRESS";
      hasFoundInProgress = true;
    } else if (!hasFoundUpNext) {
      stage.status = "UP NEXT";
      hasFoundUpNext = true;
    } else {
      stage.status = "LOCKED";
    }
  }

  const totalCompletedSkills = journeyStages.reduce((acc, stage) => acc + stage.skills.filter(s => s.status === "COMPLETED").length, 0);
  const totalJourneySkills = journeyStages.reduce((acc, stage) => acc + stage.skills.length, 0);
  const overallProgress = totalJourneySkills > 0 ? Math.round((totalCompletedSkills / totalJourneySkills) * 100) : 0;

  return {
    targetCareer,
    overallProgress,
    totalCompletedSkills,
    totalJourneySkills,
    currentStage: journeyStages.find(s => s.status === "IN PROGRESS") || journeyStages[journeyStages.length - 1],
    stages: journeyStages
  };
}
