import React, { useState, useMemo } from "react";
import { 
  Award, Search, Filter, Plus, ExternalLink, Bookmark, 
  CheckCircle2, ChevronDown, Clock, BarChart, ArrowRight, 
  Trash2, Edit3, UploadCloud, Target, Briefcase, BookOpen,
  Sparkles, Layers, Globe, FileText, Check, ShieldCheck
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ModalShell from "../ui/ModalShell";
import { SKILL_REQUIREMENTS } from "../../data/userProfile";

// ── REAL RECOMMENDED LEARNING RESOURCES DATASET ─────────────────────
export const RECOMMENDED_RESOURCES = [
  // Full Stack & Web Dev
  {
    id: "res_fullstack_coursera",
    name: "Full Stack Web Development with React Specialization",
    provider: "Coursera",
    platform: "Coursera",
    type: "Professional Certificate",
    difficulty: "Intermediate",
    duration: "3-4 months",
    url: "https://www.coursera.org/specializations/full-stack-react",
    skills: ["React", "Node.js", "JavaScript", "HTML/CSS", "REST APIs", "Express"],
    careers: ["Full Stack Developer", "Frontend Developer", "Software Engineer"]
  },
  {
    id: "res_fcc_responsive_web",
    name: "Responsive Web Design Certification",
    provider: "freeCodeCamp",
    platform: "freeCodeCamp",
    type: "Certification",
    difficulty: "Beginner",
    duration: "300 hours",
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
    skills: ["HTML/CSS", "JavaScript", "Responsive Design", "Flexbox", "CSS Grid"],
    careers: ["Frontend Developer", "Full Stack Developer", "UI/UX Designer"]
  },
  {
    id: "res_udemy_modern_react",
    name: "The Complete React Developer Course (w/ Redux, Hooks)",
    provider: "Udemy",
    platform: "Udemy",
    type: "Course",
    difficulty: "Intermediate",
    duration: "40 hours",
    url: "https://www.udemy.com/course/react-2nd-edition/",
    skills: ["React", "JavaScript", "Redux", "Hooks", "TypeScript"],
    careers: ["Frontend Developer", "Full Stack Developer"]
  },
  {
    id: "res_backend_node_edx",
    name: "Developing Backend Apps with Node.js and Express",
    provider: "edX / IBM",
    platform: "edX",
    type: "Course",
    difficulty: "Intermediate",
    duration: "4 weeks",
    url: "https://www.edx.org/learn/node-js",
    skills: ["Node.js", "Express", "REST APIs", "JavaScript", "Backend Development"],
    careers: ["Backend Developer", "Full Stack Developer", "Software Engineer"]
  },
  {
    id: "res_meta_frontend_coursera",
    name: "Meta Front-End Developer Professional Certificate",
    provider: "Coursera / Meta",
    platform: "Coursera",
    type: "Professional Certificate",
    difficulty: "Beginner",
    duration: "7 months",
    url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    skills: ["React", "JavaScript", "HTML/CSS", "Git", "Figma", "UI/UX"],
    careers: ["Frontend Developer", "Full Stack Developer", "UI/UX Designer"]
  },

  // AI & Machine Learning
  {
    id: "res_deeplearning_ai_specialization",
    name: "Deep Learning Specialization by Andrew Ng",
    provider: "DeepLearning.AI / Coursera",
    platform: "Coursera",
    type: "Professional Certificate",
    difficulty: "Advanced",
    duration: "3-4 months",
    url: "https://www.coursera.org/specializations/deep-learning",
    skills: ["Deep Learning", "Python", "Neural Networks", "TensorFlow", "CNNs", "NLP"],
    careers: ["AI / ML Engineer", "Data Scientist", "AI/ML Engineer"]
  },
  {
    id: "res_tf_dev_cert",
    name: "Google TensorFlow Developer Certificate",
    provider: "Google",
    platform: "Google",
    type: "Certification",
    difficulty: "Intermediate",
    duration: "6-8 weeks",
    url: "https://www.tensorflow.org/certificate",
    skills: ["TensorFlow", "Python", "Deep Learning", "Machine Learning", "Computer Vision"],
    careers: ["AI / ML Engineer", "Data Scientist"]
  },
  {
    id: "res_ml_stanford_coursera",
    name: "Machine Learning Specialization",
    provider: "Stanford / Coursera",
    platform: "Coursera",
    type: "Course",
    difficulty: "Beginner",
    duration: "2-3 months",
    url: "https://www.coursera.org/specializations/machine-learning-introduction",
    skills: ["Machine Learning", "Python", "Supervised Learning", "Statistics", "Scikit-Learn"],
    careers: ["AI / ML Engineer", "Data Scientist", "Data Analyst"]
  },
  {
    id: "res_gcp_ai_engineer",
    name: "Google Cloud Machine Learning Engineer Path",
    provider: "Google Cloud Skills Boost",
    platform: "Google",
    type: "Certification",
    difficulty: "Advanced",
    duration: "2 months",
    url: "https://cloud.google.com/innovators/skillsboost",
    skills: ["Machine Learning", "Google Cloud", "Python", "MLOps", "TensorFlow"],
    careers: ["AI / ML Engineer", "Cloud / DevOps Engineer"]
  },

  // Data Science & Analytics
  {
    id: "res_google_data_analytics",
    name: "Google Data Analytics Professional Certificate",
    provider: "Google / Coursera",
    platform: "Coursera",
    type: "Professional Certificate",
    difficulty: "Beginner",
    duration: "6 months",
    url: "https://www.coursera.org/professional-certificates/google-data-analytics",
    skills: ["SQL", "R", "Tableau", "Data Analysis", "Spreadsheets", "Data Visualization"],
    careers: ["Data Analyst", "Data Scientist"]
  },
  {
    id: "res_ibm_data_science",
    name: "IBM Data Science Professional Certificate",
    provider: "IBM / Coursera",
    platform: "Coursera",
    type: "Professional Certificate",
    difficulty: "Intermediate",
    duration: "5 months",
    url: "https://www.coursera.org/professional-certificates/ibm-data-science",
    skills: ["Python", "SQL", "Data Science", "Machine Learning", "Pandas", "NumPy"],
    careers: ["Data Scientist", "Data Analyst", "AI / ML Engineer"]
  },
  {
    id: "res_sql_freecodecamp",
    name: "Relational Database & SQL Certification",
    provider: "freeCodeCamp",
    platform: "freeCodeCamp",
    type: "Certification",
    difficulty: "Beginner",
    duration: "300 hours",
    url: "https://www.freecodecamp.org/learn/relational-database/",
    skills: ["SQL", "PostgreSQL", "Bash", "Git", "Database Design"],
    careers: ["Data Analyst", "Backend Developer", "Full Stack Developer", "Data Scientist"]
  },

  // Cloud & DevOps
  {
    id: "res_aws_cloud_practitioner",
    name: "AWS Certified Cloud Practitioner",
    provider: "Amazon Web Services",
    platform: "AWS",
    type: "Certification",
    difficulty: "Beginner",
    duration: "3-4 weeks",
    url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    skills: ["AWS", "Cloud", "Linux", "Networking", "Security"],
    careers: ["Cloud / DevOps Engineer", "Cloud Engineer", "Software Engineer", "Backend Developer"]
  },
  {
    id: "res_aws_solutions_architect",
    name: "AWS Certified Solutions Architect – Associate",
    provider: "Amazon Web Services",
    platform: "AWS",
    type: "Certification",
    difficulty: "Intermediate",
    duration: "8-10 weeks",
    url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    skills: ["AWS", "System Design", "Cloud", "Docker", "Networking", "Security"],
    careers: ["Cloud / DevOps Engineer", "Cloud Engineer", "System Architect"]
  },
  {
    id: "res_docker_k8s_udemy",
    name: "Docker and Kubernetes: The Complete Guide",
    provider: "Udemy",
    platform: "Udemy",
    type: "Course",
    difficulty: "Intermediate",
    duration: "22 hours",
    url: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
    skills: ["Docker", "Kubernetes", "DevOps", "CI/CD", "Linux"],
    careers: ["Cloud / DevOps Engineer", "Software Engineer", "Backend Developer"]
  },
  {
    id: "res_az_900_microsoft",
    name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    provider: "Microsoft Learn",
    platform: "Microsoft",
    type: "Certification",
    difficulty: "Beginner",
    duration: "2-3 weeks",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
    skills: ["Cloud", "Azure", "Networking", "Security", "DevOps"],
    careers: ["Cloud Engineer", "Cloud / DevOps Engineer", "Software Engineer"]
  },

  // Cybersecurity
  {
    id: "res_google_cybersecurity",
    name: "Google Cybersecurity Professional Certificate",
    provider: "Google / Coursera",
    platform: "Coursera",
    type: "Professional Certificate",
    difficulty: "Beginner",
    duration: "6 months",
    url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
    skills: ["Networking", "Linux", "Python", "SIEM Tools", "Security", "Risk Assessment"],
    careers: ["Cybersecurity Engineer", "Cybersecurity Analyst"]
  },
  {
    id: "res_cissp_cisco",
    name: "Cisco Certified CyberOps Associate",
    provider: "Cisco Networking Academy",
    platform: "Cisco Networking Academy",
    type: "Certification",
    difficulty: "Intermediate",
    duration: "6 weeks",
    url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/cyberops/index.html",
    skills: ["Networking", "Cryptography", "Firewalls", "Security Analysis", "Linux"],
    careers: ["Cybersecurity Engineer", "Cybersecurity Analyst"]
  },

  // UI/UX & Software Engineering
  {
    id: "res_google_ux_design",
    name: "Google UX Design Professional Certificate",
    provider: "Google / Coursera",
    platform: "Coursera",
    type: "Professional Certificate",
    difficulty: "Beginner",
    duration: "6 months",
    url: "https://www.coursera.org/professional-certificates/google-ux-design",
    skills: ["Figma", "Prototyping", "User Research", "Wireframing", "UI/UX", "Typography"],
    careers: ["UI/UX Designer", "Frontend Developer"]
  },
  {
    id: "res_meta_android_dev",
    name: "Meta Android Developer Professional Certificate",
    provider: "Meta / Coursera",
    platform: "Coursera",
    type: "Professional Certificate",
    difficulty: "Intermediate",
    duration: "6 months",
    url: "https://www.coursera.org/professional-certificates/meta-android-developer",
    skills: ["Java", "Kotlin", "Android", "Git", "Data Structures", "Mobile UI"],
    careers: ["Software Engineer", "Full Stack Developer"]
  }
];

// Helper to get required skills for any custom career string
function getRequiredSkillsForCareer(targetCareer) {
  if (!targetCareer) return [];
  if (SKILL_REQUIREMENTS[targetCareer]) return SKILL_REQUIREMENTS[targetCareer];
  
  const careerLower = targetCareer.toLowerCase();
  if (careerLower.includes("react") || careerLower.includes("frontend")) {
    return ["JavaScript", "React", "HTML/CSS", "Git", "TypeScript", "REST APIs"];
  }
  if (careerLower.includes("node") || careerLower.includes("backend") || careerLower.includes("python")) {
    return ["Python", "Node.js", "SQL", "REST APIs", "Git", "System Design", "Docker"];
  }
  if (careerLower.includes("ai") || careerLower.includes("ml") || careerLower.includes("data")) {
    return ["Python", "Machine Learning", "Statistics", "SQL", "Deep Learning", "Docker"];
  }
  if (careerLower.includes("full") || careerLower.includes("web")) {
    return ["JavaScript", "React", "Node.js", "SQL", "Git", "HTML/CSS"];
  }
  return ["Problem Solving", "Git", "Data Structures", "System Design", "SQL"];
}

export function CertificationsView({ student, onUpdateStudent, added, toggleAdded, onAddToRoadmap, go, onStart }) {
  const [activeTab, setActiveTab] = useState("recommended"); // recommended | my-certs
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all | course | certification | professional
  const [levelFilter, setLevelFilter] = useState("all"); // all | beginner | intermediate | advanced
  const [platformFilter, setPlatformFilter] = useState("all"); // all | coursera | udemy | edx | aws | microsoft | google | freecodecamp

  // Modals & Upload State
  const [myCertModalOpen, setMyCertModalOpen] = useState(false);
  const [myCertToEdit, setMyCertToEdit] = useState(null);
  const [certFileName, setCertFileName] = useState("");
  const [certFileUrl, setCertFileUrl] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Derive authenticated user metrics
  const targetCareer = student?.targetCareer;
  const userSkills = Array.isArray(student?.skills) ? student.skills : [];
  const requiredSkills = getRequiredSkillsForCareer(targetCareer);

  // Compute skill gaps dynamically
  const userSkillSet = useMemo(() => {
    return new Set(userSkills.map(s => String(s).toLowerCase().trim()));
  }, [userSkills]);

  const missingSkills = useMemo(() => {
    return requiredSkills.filter(req => !userSkillSet.has(req.toLowerCase().trim()));
  }, [requiredSkills, userSkillSet]);

  // Evaluate & Score Resources based on target career & skill gaps
  const scoredResources = useMemo(() => {
    if (!targetCareer) return [];

    return RECOMMENDED_RESOURCES.map(res => {
      const resSkills = res.skills.map(s => s.toLowerCase());
      
      // Match against user's missing skill gaps
      const gapMatches = resSkills.filter(s => 
        missingSkills.some(gap => gap.toLowerCase().includes(s) || s.includes(gap.toLowerCase()))
      );

      // Match against career overall required skills
      const careerMatches = resSkills.filter(s => 
        requiredSkills.some(req => req.toLowerCase().includes(s) || s.includes(req.toLowerCase()))
      );

      const isTargetCareerMatch = res.careers.some(c => 
        c.toLowerCase().includes(targetCareer.toLowerCase()) || targetCareer.toLowerCase().includes(c.toLowerCase())
      );

      let score = 0;
      if (gapMatches.length > 0) score += 50 + gapMatches.length * 15;
      if (isTargetCareerMatch) score += 35;
      if (careerMatches.length > 0) score += 20;

      // Dynamic recommendation justification
      let reason = "";
      if (gapMatches.length > 0) {
        const topGap = gapMatches[0].charAt(0).toUpperCase() + gapMatches[0].slice(1);
        reason = `⚡ Recommended for your skill gap: ${topGap}`;
      } else if (isTargetCareerMatch) {
        reason = `🎯 Matches your career goal: ${targetCareer}`;
      } else {
        reason = `Recommended for building ${res.skills[0]} proficiency`;
      }

      return {
        ...res,
        score,
        gapMatches,
        isCareerMatch: isTargetCareerMatch,
        reason
      };
    }).sort((a, b) => b.score - a.score);
  }, [targetCareer, missingSkills, requiredSkills]);

  // Filtered recommendations
  const filteredResources = useMemo(() => {
    return scoredResources.filter(res => {
      // Text Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesQuery = 
          res.name.toLowerCase().includes(query) ||
          res.provider.toLowerCase().includes(query) ||
          res.platform.toLowerCase().includes(query) ||
          res.skills.some(s => s.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // Type Filter
      if (typeFilter !== "all") {
        if (typeFilter === "course" && !res.type.toLowerCase().includes("course")) return false;
        if (typeFilter === "certification" && !res.type.toLowerCase().includes("certification")) return false;
        if (typeFilter === "professional" && !res.type.toLowerCase().includes("professional")) return false;
      }

      // Level Filter
      if (levelFilter !== "all") {
        if (res.difficulty.toLowerCase() !== levelFilter.toLowerCase()) return false;
      }

      // Platform Filter
      if (platformFilter !== "all") {
        if (!res.platform.toLowerCase().includes(platformFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [scoredResources, search, typeFilter, levelFilter, platformFilter]);

  // Upload Handlers
  const handleCertFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'png', 'jpg', 'jpeg'].includes(ext)) {
      alert("Please select a PDF, PNG, or JPG file.");
      return;
    }
    setCertFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = () => {
      setCertFileUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMyCert = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newCert = {
      id: myCertToEdit?.id || Date.now().toString(),
      name: fd.get("name"),
      issuer: fd.get("issuer"),
      issueDate: fd.get("issueDate"),
      credentialId: fd.get("credentialId"),
      credentialUrl: certFileUrl || myCertToEdit?.credentialUrl || fd.get("credentialUrl"),
      fileName: certFileName || myCertToEdit?.fileName || "certificate_file",
      skills: fd.get("skills") ? fd.get("skills").split(",").map(s => s.trim()).filter(Boolean) : [],
    };
    
    const list = [...(student?.certificationsList || [])];
    if (myCertToEdit) {
      const idx = list.findIndex(c => c.id === myCertToEdit.id);
      if (idx !== -1) list[idx] = newCert;
    } else {
      list.push(newCert);
    }
    
    onUpdateStudent?.({ ...student, certificationsList: list }, "Certification saved to profile!");
    setMyCertModalOpen(false);
    setCertFileName("");
    setCertFileUrl("");
  };

  const handleDeleteMyCert = () => {
    if (!deleteTarget) return;
    const list = (student?.certificationsList || []).filter(c => c.id !== deleteTarget.id);
    onUpdateStudent?.({ ...student, certificationsList: list }, "Certification removed");
    setDeleteModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* ── HEADING & CAREER GOAL BINDING ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <SectionHeader 
            eyebrow="Build credentials that support your career goal" 
            title="Certifications & Resources" 
            subtitle={targetCareer 
              ? `Resources and certifications tailored for your ${targetCareer} goal.` 
              : "Complete your profile to receive personalized certification recommendations."} 
          />
        </div>
        <button
          onClick={() => { setMyCertToEdit(null); setCertFileName(""); setCertFileUrl(""); setMyCertModalOpen(true); }}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-xs text-white hover:from-cyan-400 transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus size={16} /> Add Certification
        </button>
      </div>

      {/* ── CAREER GOAL SUMMARY CARD ────────────────────────────────────── */}
      {targetCareer ? (
        <GlassCard className="p-6 relative overflow-hidden bg-gradient-to-br from-indigo-500/[0.04] via-cyan-500/[0.02] to-purple-500/[0.03]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-1">
                <Target size={15} /> YOUR CAREER GOAL
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{targetCareer}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Selected courses & certifications based on your target role and identified skill gaps.
              </p>
            </div>

            {missingSkills.length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl max-w-md shrink-0">
                <p className="text-xs text-amber-300 font-bold mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} /> High-Priority Skill Gaps Being Targeted:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.slice(0, 4).map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {missingSkills.length > 4 && (
                    <span className="text-xs text-slate-400 self-center">+{missingSkills.length - 4} more</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      ) : (
        /* ── EMPTY STATE FOR NEW USER / NO CAREER SET ──────────────────── */
        <GlassCard className="p-8 text-center border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
          <Target size={44} className="mx-auto text-cyan-400 mb-3" />
          <h3 className="text-lg font-bold text-white">Personalized resources are waiting.</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-6">
            Complete your career profile to receive recommendations based on your target role and skill gaps.
          </p>
          <button
            onClick={onStart}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-xs text-white hover:from-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
          >
            Complete Profile →
          </button>
        </GlassCard>
      )}

      {/* ── TABS ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab("recommended")} 
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "recommended" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles size={15} /> Recommended for You
        </button>
        <button 
          onClick={() => setActiveTab("my-certs")} 
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "my-certs" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <Award size={15} /> My Certifications ({student?.certificationsList?.length || 0})
        </button>
      </div>

      {/* ── TAB 1: RECOMMENDED RESOURCES ────────────────────────────────── */}
      {activeTab === "recommended" && (
        <div className="space-y-6">
          
          {/* SEARCH & FILTERS BAR */}
          <div className="space-y-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by skill, platform, course title (e.g. React, Python, AWS, Coursera)..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[#060911] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs">
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Filter Counters */}
              <div className="text-xs text-slate-400 font-medium shrink-0">
                Showing <span className="text-white font-bold">{filteredResources.length}</span> verified resources
              </div>
            </div>

            {/* Filter Dropdowns / Chips */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold mr-1">
                <Filter size={13} /> Filters:
              </div>

              {/* Type Filter */}
              <select 
                value={typeFilter} 
                onChange={e => setTypeFilter(e.target.value)}
                className="bg-[#0a0f1c] border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="course">Courses</option>
                <option value="certification">Certifications</option>
                <option value="professional">Professional Certificates</option>
              </select>

              {/* Level Filter */}
              <select 
                value={levelFilter} 
                onChange={e => setLevelFilter(e.target.value)}
                className="bg-[#0a0f1c] border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              {/* Platform Filter */}
              <select 
                value={platformFilter} 
                onChange={e => setPlatformFilter(e.target.value)}
                className="bg-[#0a0f1c] border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="all">All Platforms</option>
                <option value="coursera">Coursera</option>
                <option value="udemy">Udemy</option>
                <option value="edx">edX</option>
                <option value="aws">AWS</option>
                <option value="microsoft">Microsoft</option>
                <option value="google">Google</option>
                <option value="freecodecamp">freeCodeCamp</option>
              </select>
            </div>
          </div>

          {/* RESOURCE CARDS GRID */}
          {filteredResources.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-5">
              {filteredResources.map(res => {
                const isAddedToRoadmap = added?.has(res.id);

                return (
                  <GlassCard 
                    key={res.id} 
                    hover 
                    className="p-6 flex flex-col justify-between group border-white/5 transition-all duration-300 hover:border-cyan-500/30 hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Top Justification Banner */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                        {res.reason}
                      </div>

                      {/* Card Title & Provider */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                            {res.name}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                            <Briefcase size={12} className="text-slate-500" /> {res.provider}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/5 border border-white/10 text-slate-300 shrink-0">
                          {res.type}
                        </span>
                      </div>

                      {/* Details row: Level & Duration */}
                      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-1.5">
                          <BarChart size={13} className="text-slate-500" /> Level: <span className="text-white font-medium">{res.difficulty}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-600" />
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-500" /> Est: <span className="text-white font-medium">{res.duration}</span>
                        </div>
                      </div>

                      {/* Skills Covered Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {res.skills.map((skill, i) => {
                          const isGap = missingSkills.some(m => m.toLowerCase() === skill.toLowerCase());
                          return (
                            <span 
                              key={i} 
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                                isGap 
                                  ? "bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-sm" 
                                  : "bg-white/5 border-white/10 text-slate-300"
                              }`}
                            >
                              {skill} {isGap && "⚡"}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 gap-3">
                      <a 
                        href={res.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        View Course <ExternalLink size={13} />
                      </a>

                      <button 
                        onClick={async () => {
                          if (onAddToRoadmap) {
                            await onAddToRoadmap(res, "certification");
                          } else {
                            toggleAdded?.(res.id);
                          }
                        }} 
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                          isAddedToRoadmap 
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" 
                            : "bg-cyan-500 hover:bg-cyan-400 text-[#060911] border border-cyan-400"
                        }`}
                      >
                        {isAddedToRoadmap ? (
                          <><Check size={14} /> Added to roadmap ✓</>
                        ) : (
                          <><Plus size={14} /> Add to Roadmap</>
                        )}
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <Award size={44} className="mx-auto text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white">No recommendations match your query</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Try clearing your search term or adjusting your platform and level filters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: MY CERTIFICATIONS ────────────────────────────────────── */}
      {activeTab === "my-certs" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Completed Certifications</h2>
              <p className="text-xs text-slate-400">Official credentials and certificates you have earned.</p>
            </div>
            <button 
              onClick={() => { setMyCertToEdit(null); setCertFileName(""); setCertFileUrl(""); setMyCertModalOpen(true); }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-xs font-bold text-white hover:from-cyan-400 flex items-center gap-1.5 shadow-md"
            >
              <Plus size={14} /> Add Certification
            </button>
          </div>

          {student?.certificationsList?.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-5">
              {student.certificationsList.map(cert => (
                <GlassCard key={cert.id} className="p-5 flex flex-col justify-between group hover:border-cyan-500/30 transition-colors">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                          <Award size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white leading-tight">{cert.name}</h3>
                          <p className="text-xs text-cyan-300 font-medium mt-0.5">{cert.issuer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button 
                          onClick={() => { setMyCertToEdit(cert); setMyCertModalOpen(true); }} 
                          className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded-md hover:bg-white/10"
                        >
                          <Edit3 size={14}/>
                        </button>
                        <button 
                          onClick={() => { setDeleteTarget(cert); setDeleteModalOpen(true); }} 
                          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-md hover:bg-white/10"
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400 bg-white/5 p-3 rounded-lg border border-white/5">
                      {cert.issueDate && <div><span className="text-slate-500 mr-1">Issued:</span><span className="text-slate-200">{cert.issueDate}</span></div>}
                      {cert.credentialId && <div><span className="text-slate-500 mr-1">ID:</span><span className="text-slate-200">{cert.credentialId}</span></div>}
                    </div>

                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {cert.skills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Certificate Link / View File */}
                  {cert.credentialUrl && (
                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <a 
                        href={cert.credentialUrl.startsWith("http") || cert.credentialUrl.startsWith("data:") ? cert.credentialUrl : `https://${cert.credentialUrl}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1.5 font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        <FileText size={14} /> View Certificate File / Credential
                      </a>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard className="flex flex-col items-center justify-center py-16 text-center gap-3 border-dashed border-white/10">
              <ShieldCheck size={44} className="text-slate-600 mb-1" />
              <h3 className="text-sm font-bold text-white">No certifications added yet.</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Add your completed certifications to build your career profile.
              </p>
              <button
                onClick={() => { setMyCertToEdit(null); setMyCertModalOpen(true); }}
                className="mt-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#060911] rounded-xl font-bold text-xs transition-all shadow-md"
              >
                + Add Certification
              </button>
            </GlassCard>
          )}
        </div>
      )}

      {/* ── MODALS ────────────────────────────────────────────────────── */}

      {/* Add / Edit Certification Modal */}
      <ModalShell 
        open={myCertModalOpen} 
        title={myCertToEdit ? "Edit Certification" : "Add Certification"} 
        subtitle="Record a credential you've officially earned" 
        icon={Award} 
        onClose={() => setMyCertModalOpen(false)}
      >
        <form onSubmit={handleSaveMyCert} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Certification Name *</label>
              <input 
                name="name" 
                defaultValue={myCertToEdit?.name} 
                required 
                placeholder="e.g. AWS Certified Cloud Practitioner"
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Issuing Organization *</label>
              <input 
                name="issuer" 
                defaultValue={myCertToEdit?.issuer} 
                required 
                placeholder="e.g. Amazon Web Services / Coursera"
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Issue Date</label>
                <input 
                  name="issueDate" 
                  type="text" 
                  placeholder="e.g. March 2026" 
                  defaultValue={myCertToEdit?.issueDate} 
                  className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Credential ID (optional)</label>
                <input 
                  name="credentialId" 
                  defaultValue={myCertToEdit?.credentialId} 
                  placeholder="e.g. AWS-123456"
                  className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Certificate File (PDF, PNG, JPG/JPEG) *</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-xs font-bold text-cyan-300 cursor-pointer transition-colors">
                  <UploadCloud size={16} /> Upload Certificate
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleCertFileChange} className="hidden" />
                </label>
                {certFileName ? (
                  <span className="text-xs text-emerald-400 font-medium truncate max-w-[200px]">
                    ✓ {certFileName}
                  </span>
                ) : myCertToEdit?.fileName ? (
                  <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
                    {myCertToEdit.fileName}
                  </span>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Credential / Verification URL (optional)</label>
              <input 
                name="credentialUrl" 
                defaultValue={myCertToEdit?.credentialUrl} 
                placeholder="https://" 
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Skills Covered (comma separated)</label>
              <input 
                name="skills" 
                defaultValue={myCertToEdit?.skills?.join(", ")} 
                placeholder="e.g. React, Node.js, SQL" 
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" 
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={() => setMyCertModalOpen(false)} 
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#060911] bg-cyan-500 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              Save Certification
            </button>
          </div>
        </form>
      </ModalShell>

      {/* Delete Confirmation Modal */}
      <ModalShell 
        open={deleteModalOpen} 
        title="Delete Certification" 
        icon={Trash2} 
        onClose={() => setDeleteModalOpen(false)}
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-300">
            Are you sure you want to remove <span className="font-bold text-white">"{deleteTarget?.name}"</span> from your profile? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setDeleteModalOpen(false)} 
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteMyCert} 
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 transition-colors shadow-lg shadow-rose-500/10"
            >
              Delete
            </button>
          </div>
        </div>
      </ModalShell>

    </div>
  );
}

export default CertificationsView;
