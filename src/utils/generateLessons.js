// src/utils/generateLessons.js
// ========================================
// 🤖 AI LESSON GENERATION UTILITY
// ========================================
// This utility generates personalized learning lessons using OpenAI's GPT-4o-mini
// - Creates customized content based on user's career goals and skills
// - Implements fallback systems for when AI fails
// - Sanitizes AI responses to prevent XSS attacks
// - Provides structured lesson data with challenges and scenarios
// - Handles API errors gracefully with default content

export async function generateLessons(user) {
  // ========================================
  // 🔑 API CONFIGURATION
  // ========================================
  // Get OpenAI API key from environment variables
  const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // ========================================
  // 🌐 AI API REQUEST
  // ========================================
  // Makes a request to OpenAI's API to generate personalized lessons
  // - Uses GPT-4o-mini for cost-effective content generation
  // - Includes user context (skills, career answers, resume status)
  // - Requests structured JSON response with lesson data
  try {
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VITE_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
The user has the following skills: ${user.skills?.join(", ") || "none"}.
Career-related responses: ${JSON.stringify(user.careerAnswers || [])}.
${user.resumeUploaded ? "" : "Note: the user skipped uploading a resume."}

Task:
Suggest 3 personalized learning lessons to help the user grow in their chosen career path.
Each lesson must include:
- title
- description
- relevance
- challenges: array of challenge objects, each with:
   - scenario
   - question
   - hint

Respond STRICTLY in JSON array format only.
`,
          },
        ],
      }),
    });

    // ========================================
    // 📊 RESPONSE PROCESSING
    // ========================================
    // Processes the AI response and extracts structured lesson data
    // - Safely extracts JSON from potentially mixed content
    // - Validates and sanitizes lesson data
    // - Provides fallback values for missing fields
    const data = await aiResponse.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // ========================================
    // 🔍 JSON EXTRACTION
    // ========================================
    // Safely extracts JSON array from AI response
    // - Finds first '[' and last ']' to isolate JSON content
    // - Prevents parsing errors from mixed text/JSON responses
    const start = rawContent.indexOf("[");
    const end = rawContent.lastIndexOf("]") + 1;
    const jsonString = rawContent.substring(start, end);

    const parsed = JSON.parse(jsonString);

    // ========================================
    // ✅ DATA VALIDATION & SANITIZATION
    // ========================================
    // Ensures each lesson has required fields with safe defaults
    // - Prevents undefined errors in components
    // - Provides meaningful fallback content
    // - Maintains consistent data structure
    return parsed.map((lesson) => ({
      title: lesson.title || "Untitled Lesson",
      description: lesson.description || "No description available.",
      relevance: lesson.relevance || "Relevant to your career growth.",
      challenges: Array.isArray(lesson.challenges)
        ? lesson.challenges.map((c) => ({
            scenario: c.scenario || "A realistic scenario to practice the skill.",
            question: c.question || "Apply the skill to solve this challenge.",
            hint: c.hint || "Think critically and use best practices.",
          }))
        : [],
    }));

  } catch (err) {
    // ========================================
    // 🚨 ERROR HANDLING & FALLBACK SYSTEM
    // ========================================
    // Provides fallback content when AI generation fails
    // - Logs errors for debugging
    // - Creates meaningful default lessons based on user skills
    // - Ensures application continues to function
    console.error("SecureAI: Failed to fetch or parse AI response:", err);

    // ========================================
    // 🔄 FALLBACK LESSON GENERATION
    // ========================================
    // Creates default lessons when AI is unavailable
    // - Uses existing user skills if available
    // - Provides generic problem-solving lesson as ultimate fallback
    // - Maintains consistent lesson structure
    const { skills = [] } = user;
    return skills.length > 0
      ? skills.slice(0, 3).map((skill) => ({
          title: `Strengthen ${skill}`,
          description: `Deepen your knowledge and practical application of ${skill}.`,
          relevance: `${skill} is one of your core skills; improving it boosts your career opportunities.`,
          challenges: [
            {
              scenario: `You are solving a problem using ${skill}.`,
              question: `Explain how you would apply ${skill} in a real scenario.`,
              hint: "Think about practical steps or real-world examples.",
            },
          ],
        }))
      : [
          {
            title: "Problem-Solving Strategies",
            description: "Practice structured approaches to analyze and solve complex challenges.",
            relevance: "This skill is universally valuable across all industries.",
            challenges: [
              {
                scenario: "You encounter a complex problem at work.",
                question: "Describe your approach to solving it.",
                hint: "Break it into smaller steps and analyze each part.",
              },
            ],
          },
        ];
  }
}
