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
                content: `The user has the following skills: ${skills.join(", ")}.
                  Career-related responses: ${JSON.stringify(careerAnswers)}.
                  ${resumeUploaded ? "" : "Note: the user skipped uploading a resume."}
                  
                  Task:
                  Suggest 3 personalized learning lessons to help the user grow in their chosen career path.
                  At least one lesson MUST be directly tied to the user's listed skills.
                  Use the career-related responses as context to ensure recommendations fit the user's interests and goals.
                  Avoid repeating overly generic topics unless explicitly relevant.

                  Format the response strictly as a JSON array, where each item has:
                    - "title": short name of the lesson
                    - "description": concise explanation of what will be learned
                    - "relevance": brief note on why this lesson matters for the user's career development
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
        const fallback = skills.length > 0
          ? skills.slice(0, 3).map(skill => ({
              title: `Strengthen ${skill}`,
              description: `Deepen your knowledge and practical application of ${skill}.`,
              relevance: `${skill} is one of your core skills, and improving it increases your career opportunities.`,
            }))
          : [
              {
                title: "Problem-Solving Strategies",
                description: "Practice structured approaches to analyze and solve complex challenges.",
                relevance: "This skill is universally valuable across all industries.",
              },
              {
                title: "Professional Communication",
                description: "Learn how to express ideas clearly and collaborate effectively.",
                relevance: "Strong communication supports success in any career path.",
              },
              {
                title: "Continuous Learning Mindset",
                description: "Build habits for staying adaptable and quickly learning new skills.",
                relevance: "Adaptability ensures long-term growth in evolving industries.",
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
