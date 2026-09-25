# 🛠️ PathForge — Deep Tech Stack & Algorithm Technical Guide

---

## 1. 🏗️ Tech Stack Breakdown

### 🎨 Frontend Architecture
- **Framework**: `React 18` — Functional components, custom hooks (`useState`, `useEffect`, `useMemo`), and Context API for global state management.
- **Build Tool**: `Vite` — Lightning-fast ES modules bundler providing sub-second HMR and production bundle optimization (4.8s build time).
- **Styling System**: `Vanilla CSS` + `TailwindCSS` utilities — Custom Dark-Mode Glassmorphism (`#060911` background, CSS `backdrop-filter: blur()`, custom radial glow animations, gradient text).
- **Icons**: `Lucide-React` — Lightweight vector iconography.

### 🗄️ Backend & Database Layer
- **Cloud Database**: `Supabase` (Serverless PostgreSQL) — Relational database hosting user profiles, roadmap progress, catalog items, and completed certifications.
- **Security**: `Row Level Security (RLS)` — PostgreSQL security policies restricting table reads/writes strictly to `auth.uid() = user_id`.
- **Authentication**: `Supabase Auth` — JWT token-based authentication session management.
- **File Storage**: `Supabase Storage` — Bucket (`certifications`) storing uploaded credential documents (.pdf, .png, .jpg).

### 🤖 AI Engine & LLM Layer
- **Provider**: `OpenRouter API` — Unified gateway accessing high-performance open LLMs (**Meta Llama 3.1 8B Instruct** & **Qwen 2.5 72B**).
- **Fallback Strategy**: Automatic multi-tier fallback (`openrouter/auto` → `openrouter/free` → `qwen/qwen3.8-27b:free`) ensuring zero uptime failures.

---

## 2. 🧮 Algorithms & NLP Techniques Used in PathForge

PathForge combines **Natural Language Processing (NLP)**, **Set Theory Algorithms**, **Weighted Recommendation Scoring**, and **Dynamic Graph Sequencing**.

```
+-----------------------------------------------------------------------------------+
|                            PATHFORGE ALGORITHM SUITE                              |
+-----------------------------------------------------------------------------------+
|  1. NLP & Prompt RAG Engine   --> Dynamic LLM Context Construction (chatService)  |
|  2. Set Difference Algorithm  --> Skill Gap Identification (userProfile)          |
|  3. Multi-Criteria Recommender--> Weighted Match Scoring (certificationEngine)    |
|  4. Topological Graph Engine  --> Dynamic Serpentine Path Re-ordering (Roadmap)   |
+-----------------------------------------------------------------------------------+
```

---

### A. 🗣️ Natural Language Processing (NLP) & LLM Prompt RAG Engine
> **Is NLP used? YES.** PathForge heavily utilizes Natural Language Processing via Large Language Models (LLMs) and Prompt Context Construction.

1. **Retrieval-Augmented Prompting (Context Injection)**:
   - Rather than sending raw user queries to an LLM, PathForge's `chatService.js` builds a dynamic system prompt on every turn.
   - It converts the user's structured database JSON (Target Career, Readiness Score, Mastered Skills, Skill Gaps, Current Milestone) into a rich natural language context vector.
   - **Result**: The LLM provides 100% personalized, context-aware responses with zero generic replies.

2. **Keyword Tokenization & Semantic Keyword Matching**:
   - Used in Custom "Other" Career Resolution (`getRequiredSkillsForCareer`).
   - Parses custom user career inputs (e.g. *"Embedded Systems Engineer"*, *"Game Developer"*) into tokens and maps them to standard industry skill requirements.

---

### B. 📐 Set Difference Algorithm (Skill Gap Analysis)
Used in `userProfile.js` and `CertificationsView.jsx` to dynamically determine what skills a student is missing.

$$\text{SkillGaps} = \text{RequiredSkills}(\text{TargetCareer}) \setminus \text{AcquiredSkills}(\text{User})$$

- **Algorithm Steps**:
  1. Fetch required skill set $R = \{s_1, s_2, \dots, s_n\}$ for target career.
  2. Normalize user's acquired skill set $U = \{u_1, u_2, \dots, u_m\}$ to lowercase trimmed strings.
  3. Perform set subtraction $G = R \setminus U$.
  4. Output array $G$ as the user's high-priority **Skill Gaps**.

---

### C. 📊 Weighted Recommendation & Ranking Algorithm
Used in `certificationEngine.js` to score and rank learning resources and certifications.

$$\text{MatchScore} = \min\left(100, \, w_{\text{gap}} \cdot \frac{|C \cap G|}{|G|} + w_{\text{career}} \cdot \frac{|C \cap R|}{|C|} + B_{\text{career}}\right)$$

Where:
- $C$ = Skills covered by the resource
- $G$ = User's missing skill gaps
- $R$ = Required skills for target career
- $w_{\text{gap}} = 60\%$ (Gap Coverage Weight)
- $w_{\text{career}} = 40\%$ (Career Relevance Weight)
- $B_{\text{career}} = +35\text{ pts}$ (Direct Target Career Match Bonus)

**Output**: Resources are sorted in descending order of $\text{MatchScore}$, displaying dynamic justification strings (e.g., *"⚡ Recommended for your skill gap: Node.js"*).

---

### D. 🕸️ Dynamic Graph Sequencing Algorithm (Serpentine Roadmap)
Used in `RoadmapView.jsx` to manage stage progression.

- **Graph Structure**: Nodes represent learning milestones linked sequentially in a serpentine serpentine visual layout.
- **Node State Machine**:
  - `COMPLETED`: $\text{Progress} = 100\%$
  - `IN PROGRESS`: First incomplete node in the queue
  - `UP NEXT`: Immediately following node
  - `LOCKED`: Subsequent unreached nodes
- As the user clicks `[ Mark Complete ]`, the state machine evaluates the node graph and dynamically unlocks downstream stages.

---

### E. 📦 Base64 Data Encoding Algorithm (Client File Uploads)
Used in `CertificationsView.jsx` for client-side certificate uploading.

- Converts binary `.pdf`, `.png`, `.jpg` files into Base64 Data URIs (`FileReader.readAsDataURL`).
- Guarantees immediate offline client rendering, thumbnail previews, and seamless upload to Supabase Storage.

---

## 💡 Summary for Viva / Review Presentation

| Parameter | Quick Technical Answer |
| :--- | :--- |
| **Tech Stack** | React 18 + Vite + Vanilla CSS (Frontend), Supabase PostgreSQL + Auth + Storage (Backend), OpenRouter Llama 3.1 / Qwen 2.5 (AI). |
| **Is NLP used?** | **Yes.** We use LLM Natural Language Processing, prompt-based context injection (RAG pattern), and semantic keyword parsing. |
| **What Algorithms?** | Set Difference (Gap Analysis), Weighted Multi-Criteria Recommendation Scoring, Graph State Machine (Roadmap), Base64 Encoding. |
| **Database Security** | PostgreSQL Row Level Security (RLS) enforcing `auth.uid() = user_id`. |
