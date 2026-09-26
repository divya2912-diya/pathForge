# PATHFORGE — PERSONALIZED LEARNING & CAREER INTELLIGENCE PLATFORM
## Project Overview, Technology Stack & Implementation Report for Review 2

---

### Executive Summary
**PathForge** is an AI-powered, adaptive learning and career intelligence platform built under the **Smart Education** theme. PathForge bridges the gap between university coursework and job readiness by treating learning as a dynamic, non-linear progression. Instead of forcing learners through rigid, static curricula, PathForge continuously analyzes each student's current competencies, uploaded resume, assessment performance, and target career goals to deliver a **10-stage personalized learning and career roadmap**.

---

## 1. Page-Wise Architectural Overview

PathForge features **12 primary functional views**, organized into a clear, scalable Information Architecture:

| Page / View | Route Key | Core Functionality & Purpose |
| :--- | :--- | :--- |
| **🏠 Landing Page** | `landing` / `home` | Modern showcase introducing PathForge's 10-stage career readiness journey, live job ticker, trusted AI architecture, and platform overview modal. |
| **📊 Dashboard** | `dashboard` | Command center displaying overall career readiness score (%), active learning streak, topic completion progress, AI mentor quick prompts, and dynamic milestone actions. |
| **🎯 Skill Gap Analysis** | `skills` | Interactive visual comparison between target role requirements (e.g., Software Engineer, Data Scientist) and current mastered skills, highlighting high-priority missing technical gaps. |
| **🗺️ Learning Roadmap** | `roadmap` | Interactive SVG node graph mapping step-by-step milestones (Foundation, Specialization, Capstone, Technical Screening). Supports offline caching, custom additions, and glowing milestone pulses. |
| **📚 Learning Resources** | `resources` | Filterable library of curated courses, documentation, practice problems, and video lectures. Features **[ Add to Roadmap ]** with DB insertion and location breakdown hierarchy. |
| **🧪 Knowledge Assessment** | `assessment` | Real-time adaptive quiz engine testing topic understanding with dynamic difficulty scaling, timed questions, and performance scoring. |
| **🛡️ Skill Validation System** | `assessment` / `roadmap` | 2-Round validation mechanism (Diagnostic Quiz + Coding Challenge) allowing students with prior knowledge to prove proficiency and unlock roadmap nodes without redundant study. |
| **📂 Portfolio Projects** | `projects` | Smart recommendation engine ranking real-world projects by domain relevance and student skill level. Includes project details, tech stacks, and roadmap insertion. |
| **📜 Certifications Catalog** | `certifications` | Database of industry-recognized certifications (AWS, Google, Meta, Coursera) matched to target role skill gaps with verified course links and roadmap addition options. |
| **🚀 AI Career Intelligence** | `career` | AI career analysis tool allowing dynamic career switching (e.g., switching goal from Frontend Dev to Data Scientist) with real-time recalculation of match percentage and action plans. |
| **📄 Resume Intelligence** | `resume` | Full ATS resume analyzer supporting PDF/DOCX file uploads. Extracts skills, projects, and work experience, identifies missing gap competencies, and auto-populates the student profile. |
| **💼 Job Opportunities** | `jobs` | Real-world job opening engine displaying active software engineering positions matched against student readiness score with direct application links. |
| **👤 Profile & Skills** | `profile` | Single Source of Truth managing personal academic info, mastered skills, verified certificates, portfolio projects, and manual skill self-declarations. |
| **⚙️ Settings & Multilingual** | `settings` | Authenticated settings management (notification toggles, learning pace selection, password updates via Supabase Auth) and dynamic **6-Language Multilingual Switcher**. |

---

## 2. Technology Stack & Technical Architecture

### Frontend Architecture
- **Core Library:** React 18 (Vite build system for instant HMR and lightweight bundle size).
- **Styling System:** Vanilla CSS Tokens + Tailwind Utility Classes + Custom Glassmorphic CSS Design System (`lp-glass`, `lp-glass-strong`, HSL color scales, dynamic noise textures, ambient radial glows).
- **Iconography & UI Components:** `lucide-react` icons, custom SVG node diagrams, interactive carousels, and accessible modal overlays.
- **Data Visualization:** `recharts` for dynamic skill radar charts, mastery breakdown bars, and learning trend area graphs.

### Database & Authentication
- **Backend-as-a-Service:** Supabase PostgreSQL Database.
- **User Authentication:** Supabase Auth (JWT sessions, persistent login, secure password update API via `supabase.auth.updateUser`).
- **Data Persistence Services:**
  - `user_profiles` table for storing student profiles, target careers, mastered skills, and preferred languages.
  - `milestone_progress` table for storing topic completion flags, assessment validation timestamps, and custom roadmap node additions.

### AI & Analysis Engine
- **Client-Side PDF Parsing:** `pdfjs-dist` engine extracting full raw text from uploaded PDF/DOCX resume files directly in the browser.
- **Adaptive Resume Scanner:** Rule-based NLP and pattern-matching pipeline ([`resumeAnalysisEngine.js`](file:///e:/pathforge/pathForge-main/src/utils/resumeAnalysisEngine.js)) classifying candidates into Level 1 (Beginner/Student), Level 2 (Intermediate/Junior Dev), or Level 3 (Advanced/Senior Candidate), mapping demonstrated skills against target role requirements.
- **Explainable AI Mentor:** Context-aware academic assistant ([`userContextService.js`](file:///e:/pathforge/pathForge-main/src/services/userContextService.js)) injecting live student state (skills, gaps, score) into prompt structures to provide deterministic advice without hallucinated claims.

### Offline & Internationalization (i18n)
- **Offline Storage & Caching:** `localforage` IndexedDB local storage engine powering offline roadmap viewing, offline progress queuing, and automatic background sync (`syncOfflineQueue`) when network connectivity restores.
- **Internationalization System:** Custom lightweight i18n service ([`i18nService.js`](file:///e:/pathforge/pathForge-main/src/services/i18nService.js)) supporting **6 Languages**:
  1. 🇬🇧 English (`en`)
  2. 🇮🇳 Telugu (`te`)
  3. 🇮🇳 Hindi (`hi`)
  4. 🇪🇸 Spanish (`es`)
  5. 🇫🇷 French (`fr`)
  6. 🇩🇪 German (`de`)
- **Language Selector:** Custom `LanguageSelector` dropdown with high elevation (`z-[999]`), auto-positioning (`direction="down" | "up"`), national flag badges, and real-time state reactivity.

---

## 3. Detailed Implementations against Requirements

### Online Round Requirements

#### Requirement 1: Previous Learning Recognition & Continue Existing Learning
- **Implementation:**
  - During onboarding or via Resume Intelligence, students disclose existing skills or upload prior resumes.
  - Demonstrated skills are flagged in the Single Source of Truth as `already_demonstrated`.
  - In [`RoadmapView.jsx`](file:///e:/pathforge/pathForge-main/src/components/views/RoadmapView.jsx), mastered skills are marked with a green checkmark and skipped in the study queue, allowing students to resume learning at their true competency level without restarting.

#### Requirement 2: Personalized Learning Roadmap
- **Implementation:**
  - The platform dynamically constructs an interactive step-by-step roadmap tailored to the selected career path (e.g., Software Engineer, Full Stack Developer, Data Scientist).
  - Milestone stages include **Foundation** → **Specialization** → **Capstone Projects** → **Interview Prep** → **Career Readiness**.
  - Includes daily/weekly study pace controls (Relaxed ~3 hrs/wk, Balanced ~6 hrs/wk, Intensive ~10+ hrs/wk) persisted in Supabase.

#### Requirement 3: Intelligent Learning Resource Recommendation
- **Implementation:**
  - Curated resources in [`ResourcesView.jsx`](file:///e:/pathforge/pathForge-main/src/components/views/ResourcesView.jsx) are filtered and tagged by type (Course, Documentation, Practice Problems, Books) and domain.
  - Features an **End-to-End [ Add to Roadmap ] System**:
    1. Executes actual Supabase database insertion under `milestone_progress`.
    2. Prevents duplicates (`"Already added to your roadmap."`).
    3. Opens a confirmation modal displaying the exact hierarchy location breakdown (`Career Goal → ... | Roadmap → ... | Stage → ... | Topic → ...`).
    4. Includes a `[ View Roadmap ]` button that navigates directly to the roadmap and highlights the newly added node with a glowing pulse animation and `"YOU ARE HERE ✨"` badge.

#### Requirement 4: Resume Analyzer & Gap Recommendation
- **Implementation:**
  - [`ResumeView.jsx`](file:///e:/pathforge/pathForge-main/src/components/views/ResumeView.jsx) lets students upload real PDF/DOCX resumes.
  - Extracts text and categorizes evidence across Education, Technical Skills, Frameworks, Tools, Projects, Experience, and Certifications.
  - Compares extracted skills against target career requirements to compute an **ATS Compatibility Score**, profile level, and explicit missing skill list.
  - Auto-suggests specific projects and courses to close identified gaps and updates student profile readiness in real time.

#### Requirement 5: Project Recommendation Engine
- **Implementation:**
  - [`ProjectsView.jsx`](file:///e:/pathforge/pathForge-main/src/components/views/ProjectsView.jsx) ranks catalog projects dynamically using `rankProjects()`.
  - Recommendations are prioritized based on student skill gaps (e.g., recommending a Docker microservice project if Docker is a missing gap for Backend Developer).
  - Includes difficulty filters (Beginner, Intermediate, Advanced) and direct **[ Add to Roadmap ]** integration.

#### Requirement 6: Adaptive Assessment & Knowledge Validation
- **Implementation:**
  - Integrated **2-Round Skill Validation System**:
    - **Round 1:** Concept Diagnostic Quiz (tests fundamental theory and syntax).
    - **Round 2:** Practical Challenge / Problem Solving.
  - Accessible directly from roadmap nodes via a **[ Validate My Skill ]** button.
  - Passing both rounds officially marks the skill as `VALIDATED`, unlocks downstream locked roadmap nodes, and records `skill_<name>_validated = 1` in Supabase PostgreSQL.

---

### Offline Round Requirements

#### Requirement 7: Academic & Career Intelligence Assistant (AI Mentor)
- **Implementation:**
  - Context-aware AI assistant integrated across Dashboard, CareerView, and top navigation.
  - Built with `buildUserLearningContext()`, providing explainable career guidance grounded in the user's live profile data (current skills, readiness %, gaps).
  - Supports dynamic career goal switching from [`CareerView.jsx`](file:///e:/pathforge/pathForge-main/src/components/views/CareerView.jsx), recalculating match percentages and placement action plans instantly.

#### Requirement 8: Progress Tracking & Learning Analytics
- **Implementation:**
  - [`LearningAnalyticsView.jsx`](file:///e:/pathforge/pathForge-main/src/components/views/LearningAnalyticsView.jsx) monitors key metrics:
    - **Career Readiness Score (%)**
    - **Active Study Streaks & Weekly Learning Days**
    - **Topic Completion Rates**
    - **Assessment Performance & Scores**
  - Includes radar chart skill distribution visualizers (`recharts`) and educator/student analytics mode.

#### Requirement 9: Offline Learning & Multilingual Support
- **Implementation:**
  - **Offline Functionality:** Uses `localforage` (IndexedDB) to cache accessed roadmap nodes and study resources. When offline, user progress is saved locally and queued. Reconnecting triggers `syncOfflineQueue()`, automatically uploading offline updates to Supabase.
  - **Multilingual Support:** Complete internationalization system (`i18nService.js`) with dynamic translation across all 12 views. Supported languages: English, Telugu, Hindi, Spanish, French, and German.

#### Requirement 10: Learning Style Adaptation
- **Implementation:**
  - Tracks user content interactions using the VARK model (Visual, Auditory, Reading/Writing, Kinesthetic).
  - Automatically adapts resource ordering (e.g., prioritizing video lectures for visual learners, documentation for reading learners, or interactive quizzes for kinesthetic learners).

---

## 4. Summary of Recent Developments & Production Fixes

1. **End-to-End Roadmap Addition Pipeline:** Created `roadmapAdditionService.js` and `RoadmapAdditionToastModal.jsx` for persistent database insertions, location hierarchy breakdown, duplicate prevention, and pulsing glowing highlight animations on newly added roadmap nodes.
2. **Settings Page Cleanup:** Removed all fake toggles and placeholder controls. Retained only authenticated Supabase settings (profile management, 6-language switcher, notification preferences, learning pace, password change API, logout).
3. **Explore Platform & Landing Page Update:** Updated the platform modal and landing page to showcase all 12 live capabilities with zero dead buttons, alongside an interactive 10-stage career readiness workflow diagram.
4. **Multilingual Component Optimization:** Enhanced `LanguageSelector.jsx` with downward positioning, high z-index overlay (`z-[999]`), flag rendering for all 6 languages, and seamless component translation binding across all pages.

---
*Report generated for PathForge Review 2.*
