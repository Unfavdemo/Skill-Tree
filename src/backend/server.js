// src/backend/server.js
// ========================================
// 🖥️ BACKEND SERVER COMPONENT
// ========================================
// This component provides AI-powered lesson generation functionality
// - Generates personalized learning lessons using OpenAI API
// - Handles user context (skills, career answers, resume status)
// - Provides fallback content when AI generation fails
// - Implements error handling and loading states
// - Returns structured lesson data for frontend consumption

import { useState, useEffect } from "react";

// ========================================
// 🎯 CAREER LESSONS COMPONENT
// ========================================
// Main component that generates and displays personalized learning lessons
// - Accepts user context as props (resume status, skills, career answers)
// - Manages lesson state, loading, and error states
// - Handles AI API communication and response processing
export default function CareerLessons({ resumeUploaded, skills = [], careerAnswers = {} }) {
  // ========================================
  // 📊 STATE MANAGEMENT
  // ========================================
  const [lessons, setLessons] = useState([]);           // Generated lessons array
  const [loading, setLoading] = useState(false);       // Loading state for API calls
  const [error, setError] = useState(null);             // Error state for failed requests

  // ========================================
  // 🔑 API CONFIGURATION
  // ========================================
  // Get OpenAI API key from environment variables
  const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // ========================================
  // 🔄 LESSON GENERATION EFFECT
  // ========================================
  // Automatically generates lessons when component mounts or user context changes
  // - Triggers on resumeUploaded, skills, or careerAnswers changes
  // - Handles loading states and error management
  // - Provides fallback content when AI generation fails
  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      setError(null);

      try {
        // ========================================
        // 🌐 AI API REQUEST
        // ========================================
        // Makes request to OpenAI API for personalized lesson generation
        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${VITE_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are a career learning platform that generates lessons for ALL industries and professions - not just technology or coding.

User Context:
- Skills: ${skills.join(", ") || "none"}
- Career goals and interests: ${JSON.stringify(careerAnswers)}
- Resume status: ${resumeUploaded ? "Resume uploaded" : "No resume uploaded"}

CRITICAL INSTRUCTIONS:
1. Lessons must be UNIVERSAL and applicable to ANY field (healthcare, finance, education, marketing, design, hospitality, manufacturing, consulting, law, arts, etc.)
2. DO NOT assume the user is in tech/coding unless explicitly stated in their career goals or skills
3. Generate lessons that work for traditional careers, creative fields, service industries, and professional services
4. Focus on transferable skills: communication, critical thinking, project management, negotiation, presentation, research, analysis, etc.
5. If the user specified a non-tech field, prioritize lessons relevant to THAT field
6. Make scenarios realistic for their indicated industry/profession

Task:
Generate 3 personalized learning lessons that help the user grow in their chosen career path - whatever field that may be.
At least one lesson should be directly tied to the user's listed skills when available.
Use career-related responses as context to ensure recommendations fit the user's interests and goals.
Each lesson must include:
- "title": short name that reflects their field/context if known, or be universally applicable
- "description": concise explanation of what will be learned in universal terms
- "relevance": brief note on why this lesson matters for their career - be specific to their field if known

Examples of UNIVERSAL lesson topics:
- Effective Communication and Stakeholder Management
- Time Management and Prioritization
- Problem-Solving and Critical Analysis
- Professional Networking and Relationship Building
- Presentation Skills and Public Speaking
- Negotiation and Conflict Resolution
- Research Methods and Information Analysis
- Project Planning and Execution

Format the response strictly as a JSON array, where each item has: title, description, and relevance.
                `,
              },
            ],
          }),
        });

        // ========================================
        // 📊 RESPONSE PROCESSING
        // ========================================
        // Processes AI response and extracts structured lesson data
        const data = await aiResponse.json();
        const rawContent = data.choices?.[0]?.message?.content || "";

        // ========================================
        // 🔍 JSON EXTRACTION
        // ========================================
        // Safely extracts JSON array from AI response
        const jsonStart = rawContent.indexOf("[");
        const jsonEnd = rawContent.lastIndexOf("]") + 1;
        const jsonString = rawContent.substring(jsonStart, jsonEnd);
        const parsedLessons = JSON.parse(jsonString);

        setLessons(parsedLessons);
      } catch (err) {
        // ========================================
        // 🚨 ERROR HANDLING & FALLBACK SYSTEM
        // ========================================
        console.error("AI fetch failed:", err);

        // ========================================
        // 🔄 FALLBACK LESSON GENERATION
        // ========================================
        // Creates default lessons when AI is unavailable
        // - Uses existing user skills if available
        // - Provides universal professional lessons as fallback
        // - Focuses on transferable skills applicable to any field
        const industryInterests = careerAnswers?.industryInterests || [];
        const firstIndustry = industryInterests?.[0] || "your profession";
        
        const fallback = skills.length > 0
          ? skills.slice(0, 3).map(skill => ({
              title: `Strengthen Your ${skill} Skills`,
              description: `Deepen your knowledge and practical application of ${skill} in professional settings.`,
              relevance: `${skill} is a valuable skill that can be applied across many industries and roles.`,
            }))
          : [
              {
                title: "Effective Problem-Solving Strategies",
                description: "Practice structured approaches to analyze and solve complex challenges in any professional setting.",
                relevance: "Problem-solving is universally valuable across all industries and career paths.",
              },
              {
                title: "Professional Communication and Stakeholder Management",
                description: "Develop skills in clear communication, active listening, and managing relationships with colleagues, clients, and stakeholders.",
                relevance: "Strong communication skills are essential for success in any field and help build trust and collaboration.",
              },
              {
                title: "Time Management and Prioritization",
                description: "Learn to effectively manage your time, prioritize tasks, and balance competing demands in professional settings.",
                relevance: "Efficient time management improves productivity and work-life balance in any career.",
              },
            ];

        setLessons(fallback);
        setError("Using fallback lessons due to an API issue.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [resumeUploaded, skills, careerAnswers]);

  // ========================================
  // 🎨 COMPONENT RENDER
  // ========================================
  // Renders the lesson list with loading states and error handling
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Personalized Learning Lessons</h2>
      
      {/* Loading state */}
      {loading && <p>Loading lessons...</p>}
      
      {/* Error state */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Lessons list */}
      <ul className="space-y-3">
        {lessons.map((lesson, idx) => (
          <li key={idx} className="p-4 border rounded-xl shadow-sm">
            <h3 className="font-bold text-lg">{lesson.title}</h3>
            <p className="text-gray-700">{lesson.description}</p>
            <p className="text-sm text-gray-500 mt-1"><em>{lesson.relevance}</em></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
