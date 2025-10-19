SkillTree — Gamified Career Learning Platform

SkillTree is a front-end learning platform built with React + Vite that helps users explore career paths, upload resumes, and develop practical skills through AI-generated, gamified lessons.

Features
Smart Onboarding

Sign In / Create Account using localStorage for authentication.

Career Quiz identifies user interests and learning goals.

Resume Upload (optional) customizes the learning path and skill tree.

Dashboard displays a visual Skill Tree populated with AI-generated lessons.

Gamified Learning

Each lesson node represents a specific skill or challenge.

Lessons include:

Real-world scenarios

Interactive challenges

Skill progress tracking

Completing lessons unlocks new branches in the Skill Tree.

AI-Generated Lessons

Lessons are generated dynamically based on quiz answers and resume data.

The generation logic runs client-side through generateLessons.js.

Content adapts to different career paths and skill levels (not limited to cybersecurity).

Project Structure

SkillTree/

public/

vite.svg

src/

App.jsx — Routing logic

main.jsx — App entry point

index.css — Base styles

components/

SignIn.jsx

CreateAccount.jsx

Career.jsx

Upload.jsx

Dashboard.jsx

SkipDashboard.jsx

SkillDashboard.jsx

LessonPage.jsx

styles/ — Component-specific CSS files

Context/

UserContext.jsx — Global user state and lesson tracking

utils/

generateLessons.js — Frontend AI lesson generator

.gitignore

package.json

vite.config.js

.env — Environment variables (e.g., API keys if used)

Routing Overview
Route	Component	Description
/	SignIn	Login page
/create-account	CreateAccount	Register new user
/quiz	Career	Career questionnaire
/upload	Upload	Resume upload (optional)
/dashboard	Dashboard	Main skill tree
/skip-dashboard	SkipDashboard	Alternate path if resume skipped
/lesson/:id	LessonPage	Detailed lesson view
Quick Start

Install dependencies:

npm install


Run the development server:

npm run dev


Open in browser:

http://localhost:5173


Complete onboarding flow:

Sign In / Create Account → Career Quiz → Upload Resume → Dashboard


Explore your lessons:

View your personalized skill tree

Click nodes to open detailed lessons

Complete challenges to unlock new skills

Core Technologies

Frontend: React, Vite, React Router

State Management: React Context API

Styling: CSS Modules or Tailwind (optional)

AI Lesson Logic: Client-side via generateLessons.js

Roadmap

 Add XP and level progression

 Save and restore user progress

 Add more challenge formats (quizzes, projects, simulations)

 Expand lesson generation for multiple career paths and skill domains

Author

Siquil J. Ward
Developer and designer focused on gamified learning, career readiness, and user-centered design.