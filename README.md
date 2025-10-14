SkillTree — Vite + React

A starter app built with Vite and React. Provides a simple onboarding flow:

Sign in / Create account

Career quiz

Resume upload (optional)

Dashboard with a visual skill tree populated with AI-generated lessons

Project structure

.gitignore

eslint.config.js

index.html

package.json

vite.config.js

public/vite.svg

src/main.jsx — entry point

src/App.jsx — routes

src/index.css — base styles

src/App.css — app styles

Components (source files and exported symbols)

SignIn
 — sign-in page

CreateAccount
 — create account flow

Career
 — career questionnaire

Upload
 — resume upload and handleFile
 validation

Dashboard
 — main dashboard / skill tree, integrates SkillDashboard

SkipDashboard
 — alternative dashboard if resume upload is skipped

SkillDashboard
 — reusable dashboard component, AI lessons dynamically fetched and clickable

LessonPage
 — dedicated page for a single AI-generated lesson

Notable files (assets & env)

src/assets/react.svg

public/vite.svg

.env — store OPENAI_API_KEY

Overview / behavior details

Routing in App
:

Route	Component
/	SignIn

/create-account	CreateAccount

/quiz	Career

/upload	Upload

/dashboard	Dashboard

/skip-dashboard	SkipDashboard

/lesson/:id	LessonPage

Authentication / onboarding:

SignIn stores "username" in localStorage and navigates to /quiz.

CreateAccount stores "username" and "userEmail" in localStorage and navigates to /quiz.

Career quiz:

Collects answers for three questions and navigates to /upload after submission.

Resume upload:

Validates file size (max 10MB) and type (PDF, DOC, DOCX).

After upload, navigates to /dashboard.

"Skip for now" navigates to /skip-dashboard.

Dashboard & SkipDashboard:

Displays AI-generated lessons in a visual skill tree.

Lessons are clickable and navigate to /lesson/:id to show detailed content.

Sign-out clears localStorage and navigates to /.

LessonPage:

Displays the lesson’s title and description (passed via state from dashboard).

Can be extended to show full AI-generated content, videos, steps, or quizzes.

Backend / AI lessons

Server runs on http://localhost:5000

Endpoint: POST /api/generateLessons

Input: { resumeUploaded: boolean, skills: string[], careerAnswers: string[] }

Output: { lessons: [{ title: string, description: string }] }

AI lessons are fetched dynamically and displayed in the dashboard.

Scripts (see package.json
)

npm run dev — start Vite dev server

npm run build — build production bundle

npm run preview — preview production build

npm run lint — lint project with ESLint

Quick start

Install dependencies:

npm install


Start backend server (AI lessons):

node src/backend/server.js


Start frontend:

npm run dev


Open browser at http://localhost:5173

Complete onboarding flow:

SignIn / CreateAccount → Career Quiz → Upload Resume → Dashboard


Click AI lessons in left panel or skill tree to navigate to detailed lesson pages.