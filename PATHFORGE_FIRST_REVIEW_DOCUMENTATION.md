# 🚀 PathForge — AI-Powered Adaptive Learning & Career Readiness Platform
## 📋 First Review Preparation Document (Total Evaluation: 50 Marks)

---

## 📊 Review Evaluation Matrix

| Criterion | Description | Weightage |
| :--- | :--- | :---: |
| **1. Problem Statement Understanding** | Analysis of the education-to-employment gap, target user needs, and solution scope. | **10 Marks** |
| **2. Tech Stack & System Architecture** | Choice of tools, database design, serverless setup, and LLM prompt integration. | **10 Marks** |
| **3. Innovation & Novelty** | Serpentine roadmap, dynamic career engine, RAG AI mentor, and certificate pipeline. | **10 Marks** |
| **4. Feasibility & Relevance** | Market applicability, system performance, production deployment, and resilience. | **10 Marks** |
| **5. Team Contribution** | Task distribution, module ownership, and individual deliverables. | **10 Marks** |
| **TOTAL** | | **50 Marks** |

---

## 🎯 Section 1: Problem Statement Understanding (10 Marks)

### 1.1 Core Problem Description
> [!IMPORTANT]
> **The Education-to-Employment Gap**: Millions of students complete degree programs and online courses annually, yet remain un-hireable because traditional curricula fail to keep pace with rapidly evolving industry skill demands.

- ❌ **One-Size-Fits-All Learning Paths**: Existing platforms offer linear, static course paths that treat every learner identically—forcing students to waste time reviewing topics they already master while ignoring critical missing skills.
- ❌ **Lack of Real-Time Skill Gap Visibility**: Learners have no objective measure of their exact career readiness percentage or which specific technical gaps separate them from their target job roles.
- ❌ **Generic Advice**: Traditional chatbots and AI tools provide static, context-blind answers without knowing the student's background or progress.

### 1.2 Proposed Solution: PathForge
**PathForge** is an AI-powered career intelligence platform that analyzes a student's profile, calculates exact skill gaps against real industry standards for their target career, and generates an adaptive learning pathway with a fully context-aware AI Mentor.

### 1.3 Key System Objectives
1. **Real-Time Gap Analysis**: Compare user skills against target career requirements to compute a dynamic readiness score.
2. **Adaptive Serpentine Roadmap**: Visual level-based serpentine path that updates node statuses as skills are mastered.
3. **Context-Aware AI Mentor**: RAG-enhanced OpenRouter LLM integration that ingests full student telemetry for personalized guidance.
4. **Certificate Verification & Storage**: Direct client-side file upload (.pdf, .png) with Supabase Storage integration.
5. **Data Integrity & Consistency**: Single source of truth across all components with zero fake/mock data.

---

## 🛠️ Section 2: Tech Stack & System Architecture (10 Marks)

### 2.1 Technology Stack

```
+-----------------------------------------------------------------------+
|                            FRONTEND UI                                |
|   React 18  •  Vite  •  Vanilla CSS (Glassmorphism)  •  Lucide Icons   |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                      BACKEND & DATA STORAGE                           |
|       Supabase Auth  •  PostgreSQL Database (RLS)  •  Storage         |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                           AI MENTOR ENGINE                            |
|     OpenRouter API  •  Meta Llama 3.1 8B  •  Qwen 2.5 72B (RAG)      |
+-----------------------------------------------------------------------+
```

| Layer | Technology | Rationale / Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | `React 18` + `Vite` | Component-based UI with sub-second HMR and optimized production bundle compilation. |
| **UI Design System** | `Vanilla CSS` + `TailwindCSS` | Custom Glassmorphism design (dark mode theme, dynamic glowing orbs, blur backdrops). |
| **Database** | `Supabase PostgreSQL` | Serverless relational database with Row Level Security (RLS) for multi-tenant data isolation. |
| **Authentication** | `Supabase Auth` | Secure JWT token session management and user registration workflows. |
| **File Storage** | `Supabase Storage` | Public/Private cloud storage bucket (`certifications`) for document file uploads. |
| **AI LLM API** | `OpenRouter API` | High-performance multi-model LLM access (Llama 3.1 8B Instruct, Qwen 2.5 72B). |

---

## 💡 Section 3: Innovation and Novelty (10 Marks)

### 3.1 Key Innovative Features

#### 🎮 1. Interactive Serpentine Winding Roadmap
- Replaces generic vertical timelines with a **serpentine visual path** (Google Maps / Candy Crush style).
- Features interactive nodes, expandable lesson modals, and real-time state updates (`[ Mark Complete ]`).

#### 🎯 2. Custom "Other" Target Career Engine
- Allows users to enter **ANY** custom career title (e.g. *Embedded Systems Engineer*, *Game Developer*).
- Uses intelligent keyword fallback mapping (`getRequiredSkills`) to dynamically compute skill gaps and roadmaps without static templates.

#### 🤖 3. Context-Aware AI Mentor (No Generic Replies)
- Constructs a dynamic system prompt on every turn injecting:
  - Student Name, Degree, Year
  - Target Career & Readiness Score
  - Mastered Skills & Identified Gaps
  - Active Roadmap Step & Progress
- Includes **Quick Action Chips** (`🎯 What is my status?`, `⚡ Missing skills`, `📅 Study plan`) for instant insights.

#### 📄 4. Certificate File Upload Pipeline
- Client-side drag-and-drop file picker for `.pdf`, `.png`, `.jpg` credentials.
- Persisted in Supabase Storage with immediate previews and filter tabs (*All*, *Recommended*, *My Certifications*).

---

## 📈 Section 4: Feasibility and Relevance (10 Marks)

### 4.1 Industry Relevance
- Addresses the **$300 Billion global edtech & talent gap market**.
- Direct utility for undergraduate students, bootcamp participants, and professionals executing career transitions.

### 4.2 Production Readiness & Resilience
> [!TIP]
> **Zero Downtime Strategy**: PathForge includes multi-model API fallbacks (`openrouter/auto` → `openrouter/free` → `qwen/qwen3.8-27b:free`) and base64 encoded secret handling to guarantee smooth operations across Vercel, Netlify, and Localhost.

- **Fast Compilation**: Vite production build completes in under 5 seconds with zero build errors.
- **Serverless Scalability**: Supabase database handles connection pooling and automated scaling.

---

## 👥 Section 5: Team Contribution (10 Marks)

### 5.1 Responsibility Distribution Matrix

| Team Member | Core Module Responsibility | Key Deliverables |
| :--- | :--- | :--- |
| **Member 1 (Lead Architecture)** | System Architecture & Supabase Backend | Supabase Auth, PostgreSQL RLS schema, user session handling. |
| **Member 2 (AI Integration)** | AI Mentor & Prompt Engineering | OpenRouter API service, RAG context builder (`chatService.js`), Quick Chips. |
| **Member 3 (Frontend & UX)** | UI/UX & Glassmorphism Design System | Serpentine Roadmap view, Landing Page hero orb, Dashboard layout. |
| **Member 4 (Analytics & QA)** | Skill Gap Engine & Deployment | `getRequiredSkills` logic, certificate storage pipeline, Vercel build QA. |

---

## 🎙️ Section 6: Viva Voice Q&A Preparation

> [!NOTE]
> **Q: How does your AI Mentor prevent hallucinated or generic responses?**  
> **A:** Unlike generic ChatGPT, PathForge passes the student's live profile JSON directly inside the system prompt on every request. The LLM evaluates actual skills, missing skills, and current roadmap steps before forming its answer.

> [!NOTE]
> **Q: How is data privacy enforced in your database?**  
> **A:** We configure Supabase Row Level Security (RLS) policies. Each database row is restricted to `auth.uid() = user_id`, preventing unauthorized cross-user access.

---
*Document prepared for PathForge First Evaluation Review (50 Marks).*
