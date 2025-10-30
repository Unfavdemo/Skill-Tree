SkillTree — Gamified Career Learning Platform

SkillTree is a front‑end learning platform built with React and Vite that helps users explore career paths, upload resumes, and develop practical skills through AI‑generated, gamified lessons.

Contents

- Overview
- Features
- Architecture & Tech Stack
- Project Structure
- Getting Started
- Available Scripts
- Environment Variables
- Application Routing
- Deployment (Vercel)
- Security Notes
- Contributing
- Roadmap
- Author & License

Overview

SkillTree guides learners through a smart onboarding flow (sign in, career quiz, optional resume upload) to generate a personalized skill tree. Each node represents an interactive lesson with scenarios, challenges, and progress tracking. Completing nodes unlocks new branches, enabling a gamified progression experience.

The platform emphasizes accessibility and user experience, featuring comprehensive accessibility settings, dark mode support, and a clean, modern interface built with React and Tailwind CSS. The homepage includes a fixed navigation bar with direct links to the JobBuster platform.

Features

- Smart Onboarding
  - Sign In / Create Account stored via localStorage
  - Career Quiz to identify interests and goals
  - Optional Resume Upload to customize the learning path
- Gamified Learning
  - Visual skill tree populated with AI‑generated lessons
  - Interactive challenges and real‑world scenarios
  - Skill progress tracking and gated unlocks
- AI‑Generated Lessons
  - Generated client‑side from quiz answers and (optional) resume data
  - Logic implemented in `src/utils/generateLessons.js`
- Accessibility Features
  - Comprehensive accessibility settings panel
  - Screen reader support with announcements
  - High contrast mode
  - Large touch targets
  - Keyboard navigation support
  - Simplified navigation option
  - Reduced motion for users with vestibular disorders
  - Voice commands (future enhancement)
- Theme Support
  - Light/Dark mode toggle
  - Persists user preference
  - Smooth transitions
- Navigation & Integration
  - Fixed navigation bar for easy access
  - Direct integration link to JobBuster platform
  - Glassmorphism design with backdrop blur effects

Architecture & Tech Stack

- Frontend: React 19 (Vite)
- Router: React Router v6
- State: React Context API (UserContext, ThemeContext, AccessibilityContext)
- Styling: Tailwind CSS v4
- Utilities:
  - DOMPurify (content sanitization)
  - Framer Motion (animations)
  - Radix UI (Progress component)
  - Lucide React (icons)
  - PostCSS & Autoprefixer

Project Structure

```
SkillTree/
  public/
    skilltree-icon-lg.svg
    vite.svg
  src/
    App.jsx                // Routing logic
    main.jsx               // App entry point
    index.css              // Base styles
    App.css
    assets/
      react.svg
    backend/
      server.js            // Backend server (if needed)
    components/
      SignIn.jsx
      CreateAccount.jsx
      Career.jsx
      Upload.jsx
      Dashboard.jsx
      SkipDashboard.jsx
      SkillDashboard.jsx
      LessonPage.jsx
      HomePage.jsx
      Profile.jsx
      AccessibilitySettings.jsx
      styles/
        Profile.css        // Component-specific CSS files
    Context/
      UserContext.jsx      // Global user state and lesson tracking
      ThemeContext.jsx     // Theme management (light/dark mode)
      AccessibilityContext.jsx  // Accessibility settings and features
    utils/
      generateLessons.js           // Frontend AI lesson generator
      generateLessonChallenge.js   // Challenge generation logic
      evaluateAnswer.js            // Answer evaluation logic
  .env                     // Environment variables (if used)
  package.json
  vite.config.js
  vercel.json
  eslint.config.js
```

Getting Started

Prerequisites

- Node.js 18+ and npm 9+

Install dependencies

```
npm install
```

Run the development server

```
npm run dev
```

Open in browser

```
http://localhost:5173
```

Onboarding flow (suggested)

1. Sign In / Create Account
2. Career Quiz
3. (Optional) Upload Resume
4. Explore your personalized Dashboard (Skill Tree)

Available Scripts

- `npm run dev`: Start Vite dev server
- `npm run build`: Build for production to `dist/`
- `npm run preview`: Preview a production build locally
- `npm run lint`: Run ESLint

Environment Variables

If APIs or third‑party services are used, configure a `.env` file at the project root. Example (keys are illustrative and optional):

```
VITE_API_BASE_URL=
VITE_FEATURE_FLAGS=
```

Application Routing

| Path | Component | Description |
|------|-----------|-------------|
| / | SignIn | Login page |
| /create-account | CreateAccount | Register new user |
| /home | HomePage | Home/dashboard landing page |
| /quiz | Career | Career questionnaire |
| /upload | Upload | Resume upload (optional) |
| /dashboard | Dashboard | Main skill tree |
| /skip-dashboard | SkipDashboard | Alternate path if resume skipped |
| /profile | Profile | User profile page |
| /lesson/:id | LessonPage | Detailed lesson view |

Deployment (Vercel)

This project includes `vercel.json` configured for Vite static output.

Build and deploy

1. Ensure a production build:

```
npm run build
```

2. Deploy the `dist/` directory via Vercel. The provided config sets:

```
buildCommand: npm run build
outputDirectory: dist
framework: vite
rewrites: [{ source: "/(.*)", destination: "/" }]
```

Security Notes

- DOMPurify is included for sanitizing user‑generated content. Ensure any HTML or markdown rendering passes through sanitization.
- Avoid storing sensitive data in localStorage; this project uses it only for lightweight, client‑side session state.
- User authentication is handled client-side for this demo project. For production use, implement proper backend authentication.

Contributing

Contributions are welcome! Please open an issue to discuss proposed changes before submitting a pull request. When contributing:

- Follow existing code style and formatting
- Write clear, descriptive commit messages
- Add or update documentation when behavior changes

Roadmap

- ✅ Accessibility settings panel
- ✅ Dark mode support
- ✅ Profile page
- ✅ Fixed navigation bar with external links
- ✅ JobBuster platform integration
- ⏳ Add XP and level progression
- ⏳ Save and restore user progress across sessions
- ⏳ Add more challenge formats (quizzes, projects, simulations)
- ⏳ Expand lesson generation across additional career paths and skill domains
- ⏳ Voice command support
- ⏳ Backend API integration for persistent data storage
- ⏳ User achievements and badges
- ⏳ Social features (sharing progress, leaderboards)

## Author & License

**Author**: Siquil J. Ward — Developer and designer focused on gamified learning, career readiness, and user‑centered design.

**License**: Not specified. If you intend to open‑source, consider adding a `LICENSE` file (e.g., MIT) at the repository root.

---

## Acknowledgments

This project emphasizes accessibility and inclusive design, ensuring that learning opportunities are available to all users regardless of their abilities or preferences.

## Integrations

- **JobBuster**: Direct link to the JobBuster platform for job search and career opportunities. Accessible via the "JobBuster" button in the navigation bar.