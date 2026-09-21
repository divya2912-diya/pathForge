#  PathForge
Demo Link : https://path-forge-azure.vercel.app

> **AI-Powered Education-to-Employment Platform for Students**  
> *Discover what you know, master what you're missing, and forge your path to career readiness.*

[![Deploy to GitHub Pages](https://github.com/divya2912-diya/pathForge/actions/workflows/deploy.yml/badge.svg)](https://github.com/divya2912-diya/pathForge/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1.6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![User Role](https://img.shields.io/badge/Role-Single%20User%20(Student)-orange.svg)]()

---

## 📖 Overview

**PathForge** is an intelligent, high-aesthetic learning ecosystem specifically tailored for university students and aspiring software engineers. Higher education often leaves critical gaps between academic theory and industry engineering expectations. 

PathForge bridges this gap with:
- **Continuous Skill Gap Analysis**: Dynamically compares your current knowledge against actual industry role requirements.
- **Adaptive AI Roadmaps**: Milestone-by-milestone personalized learning journeys that adapt based on quiz performances and completed projects.
- **Integrated Career Readiness**: Direct mapping to target job profiles, portfolio projects, ATS resume scoring, and live AI mentorship.
- **Single-Role Student Experience**: Focused, distraction-free environment centered entirely on student growth and employability.

---

##  Key Features

### 1. Seamless Access & Dual Login
- **Demo / Judge Instant Access**: One-click **"Enter pathForge"** demo login enabling hackathon evaluators and mentors to inspect the full platform immediately without credential barriers.
- **Student Authentication**: Streamlined student login with smart input dynamics (icons gracefully yield space when credentials are typed), credential validation, and device retention.

###  2. Personalized AI Learning Roadmap (`RoadmapView`)
- Visual progression through core foundational milestones, advanced frameworks, and architecture patterns.
- Interactive status rings (Completed, In Progress, Next Up, Locked).
- Detailed curriculum breakdown with estimated completion timelines, video modules, and practice sandboxes.

###  3. Intelligent Analytics Dashboard (`DashboardView`)
- **Career Readiness Index**: Live percentage gauge tracking overall preparedness for your dream role.
- **Skill Radar Matrix**: Multi-axis radar chart powered by **Recharts** displaying frontend, backend, system architecture, DevOps, and cloud proficiencies.
- **Weekly Momentum & Goals**: Interactive tracking of weekly study streaks, hours spent, and concepts mastered.

###  4. Real-time Skill Matrix & Gap Analysis (`SkillsView`)
- Granular breakdown of individual competencies (e.g., React, TypeScript, Node.js, Docker, System Design).
- Visual gap identification tags highlighting the highest-ROI skills needed to reach target hireability.
- One-click links to immediate remedial learning materials.

###  5. Adaptive Technical Assessments (`AssessmentView`)
- Interactive technical quizzes with time tracking, question progression, and instant answer evaluations.
- Real-time roadmap calibration based on assessment results.

###  6. Career Readiness & Target Roles (`CareerView`)
- Target role matching algorithm (e.g., Full Stack Engineer, Cloud Architect, AI Systems Engineer).
- Side-by-side comparison of required skills versus your acquired skills.
- Industry salary benchmarks, demand trends, and direct job match indicators.

###  7. Hands-on Portfolio Projects (`ProjectsView`)
- Industry-aligned engineering projects ranging from Beginner to Advanced.
- Includes technology badges, system architecture challenges, GitHub template links, and verifiable evaluation rubrics.

###  8. ATS Resume Builder & Analyzer (`ResumeView`)
- Comprehensive ATS compatibility scoring.
- Keyword matching against job descriptions to optimize resume keyword density.
- Actionable recommendations for section formatting, impact statements, and metric quantification.

###  9. Verifiable Micro-Credentials (`CertificationsView`)
- Achievement badges earned upon mastering modules and passing technical assessments.
- Shareable digital credentials that showcase verified competency to recruiters.

###  10. Student Profile & Customization (`ProfileView`)
- Fully customizable student profile featuring instant photo uploads, university details, degree, graduation year, and career aspirations.
- Modal-based editing with real-time UI state synchronization.

###  11. PathForge AI Assistant (`AIAssistant`)
- Slide-out AI mentor available from any screen.
- Answers complex technical questions, breaks down system design concepts, and suggests next learning steps.

---

##  Design System & Aesthetics

PathForge is built using a modern design language designed for maximum visual appeal:
- **Deep Void Background**: Ultra-sleek `#060911` dark surface minimizing eye strain.
- **Luminous Gradients**: Electric Cyan (`#22d3ee`), Deep Blue (`#3b82f6`), Violet Glow (`#8b5cf6`), and Ember Flame (`#f97316`).
- **Glassmorphism**: Layered backdrop blur (`backdrop-filter: blur(14px)`) with subtle hairline translucent borders (`rgba(255,255,255,0.08)`).
- **Micro-Interactions**: Hover lift effects, smooth badge pulsing, rotating icon states, and responsive transitions.
- **Typography**: Clean hierarchy combining **Outfit** (display & headings) and **Inter** (interface & body text).

---

##  Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 18](https://react.dev/) (Functional Components, Hooks, State Management) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) (Lightning-fast HMR and optimized asset bundling) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + Custom CSS Design System (`src/index.css`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Visualizations** | [Recharts](https://recharts.org/) (Responsive Radar & Analytics Charts) |
| **Deployment** | GitHub Pages with automated [GitHub Actions CI/CD](.github/workflows/deploy.yml) |

---

## Repository Structure

```text
pathForge/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated CI/CD pipeline for GitHub Pages
├── public/
│   └── _redirects                # SPA redirect rules for static hosting
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── HamburgerButton.jsx   # Mobile navigation toggle
│   │   │   ├── HomeButton.jsx        # Persistent header navigation
│   │   │   ├── NavDrawer.jsx         # Slide-out navigation menu
│   │   │   └── TopBar.jsx            # Dynamic top navigation header
│   │   ├── ui/
│   │   │   ├── AnimatedCounter.jsx   # Smooth metric counting animation
│   │   │   ├── FloatingCard.jsx      # Interactive hovering UI card
│   │   │   ├── GlassCard.jsx         # Base frosted glass container
│   │   │   ├── Pill.jsx              # Status & category tag pills
│   │   │   ├── ProgressBar.jsx       # Linear animated progress indicator
│   │   │   ├── ProgressRing.jsx      # Circular SVG progress gauge
│   │   │   ├── SectionHeader.jsx     # Standardized view header
│   │   │   ├── StatusDot.jsx         # Live indicator dot
│   │   │   └── Toast.jsx             # Notification toasts
│   │   ├── views/
│   │   │   ├── AnalyzingScreen.jsx   # AI path calculation animation screen
│   │   │   ├── AssessmentView.jsx    # Interactive quizzes & evaluations
│   │   │   ├── CareerView.jsx        # Career role matching & salary trends
│   │   │   ├── CertificationsView.jsx# Earned badges and credentials
│   │   │   ├── DashboardView.jsx     # Main student control center & radar
│   │   │   ├── LandingPage.jsx       # Hero landing page
│   │   │   ├── LoginView.jsx         # Dual authentication portal (Demo/Student)
│   │   │   ├── OnboardingFlow.jsx    # Interactive student onboarding wizard
│   │   │   ├── ProfileView.jsx       # Student profile & avatar editor
│   │   │   ├── ProjectsView.jsx      # Hands-on engineering portfolio projects
│   │   │   ├── ResourcesView.jsx     # Curated learning materials & articles
│   │   │   ├── ResumeView.jsx        # ATS resume builder & score analyzer
│   │   │   ├── RoadmapView.jsx       # Interactive AI curriculum timeline
│   │   │   ├── SettingsView.jsx      # Student preferences & app configuration
│   │   │   └── SkillsView.jsx        # Granular skill tree & gap matrix
│   │   └── AIAssistant.jsx           # Slide-out AI mentor assistant
│   ├── data/
│   │   └── mockData.js               # Mock data for student profile, roadmaps & skills
│   ├── App.jsx                       # Main application router & stage controller
│   ├── index.css                     # Design tokens, variables & glassmorphism classes
│   └── main.jsx                      # React application entry point
├── index.html                        # HTML5 root template
├── package.json                      # Project dependencies and npm scripts
├── tailwind.config.js                # Tailwind CSS theme extension
├── vite.config.js                    # Vite configuration with relative base path
├── vercel.json                       # Vercel deployment configuration
```

---

##  Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version **18.x** or higher recommended)
- [npm](https://www.npmjs.com/) (version **9.x** or higher) or `yarn` / `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/divya2912-diya/pathForge.git
   cd pathForge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The compiled static assets will be output to the `dist/` directory.

5. **Preview the production build locally**:
   ```bash
   npm run preview
   ```

---

##  Deployment

The project is pre-configured for seamless static deployment to any modern hosting provider:

- **GitHub Pages**: Automatically deployed via the included `.github/workflows/deploy.yml` on every push to `main`.
- **Vercel**: Includes `vercel.json` for single-page application routing.
---

##  Contributing

Contributions are warmly welcome! If you'd like to improve PathForge:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m "feat: add AmazingFeature"`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

##  License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Crafted for students forging their future in tech.</sub>
</div>
