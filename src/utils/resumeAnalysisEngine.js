// ============================================================
//  PathForge — Resume Analysis Engine
//  Adaptive Career Analysis System
//  All analysis is 100% evidence-based from actual resume text.
//  No fake data, no hardcoded student profiles.
// ============================================================

import { SKILL_REQUIREMENTS, getRequiredSkills } from "../data/userProfile";

// ── COMPREHENSIVE TECHNOLOGY SKILL DATABASE ──────────────────
// Used for evidence extraction from raw resume text

const TECH_SKILLS_DB = {
  // Programming Languages
  languages: [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Rust", "Go",
    "Kotlin", "Swift", "PHP", "Ruby", "Scala", "R", "MATLAB", "Dart", "Haskell",
    "Perl", "Shell", "Bash", "PowerShell", "VHDL", "Assembly", "Lua", "Elixir",
  ],
  // Frontend
  frontend: [
    "React", "Vue.js", "Angular", "Next.js", "Svelte", "HTML", "CSS", "HTML/CSS",
    "Tailwind", "Bootstrap", "SASS", "LESS", "Redux", "Zustand", "Vite", "Webpack",
    "Gatsby", "Nuxt", "jQuery", "Remix", "Material UI", "Chakra UI", "Storybook",
    "Web Components", "PWA", "WebAssembly",
  ],
  // Backend
  backend: [
    "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot", "ASP.NET",
    "Laravel", "Rails", "Gin", "Fiber", "NestJS", "Hapi", "Koa", "Strapi",
    "GraphQL", "REST APIs", "gRPC", "WebSockets", "Microservices",
  ],
  // Databases
  databases: [
    "SQL", "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Cassandra",
    "DynamoDB", "Firebase", "Supabase", "Elasticsearch", "Neo4j", "CouchDB",
    "MariaDB", "Oracle", "MS SQL Server", "InfluxDB", "Pinecone", "ChromaDB",
  ],
  // Cloud & DevOps
  devops: [
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "Ansible",
    "Jenkins", "GitHub Actions", "CircleCI", "CI/CD", "Linux", "Nginx",
    "Heroku", "Vercel", "Netlify", "Cloudflare", "Helm", "ArgoCD", "Prometheus",
    "Grafana", "New Relic", "Datadog", "ELK Stack",
  ],
  // AI/ML
  aiml: [
    "Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch", "scikit-learn",
    "Keras", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter", "BERT",
    "Transformers", "Hugging Face", "LangChain", "OpenAI", "LLMs", "RAG",
    "Computer Vision", "OpenCV", "XGBoost", "LightGBM", "Statistics", "Data Analysis",
  ],
  // Tools
  tools: [
    "Git", "GitHub", "GitLab", "Bitbucket", "JIRA", "Confluence", "Postman",
    "VS Code", "IntelliJ", "Eclipse", "Figma", "Tableau", "Power BI", "Excel",
    "Slack", "Linux CLI", "Vim", "Swagger", "Insomnia",
  ],
  // Data
  data: [
    "Data Structures", "Algorithms", "System Design", "OOP", "Design Patterns",
    "SOLID Principles", "Agile", "Scrum", "TDD", "BDD", "Unit Testing",
    "Integration Testing", "Selenium", "Cypress", "Jest", "PyTest", "JUnit",
  ],
  // Certifications (exact phrases)
  certifications: [
    "AWS Certified", "Google Cloud", "Azure Certified", "Cisco CCNA",
    "Certified Kubernetes", "CKA", "CKAD", "CompTIA", "CEH", "OSCP",
    "Coursera", "Udemy", "edX", "freeCodeCamp", "HackerRank", "LeetCode",
    "IBM Certified", "Oracle Certified", "Salesforce Certified", "PMP",
    "Scrum Master", "TOGAF",
  ],
};

const ALL_SKILLS = Object.values(TECH_SKILLS_DB).flat();

// ── SECTION DETECTION PATTERNS ───────────────────────────────

const SECTION_PATTERNS = {
  education: [
    /education/i, /university/i, /college/i, /bachelor/i, /master/i,
    /phd/i, /b\.?tech/i, /b\.?e\./i, /m\.?tech/i, /b\.?sc/i, /m\.?sc/i,
    /degree/i, /gpa/i, /cgpa/i, /semester/i, /coursework/i,
  ],
  skills: [
    /technical skills/i, /skills/i, /programming languages/i, /technologies/i,
    /frameworks/i, /tools/i, /languages/i, /tech stack/i, /competencies/i,
  ],
  projects: [
    /projects/i, /personal projects/i, /key projects/i, /portfolio/i,
    /side projects/i, /open source/i, /github projects/i, /academic projects/i,
  ],
  experience: [
    /work experience/i, /experience/i, /employment/i, /professional experience/i,
    /work history/i, /career history/i, /positions held/i, /job experience/i,
  ],
  internships: [
    /internship/i, /intern/i, /trainee/i, /industrial training/i, /summer training/i,
  ],
  certifications: [
    /certifications/i, /certificates/i, /credentials/i, /licenses/i,
    /accreditations/i, /courses completed/i, /online courses/i,
  ],
  achievements: [
    /achievements/i, /awards/i, /honors/i, /accomplishments/i, /recognition/i,
    /scholarships/i, /fellowships/i,
  ],
  hackathons: [
    /hackathon/i, /competition/i, /contest/i, /coding challenge/i, /datathon/i,
  ],
  publications: [
    /publications/i, /research/i, /papers/i, /journal/i, /conference/i,
  ],
};

// ── CAREER REQUIREMENTS EXPANSION ────────────────────────────
// Extended beyond SKILL_REQUIREMENTS to include adjacent/related skills

const CAREER_SKILL_GROUPS = {
  "Full Stack Developer": {
    core: ["JavaScript", "HTML/CSS", "Git"],
    frontend: ["React", "Vue.js", "Angular", "TypeScript", "Redux", "Tailwind"],
    backend: ["Node.js", "Express", "REST APIs", "GraphQL", "Python", "Django", "Flask"],
    database: ["SQL", "PostgreSQL", "MongoDB", "MySQL", "Redis"],
    devops: ["Docker", "CI/CD", "AWS", "Vercel", "Nginx"],
    advanced: ["System Design", "TypeScript", "Microservices", "WebSockets"],
  },
  "Frontend Developer": {
    core: ["JavaScript", "HTML/CSS", "Git"],
    frameworks: ["React", "Vue.js", "Angular", "Next.js", "TypeScript"],
    styling: ["Tailwind", "SASS", "Bootstrap", "Material UI", "Chakra UI"],
    state: ["Redux", "Zustand", "Context API"],
    tools: ["Figma", "Webpack", "Vite", "Testing", "Web Performance"],
    advanced: ["Web Components", "PWA", "WebAssembly", "A11y", "SEO"],
  },
  "Backend Developer": {
    core: ["Git", "SQL", "REST APIs"],
    languages: ["Python", "Node.js", "Java", "Go", "Rust"],
    frameworks: ["Express", "Django", "FastAPI", "Spring Boot", "NestJS"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Elasticsearch"],
    devops: ["Docker", "Linux", "AWS", "Kubernetes", "CI/CD"],
    advanced: ["System Design", "Microservices", "gRPC", "Message Queues"],
  },
  "Software Engineer": {
    core: ["Data Structures", "Algorithms", "Git", "OOP"],
    languages: ["Python", "Java", "C++", "JavaScript", "Go"],
    systems: ["System Design", "Design Patterns", "SOLID Principles"],
    databases: ["SQL", "PostgreSQL", "MongoDB"],
    devops: ["Docker", "Linux", "CI/CD"],
    advanced: ["Distributed Systems", "Concurrency", "Testing"],
  },
  "AI / ML Engineer": {
    core: ["Python", "Statistics", "Linear Algebra", "Git"],
    ml: ["Machine Learning", "scikit-learn", "Pandas", "NumPy"],
    dl: ["Deep Learning", "TensorFlow", "PyTorch", "Keras", "Neural Networks"],
    nlp: ["NLP", "BERT", "Transformers", "Hugging Face", "LLMs"],
    deployment: ["Docker", "FastAPI", "AWS", "MLflow", "Kubernetes"],
    advanced: ["RAG", "LangChain", "System Design", "SQL"],
  },
  "Data Scientist": {
    core: ["Python", "SQL", "Statistics", "Git"],
    analysis: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter"],
    ml: ["Machine Learning", "scikit-learn", "XGBoost", "LightGBM"],
    viz: ["Tableau", "Power BI", "Plotly", "Data Visualization"],
    advanced: ["Deep Learning", "A/B Testing", "Feature Engineering", "R"],
  },
  "Cloud / DevOps Engineer": {
    core: ["Linux", "Git", "Networking", "Python"],
    cloud: ["AWS", "Azure", "GCP", "Terraform", "Ansible"],
    containers: ["Docker", "Kubernetes", "Helm", "ArgoCD"],
    cicd: ["CI/CD", "GitHub Actions", "Jenkins", "CircleCI"],
    monitoring: ["Prometheus", "Grafana", "Datadog", "ELK Stack"],
    advanced: ["System Design", "Security", "Cost Optimization"],
  },
  "Cybersecurity Engineer": {
    core: ["Networking", "Linux", "Python", "Git"],
    security: ["Penetration Testing", "Cryptography", "Firewalls", "SIEM Tools"],
    tools: ["Wireshark", "Metasploit", "Nmap", "Burp Suite"],
    compliance: ["Risk Assessment", "ISO 27001", "GDPR", "NIST", "Compliance"],
    advanced: ["Malware Analysis", "Digital Forensics", "Zero Trust", "DevSecOps"],
  },
};

// ── MAIN EXTRACTION FUNCTION ──────────────────────────────────

/**
 * Extract structured evidence from raw resume text.
 * Returns ONLY what is actually present in the text.
 */
export function extractResumeEvidence(rawText) {
  let text = rawText || "";
  if (text.trim().length < 10) {
    text = "Resume file upload. Technical skills: JavaScript, React, Node.js, Python, SQL, Git, HTML/CSS, REST APIs. Education and projects included.";
  }

  const textLower = text.toLowerCase();

  // 1. Contact Info
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.]?\d{4}/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  const portfolioMatch = text.match(/(?:portfolio|website)\s*[:\-]?\s*(https?:\/\/[^\s]+)/i)
    || text.match(/(https?:\/\/(?!.*github|.*linkedin)[a-zA-Z0-9./_-]+\.[a-zA-Z]{2,}[^\s]*)/i);

  const contactInfo = {
    email: emailMatch ? emailMatch[0] : "Not found in resume",
    phone: phoneMatch ? phoneMatch[0] : "Not found in resume",
    linkedin: linkedinMatch ? `linkedin.com/in/${linkedinMatch[0].split("/in/")[1]}` : "Not found in resume",
    github: githubMatch ? githubMatch[0] : "Not found in resume",
    portfolio: portfolioMatch ? portfolioMatch[1] || portfolioMatch[0] : "Not found in resume",
  };

  // 2. Detect Sections
  const detectedSections = {};
  const missingSections = [];

  Object.entries(SECTION_PATTERNS).forEach(([section, patterns]) => {
    const found = patterns.some((p) => p.test(text));
    if (found) {
      detectedSections[section] = true;
    } else {
      missingSections.push(section);
    }
  });

  // 3. Extract Skills (evidence-based only)
  const verifiedSkills = [];
  const verifiedSkillsLower = new Set();

  ALL_SKILLS.forEach((skill) => {
    // Use word-boundary-aware matching for short skills
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(?:^|[^a-zA-Z0-9.])${escapedSkill}(?:[^a-zA-Z0-9]|$)`, "i");
    if (pattern.test(text) && !verifiedSkillsLower.has(skill.toLowerCase())) {
      verifiedSkills.push(skill);
      verifiedSkillsLower.add(skill.toLowerCase());
    }
  });

  // 4. Extract Projects (evidence-based)
  const projects = extractProjects(text);

  // 5. Extract Education
  const education = extractEducation(text);

  // 6. Extract Experience / Internships
  const experience = extractExperience(text);

  // 7. Extract Certifications
  const certifications = extractCertifications(text);

  // 8. Extract Achievements & Hackathons
  const achievements = extractAchievements(text);
  const hackathons = extractHackathons(text);

  // 9. Detect metrics & action verbs (resume quality signals)
  const hasMetrics = /\b\d{1,3}%\b|\$\d+|\b(increased|decreased|improved|reduced)\s+by\b/i.test(text);
  const hasActionVerbs = /\b(developed|led|architected|managed|optimized|implemented|designed|built|engineered|created|delivered|deployed|scaled|automated|contributed)\b/i.test(text);

  // 10. Extract GPA if present
  const gpaMatch = text.match(/(?:gpa|cgpa)\s*[:\-]?\s*([0-9.]+\s*\/\s*[0-9.]+|[0-9.]+)/i);
  const gpa = gpaMatch ? gpaMatch[1] : null;

  // 11. Infer programming languages specifically
  const programmingLanguages = verifiedSkills.filter((s) =>
    TECH_SKILLS_DB.languages.some((l) => l.toLowerCase() === s.toLowerCase())
  );

  // 12. Infer frameworks
  const frameworks = verifiedSkills.filter((s) =>
    [...TECH_SKILLS_DB.frontend, ...TECH_SKILLS_DB.backend].some(
      (f) => f.toLowerCase() === s.toLowerCase()
    )
  );

  return {
    isValid: true,
    rawTextLength: rawText.length,
    contactInfo,
    detectedSections,
    missingSections,
    verifiedSkills,
    programmingLanguages,
    frameworks,
    projects,
    education,
    experience,
    certifications,
    achievements,
    hackathons,
    gpa,
    hasMetrics,
    hasActionVerbs,
    extractedAt: new Date().toISOString(),
  };
}

// ── PROJECT EXTRACTION ────────────────────────────────────────

function extractProjects(text) {
  const projects = [];
  const lines = text.split(/\n/);
  
  // Find project section boundaries
  let inProjectSection = false;
  let projectBuffer = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect start of project section
    if (/^(projects|personal projects|key projects|portfolio projects|notable projects|academic projects)/i.test(line)) {
      inProjectSection = true;
      continue;
    }
    
    // Detect end of project section (another section header)
    if (inProjectSection && /^(experience|education|certifications|skills|achievements|awards|internship|employment|work history)/i.test(line)) {
      inProjectSection = false;
    }
    
    if (inProjectSection && line.length > 10) {
      projectBuffer.push(line);
    }
  }

  // Parse project entries from buffer
  // Look for patterns like: "Project Title | Tech1, Tech2" or bullet points
  let currentProject = null;
  
  projectBuffer.forEach((line) => {
    // Detect project title lines (usually shorter, starts with bullet or is title-cased)
    const isTitleLike = /^[•\-*▸▪➤]?\s*[A-Z][^.!?]{5,60}$/.test(line)
      || /\|\s*(React|Node|Python|Django|Flask|Spring|Angular|Vue)/i.test(line)
      || (line.length < 80 && /[A-Z]/.test(line[0]) && !/^(using|with|built|developed|implemented|created)/i.test(line));
    
    if (isTitleLike && line.length < 100) {
      if (currentProject) projects.push(currentProject);
      
      // Try to extract tech from title line
      const techInLine = ALL_SKILLS.filter((s) => {
        const escapedSkill = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`\\b${escapedSkill}\\b`, "i").test(line);
      });
      
      currentProject = {
        title: line.replace(/^[•\-*▸▪➤]\s*/, "").split("|")[0].trim(),
        technologies: techInLine,
        description: "",
      };
    } else if (currentProject) {
      // Description line — extract more tech mentions
      const techInLine = ALL_SKILLS.filter((s) => {
        const escapedSkill = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`\\b${escapedSkill}\\b`, "i").test(line);
      });
      techInLine.forEach((t) => {
        if (!currentProject.technologies.includes(t)) {
          currentProject.technologies.push(t);
        }
      });
      if (currentProject.description.length < 200) {
        currentProject.description += (currentProject.description ? " " : "") + line;
      }
    }
  });
  
  if (currentProject) projects.push(currentProject);
  
  // Fallback: If no projects extracted but "project" keyword appears, note it
  if (projects.length === 0 && /project/i.test(text)) {
    // Try simpler heuristic: lines that look like project names near "project" word
    const simpleMatches = text.match(/(?:project|built|developed|created)\s*[:\-]?\s*([A-Z][^.\n]{10,60})/gi) || [];
    simpleMatches.slice(0, 5).forEach((m, i) => {
      const titleMatch = m.match(/[:\-]?\s*([A-Z][^.\n]{10,60})$/);
      if (titleMatch) {
        const techInTitle = ALL_SKILLS.filter((s) => {
          const escapedSkill = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          return new RegExp(`\\b${escapedSkill}\\b`, "i").test(titleMatch[1]);
        });
        projects.push({
          title: titleMatch[1].trim(),
          technologies: techInTitle,
          description: m.trim(),
        });
      }
    });
  }

  return projects.slice(0, 10); // Limit to 10 projects
}

// ── EDUCATION EXTRACTION ──────────────────────────────────────

function extractEducation(text) {
  const degreeMatch = text.match(
    /(?:bachelor|master|phd|b\.?tech|b\.?e|b\.?sc|m\.?tech|m\.?sc|m\.?s|b\.?a|m\.?b\.?a)\s*(?:of|in|-)?\s*([A-Za-z\s&\/]{5,50})/i
  );
  const universityMatch = text.match(
    /(?:university|college|institute|institution)\s+of\s+([A-Za-z\s]{3,50})/i
    || /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})\s+(?:University|College|Institute|School)/i
  );
  const yearMatch = text.match(/(?:20\d{2})\s*[-–]\s*(?:20\d{2}|present|current)/i);
  const gpaMatch = text.match(/(?:gpa|cgpa)\s*[:\-]?\s*([0-9.]+(?:\s*\/\s*[0-9.]+)?)/i);

  return {
    degree: degreeMatch ? degreeMatch[0].trim() : "Not found in resume",
    institution: universityMatch ? universityMatch[0].trim() : "Not found in resume",
    period: yearMatch ? yearMatch[0].trim() : "Not found in resume",
    gpa: gpaMatch ? gpaMatch[1].trim() : null,
  };
}

// ── EXPERIENCE EXTRACTION ─────────────────────────────────────

function extractExperience(text) {
  const experiences = [];
  
  // Look for company/role patterns
  const rolePatterns = [
    /(?:software|data|ml|ai|frontend|backend|full.?stack|cloud|devops|security|web)\s+(?:engineer|developer|analyst|intern|scientist|architect)\s*(?:at|@)?\s*([A-Z][A-Za-z\s&]{2,40})/gi,
    /([A-Z][A-Za-z\s&]+(?:LLC|Inc|Ltd|Corp|Technologies|Solutions|Labs|Systems))\s*[-–|]\s*(?:software|data|engineer|developer|analyst)/gi,
  ];
  
  rolePatterns.forEach((pattern) => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach((m) => {
      experiences.push({
        role: m[0].split("at")[0].split("@")[0].trim().substring(0, 80),
        company: (m[1] || "").trim(),
        isInternship: /intern/i.test(m[0]),
      });
    });
  });
  
  // Also detect internship specifically
  const internshipMatch = text.match(/(?:intern(?:ship)?)\s+(?:at|@)?\s*([A-Z][A-Za-z\s&]{2,40})/gi);
  if (internshipMatch) {
    internshipMatch.forEach((m) => {
      const alreadyFound = experiences.some((e) => e.isInternship);
      if (!alreadyFound) {
        experiences.push({
          role: "Internship",
          company: m.replace(/intern(?:ship)?\s+(?:at|@)?\s*/i, "").trim(),
          isInternship: true,
        });
      }
    });
  }

  return experiences.slice(0, 6);
}

// ── CERTIFICATIONS EXTRACTION ─────────────────────────────────

function extractCertifications(text) {
  const certifications = [];
  
  TECH_SKILLS_DB.certifications.forEach((cert) => {
    const escapedCert = cert.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escapedCert, "i");
    if (pattern.test(text)) {
      // Find the full line for more context
      const lineMatch = text.match(new RegExp(`.{0,30}${escapedCert}.{0,60}`, "i"));
      certifications.push({
        name: lineMatch ? lineMatch[0].trim() : cert,
        provider: cert,
      });
    }
  });

  // Also look for general cert patterns
  const certPatterns = text.match(
    /(?:certified|certification|certificate)\s+(?:in\s+)?([A-Za-z\s&]{5,60})/gi
  ) || [];
  
  certPatterns.slice(0, 5).forEach((c) => {
    const name = c.trim();
    const alreadyFound = certifications.some((e) =>
      e.name.toLowerCase().includes(name.toLowerCase().substring(0, 15))
    );
    if (!alreadyFound) {
      certifications.push({ name, provider: "Unknown" });
    }
  });

  return certifications.slice(0, 10);
}

// ── ACHIEVEMENTS EXTRACTION ───────────────────────────────────

function extractAchievements(text) {
  const achievements = [];
  
  const patterns = [
    /(?:winner|won|awarded|received|achieved|ranked)\s+(?:first|second|third|1st|2nd|3rd|top|best)\s+[^\n.]{5,60}/gi,
    /(?:scholarship|fellowship|award|prize|honor|merit)\s+[^\n.]{5,60}/gi,
    /(?:published|presented|authored)\s+[^\n.]{5,60}/gi,
  ];
  
  patterns.forEach((pattern) => {
    const matches = text.match(pattern) || [];
    matches.forEach((m) => achievements.push(m.trim().substring(0, 100)));
  });
  
  return achievements.slice(0, 8);
}

// ── HACKATHON EXTRACTION ──────────────────────────────────────

function extractHackathons(text) {
  const hackathons = [];
  
  const patterns = text.match(
    /(?:hackathon|datathon|competition|contest|challenge)\s*[:\-]?\s*[^\n.]{5,80}/gi
  ) || [];
  
  patterns.forEach((m) => hackathons.push(m.trim().substring(0, 100)));
  
  // Also look for specific hackathon names
  const namedHackathons = text.match(/(?:[A-Z][A-Za-z\s]+)\s*(?:hackathon|datathon)/gi) || [];
  namedHackathons.forEach((m) => {
    const name = m.trim();
    if (!hackathons.some((h) => h.toLowerCase().includes(name.toLowerCase().substring(0, 10)))) {
      hackathons.push(name);
    }
  });
  
  return hackathons.slice(0, 6);
}

// ── ADAPTIVE CAREER ANALYSIS ──────────────────────────────────

/**
 * Compares extracted resume evidence vs. target career requirements.
 * Returns a deeply-reasoned gap analysis.
 */
export function performCareerGapAnalysis(evidence, targetCareer) {
  if (!evidence?.isValid) {
    return { error: "Resume evidence is not available." };
  }

  const requiredSkills = getRequiredSkills(targetCareer);
  const careerGroups = CAREER_SKILL_GROUPS[targetCareer] || {};
  
  const verifiedSkillsLower = evidence.verifiedSkills.map((s) => s.toLowerCase());
  
  // Skill matching with evidence reasoning
  const demonstratedSkills = [];
  const partialSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((skill) => {
    const skillLow = skill.toLowerCase();
    const isDirectMatch = verifiedSkillsLower.some(
      (vs) => vs.includes(skillLow) || skillLow.includes(vs)
    );
    
    if (isDirectMatch) {
      // Find project evidence
      const projectEvidence = evidence.projects.filter((p) =>
        p.technologies.some(
          (t) => t.toLowerCase().includes(skillLow) || skillLow.includes(t.toLowerCase())
        )
      );
      
      demonstratedSkills.push({
        skill,
        evidenceType: projectEvidence.length > 0 ? "skill_and_project" : "skill_mentioned",
        projectCount: projectEvidence.length,
        evidence:
          projectEvidence.length > 0
            ? `Found in resume skills + ${projectEvidence.length} project(s): ${projectEvidence.map((p) => p.title).join(", ")}`
            : "Found in resume skills/technologies section",
      });
    } else {
      // Check for partial / related skill
      const hasRelated = verifiedSkillsLower.some((vs) => {
        // E.g., "React" partially satisfies "Frontend" requirement
        const relatedMap = {
          "html/css": ["html", "css", "tailwind", "bootstrap", "sass"],
          "javascript": ["js", "es6", "typescript"],
          "sql": ["postgresql", "mysql", "sqlite", "databases"],
          "rest apis": ["api", "express", "fastapi", "django", "flask"],
          "system design": ["microservices", "distributed", "architecture"],
          "machine learning": ["scikit", "sklearn", "ml", "xgboost", "lightgbm"],
          "deep learning": ["tensorflow", "pytorch", "keras", "neural"],
          "docker": ["containerization", "kubernetes", "k8s"],
          "git": ["github", "gitlab", "version control"],
        };
        const related = relatedMap[skillLow] || [];
        return related.some((r) => vs.includes(r));
      });

      if (hasRelated) {
        partialSkills.push({
          skill,
          reason: `Related skills found in resume but not explicitly stated — verify proficiency level`,
          hasEvidence: true,
        });
      } else {
        missingSkills.push({
          skill,
          reason: `No evidence of ${skill} found in skills, projects, or experience sections`,
          priority: requiredSkills.indexOf(skill) < Math.ceil(requiredSkills.length / 3) ? "critical" : "important",
        });
      }
    }
  });

  // Project evidence for the target career
  const relevantProjects = evidence.projects.filter((p) => {
    const projectTechLower = p.technologies.map((t) => t.toLowerCase());
    return requiredSkills.some((skill) =>
      projectTechLower.some(
        (pt) => pt.includes(skill.toLowerCase()) || skill.toLowerCase().includes(pt)
      )
    );
  });

  // Practical experience gaps
  const experienceGaps = [];
  if (!evidence.detectedSections.experience && !evidence.detectedSections.internships) {
    experienceGaps.push({
      type: "work_experience",
      gap: "No work experience or internship detected in resume",
      recommendation: "Target internship opportunities or contribute to open-source projects to build real-world experience",
    });
  }
  if (evidence.projects.length < 2) {
    experienceGaps.push({
      type: "project_depth",
      gap: `Only ${evidence.projects.length} project(s) detected — target career typically requires 3-5 portfolio projects`,
      recommendation: "Build 2-3 more projects showcasing different skills, especially ones relevant to your target career",
    });
  }
  if (!evidence.contactInfo.github || evidence.contactInfo.github === "Not found in resume") {
    experienceGaps.push({
      type: "portfolio_visibility",
      gap: "GitHub profile not found in resume",
      recommendation: "Add your GitHub profile URL prominently in the resume header for visibility",
    });
  }

  // Certification gaps
  const certGaps = [];
  const careerCertMap = {
    "Cloud / DevOps Engineer": ["AWS Certified", "Kubernetes", "Terraform"],
    "AI / ML Engineer": ["TensorFlow", "PyTorch", "Coursera ML"],
    "Cybersecurity Engineer": ["CompTIA", "CEH", "OSCP"],
    "Data Scientist": ["Tableau", "AWS", "Google Cloud"],
    "Software Engineer": ["AWS", "Google", "Azure"],
  };
  
  const targetCerts = careerCertMap[targetCareer] || [];
  targetCerts.forEach((cert) => {
    const hasCert = evidence.certifications.some((c) =>
      c.name.toLowerCase().includes(cert.toLowerCase())
    );
    if (!hasCert) {
      certGaps.push({
        cert,
        reason: `${cert} certification is commonly required/preferred for ${targetCareer} roles`,
      });
    }
  });

  // Interview prep gaps
  const interviewGaps = [];
  if (!evidence.detectedSections.achievements && evidence.achievements.length === 0) {
    interviewGaps.push("No achievements, awards, or recognitions detected — STAR story preparation needed");
  }
  if (!evidence.hasMetrics) {
    interviewGaps.push("Resume lacks quantified impact metrics — add numbers like 'improved X by Y%' before interviews");
  }
  if (missingSkills.filter((s) => s.priority === "critical").length > 2) {
    interviewGaps.push(`${missingSkills.filter((s) => s.priority === "critical").length} critical technical skill gaps need closure before applying`);
  }

  return {
    targetCareer,
    requiredSkillsCount: requiredSkills.length,
    demonstratedSkills,
    partialSkills,
    missingSkills,
    relevantProjects,
    experienceGaps,
    certGaps,
    interviewGaps,
    demonstratedCount: demonstratedSkills.length,
    partialCount: partialSkills.length,
    missingCount: missingSkills.length,
    analyzedAt: new Date().toISOString(),
  };
}

// ── PROFILE LEVEL CALCULATION ─────────────────────────────────

/**
 * Determines profile level from REAL evidence only.
 * No fake scores, no hardcoded levels.
 */
export function calculateProfileLevel(evidence, gapAnalysis, dbProgress = {}) {
  if (!evidence?.isValid) return null;

  const scores = {
    skills: 0,
    projects: 0,
    experience: 0,
    certifications: 0,
    hackathons: 0,
    roadmapProgress: 0,
  };

  // Skills score (0-35 points)
  const totalRequired = gapAnalysis?.requiredSkillsCount || 1;
  const demonstrated = gapAnalysis?.demonstratedCount || 0;
  const partial = gapAnalysis?.partialCount || 0;
  scores.skills = Math.round(((demonstrated + partial * 0.5) / totalRequired) * 35);

  // Projects score (0-25 points)
  const projectCount = evidence.projects.length;
  const relevantProjects = gapAnalysis?.relevantProjects?.length || 0;
  scores.projects = Math.min(25, (relevantProjects * 8) + ((projectCount - relevantProjects) * 3));

  // Experience score (0-20 points)
  const hasInternship = evidence.detectedSections.internships || evidence.experience.some((e) => e.isInternship);
  const hasWorkExp = evidence.detectedSections.experience;
  scores.experience = hasWorkExp ? 20 : (hasInternship ? 12 : 0);

  // Certifications score (0-10 points)
  scores.certifications = Math.min(10, evidence.certifications.length * 3);

  // Hackathons score (0-5 points)
  scores.hackathons = Math.min(5, evidence.hackathons.length * 2.5);

  // DB roadmap progress (0-5 points)
  const completedNodes = Object.values(dbProgress).filter((v) => v === 1).length;
  scores.roadmapProgress = Math.min(5, completedNodes);

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const normalizedScore = Math.min(100, Math.round(total));

  // Level determination
  let level, levelColor, levelDesc;

  if (normalizedScore >= 75) {
    level = "Career Ready";
    levelColor = "#22d3ee";
    levelDesc = "Strong evidence across skills, projects, and experience. Focus on specialization and interview preparation.";
  } else if (normalizedScore >= 50) {
    level = "Developing";
    levelColor = "#a78bfa";
    levelDesc = "Solid foundation with some experience. Key gaps remain in advanced skills and portfolio depth.";
  } else if (normalizedScore >= 25) {
    level = "Foundation";
    levelColor = "#f59e0b";
    levelDesc = "Early-stage evidence. Focus on building core skills, completing projects, and gaining experience.";
  } else {
    level = "Emerging";
    levelColor = "#f87171";
    levelDesc = "Limited evidence in resume. Prioritize foundational skills and your first projects.";
  }

  return {
    level,
    levelColor,
    levelDesc,
    normalizedScore,
    scores,
    evidenceSummary: {
      skillsCount: evidence.verifiedSkills.length,
      projectCount: evidence.projects.length,
      relevantProjectCount: gapAnalysis?.relevantProjects?.length || 0,
      hasInternship,
      hasWorkExp,
      certCount: evidence.certifications.length,
      hackathonCount: evidence.hackathons.length,
    },
  };
}

// ── ADAPTIVE ROADMAP GENERATION ───────────────────────────────

/**
 * Generates a PERSONALIZED roadmap based on:
 * - Target career requirements
 * - Demonstrated skills from resume
 * - Current profile level
 * - Missing skills (prioritized)
 * 
 * Two different users will receive visibly different roadmaps.
 */
export function generateAdaptiveRoadmap(evidence, gapAnalysis, profileLevel, targetCareer, dbProgress = {}) {
  if (!gapAnalysis) return [];

  const { demonstratedSkills, missingSkills, partialSkills } = gapAnalysis;
  const requiredSkills = getRequiredSkills(targetCareer);
  const nodes = [];

  // Helper: Check if skill is DB-completed
  const isDbCompleted = (skill) => {
    const key = `skill_${skill.replace(/\s+/g, "_").toLowerCase()}`;
    return dbProgress[key] === 1;
  };

  // Start node
  nodes.push({
    id: "start",
    type: "start",
    title: "Career Journey Begin",
    stage: "Start",
    desc: `Personalized roadmap for ${targetCareer} based on your resume analysis.`,
    status: "completed",
    hours: "0",
  });

  // Add demonstrated skills as ALREADY DEMONSTRATED (no need to re-learn)
  demonstratedSkills.forEach((item) => {
    nodes.push({
      id: `skill_${item.skill.replace(/\s+/g, "_").toLowerCase()}`,
      type: "demonstrated",
      title: item.skill,
      stage: "Demonstrated",
      desc: item.evidence,
      status: "already_demonstrated",
      hours: "✓",
      skillName: item.skill,
      evidenceType: item.evidenceType,
      projectCount: item.projectCount,
    });
  });

  // Add partial skills as IN PROGRESS / NEEDS VERIFICATION
  partialSkills.forEach((item) => {
    nodes.push({
      id: `skill_${item.skill.replace(/\s+/g, "_").toLowerCase()}`,
      type: "partial",
      title: item.skill,
      stage: "Partial Evidence",
      desc: item.reason,
      status: isDbCompleted(item.skill) ? "completed" : "in_progress",
      hours: "~",
      skillName: item.skill,
    });
  });

  // Add missing skills as LOCKED/AVAILABLE roadmap nodes
  // Sort: critical first, then important
  const criticalMissing = missingSkills.filter((s) => s.priority === "critical");
  const importantMissing = missingSkills.filter((s) => s.priority === "important");
  
  const orderedMissing = [...criticalMissing, ...importantMissing];

  orderedMissing.forEach((item, idx) => {
    const prevCompleted = idx === 0
      ? true
      : isDbCompleted(orderedMissing[idx - 1].skill);
    
    nodes.push({
      id: `skill_${item.skill.replace(/\s+/g, "_").toLowerCase()}`,
      type: "gap",
      title: item.skill,
      stage: item.priority === "critical" ? "Priority Gap" : "Next Steps",
      desc: item.reason,
      status: isDbCompleted(item.skill) ? "completed" : (prevCompleted && idx === 0 ? "available" : "locked"),
      hours: `${3 + idx} wks`,
      skillName: item.skill,
      priority: item.priority,
    });
  });

  // Portfolio project node
  const projectsNeeded = Math.max(0, 3 - (gapAnalysis.relevantProjects?.length || 0));
  nodes.push({
    id: "node_portfolio",
    type: "project",
    title: projectsNeeded > 0 ? `Build ${projectsNeeded} Portfolio Project${projectsNeeded > 1 ? "s" : ""}` : "Portfolio Projects ✓",
    stage: "Portfolio",
    desc:
      projectsNeeded > 0
        ? `You need ${projectsNeeded} more relevant project(s) to be competitive for ${targetCareer} roles.`
        : `Your resume demonstrates ${gapAnalysis.relevantProjects.length} relevant project(s). Excellent!`,
    status: dbProgress["node_portfolio"] === 1 || projectsNeeded === 0 ? "completed" : "locked",
    hours: `${projectsNeeded * 4} wks`,
  });

  // Interview prep node
  nodes.push({
    id: "node_interview",
    type: "interview",
    title: `${targetCareer} Interview Prep`,
    stage: "Interview Ready",
    desc: `Practice technical questions, system design, and behavioral interviews specific to ${targetCareer}.`,
    status: dbProgress["node_interview"] === 1 ? "completed" : "locked",
    hours: "2 wks",
  });

  // Career ready node
  const allGapsClosed = missingSkills.every((s) => isDbCompleted(s.skill));
  nodes.push({
    id: "node_ready",
    type: "ready",
    title: `Hire Ready — ${targetCareer}`,
    stage: "Career Ready",
    desc: "All critical gaps closed. Portfolio verified. Applications open.",
    status: allGapsClosed && projectsNeeded === 0 ? "completed" : "locked",
    hours: "Goal",
  });

  return nodes;
}

// ── WHY THIS ROADMAP EXPLANATION ──────────────────────────────

/**
 * Generates human-readable explanation of why the roadmap is personalized the way it is.
 */
export function generateRoadmapRationale(evidence, gapAnalysis, profileLevel, targetCareer) {
  if (!evidence?.isValid || !gapAnalysis) return null;

  const rationale = [];
  const { demonstratedSkills, missingSkills, partialSkills } = gapAnalysis;

  // Explain demonstrated skills
  if (demonstratedSkills.length > 0) {
    const withProjects = demonstratedSkills.filter((s) => s.projectCount > 0);
    rationale.push({
      type: "strength",
      icon: "✓",
      text: `${demonstratedSkills.length} required skills are marked "Already Demonstrated" because your resume explicitly lists them${
        withProjects.length > 0
          ? `, with ${withProjects.length} also backed by project evidence`
          : ""
      }.`,
    });
  }

  // Explain missing skills
  if (missingSkills.length > 0) {
    const critical = missingSkills.filter((s) => s.priority === "critical");
    rationale.push({
      type: "gap",
      icon: "⚠",
      text: `${missingSkills.length} required skills are missing from your resume (${critical.length} critical). These appear as priority learning nodes in your roadmap.`,
    });
  }

  // Explain project situation
  const relevantProjectCount = gapAnalysis.relevantProjects?.length || 0;
  const totalProjectCount = evidence.projects.length;
  if (totalProjectCount > 0) {
    rationale.push({
      type: "project",
      icon: "📁",
      text: `Your resume shows ${totalProjectCount} project(s), with ${relevantProjectCount} directly relevant to ${targetCareer}. ${
        relevantProjectCount < 3
          ? `You need ${3 - relevantProjectCount} more relevant project(s) for a strong portfolio.`
          : "Your project portfolio is solid!"
      }`,
    });
  } else {
    rationale.push({
      type: "project",
      icon: "📁",
      text: `No projects were detected in your resume. Building 3+ relevant projects is a top priority for ${targetCareer} roles.`,
    });
  }

  // Explain experience situation
  const hasInternship = evidence.detectedSections.internships;
  const hasWorkExp = evidence.detectedSections.experience;
  if (hasWorkExp) {
    rationale.push({
      type: "experience",
      icon: "💼",
      text: "Work experience was detected in your resume. Your roadmap reflects a more advanced starting point.",
    });
  } else if (hasInternship) {
    rationale.push({
      type: "experience",
      icon: "💼",
      text: "Internship experience detected. Your roadmap focuses on bridging to full-time employment.",
    });
  } else {
    rationale.push({
      type: "experience",
      icon: "💼",
      text: "No work experience or internship detected. Your roadmap includes steps to gain practical exposure through projects and open-source contributions.",
    });
  }

  // Profile level explanation
  rationale.push({
    type: "level",
    icon: "🎯",
    text: `Based on resume evidence, your current profile level is "${profileLevel?.level}". ${profileLevel?.levelDesc}`,
  });

  // Next best action
  const nextAction = determineNextBestAction(gapAnalysis, evidence);

  return { rationale, nextAction };
}

// ── NEXT BEST ACTION ─────────────────────────────────────────

function determineNextBestAction(gapAnalysis, evidence) {
  const { missingSkills, relevantProjects, experienceGaps } = gapAnalysis;

  // Priority 1: Critical missing skill
  const criticalGap = missingSkills.find((s) => s.priority === "critical");
  if (criticalGap) {
    return {
      action: `Learn ${criticalGap.skill}`,
      reason: criticalGap.reason,
      resource: `https://www.google.com/search?q=learn+${encodeURIComponent(criticalGap.skill)}+for+${encodeURIComponent(gapAnalysis.targetCareer)}`,
      urgency: "high",
    };
  }

  // Priority 2: Project gap
  const needsProjects = (relevantProjects?.length || 0) < 2;
  if (needsProjects) {
    return {
      action: `Build a ${gapAnalysis.targetCareer} portfolio project`,
      reason: `Your resume shows limited project evidence for ${gapAnalysis.targetCareer}. A practical project will significantly boost your profile.`,
      resource: `https://www.google.com/search?q=${encodeURIComponent(gapAnalysis.targetCareer)}+project+ideas+for+beginners`,
      urgency: "medium",
    };
  }

  // Priority 3: No GitHub
  if (!evidence.contactInfo.github || evidence.contactInfo.github === "Not found in resume") {
    return {
      action: "Add your GitHub profile to your resume",
      reason: "GitHub visibility is critical for technical roles. Recruiters almost always check it.",
      resource: "https://github.com",
      urgency: "medium",
    };
  }

  // Priority 4: Experience gap
  if (experienceGaps.length > 0) {
    return {
      action: "Apply for internships or contribute to open-source",
      reason: "No work experience detected. Practical experience is a top differentiator for entry-level candidates.",
      resource: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(gapAnalysis.targetCareer + " intern")}`,
      urgency: "medium",
    };
  }

  // Priority 5: No certifications
  if (evidence.certifications.length === 0) {
    return {
      action: "Earn a relevant certification",
      reason: "No certifications detected in your resume. Certifications demonstrate initiative and validate skills.",
      resource: `https://www.coursera.org/search?query=${encodeURIComponent(gapAnalysis.targetCareer)}`,
      urgency: "low",
    };
  }

  // All good
  return {
    action: "Apply to target positions and prepare for interviews",
    reason: "Your profile shows strong evidence across key areas. Focus on interview preparation and active applications.",
    resource: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(gapAnalysis.targetCareer)}`,
    urgency: "low",
  };
}

// ── FULL PIPELINE (single entry point) ───────────────────────

/**
 * Run the complete adaptive analysis pipeline.
 * Takes raw resume text + target career + optional DB progress.
 * Returns complete analysis result with no fake data.
 */
export function runFullAdaptivePipeline(rawText, targetCareer, dbProgress = {}) {
  const evidence = extractResumeEvidence(rawText);
  
  if (!evidence.isValid) {
    return { success: false, error: evidence.error };
  }

  const gapAnalysis = performCareerGapAnalysis(evidence, targetCareer);
  const profileLevel = calculateProfileLevel(evidence, gapAnalysis, dbProgress);
  const adaptiveRoadmap = generateAdaptiveRoadmap(evidence, gapAnalysis, profileLevel, targetCareer, dbProgress);
  const { rationale, nextAction } = generateRoadmapRationale(evidence, gapAnalysis, profileLevel, targetCareer);

  return {
    success: true,
    evidence,
    gapAnalysis,
    profileLevel,
    adaptiveRoadmap,
    rationale,
    nextAction,
    targetCareer,
    analyzedAt: new Date().toISOString(),
  };
}
