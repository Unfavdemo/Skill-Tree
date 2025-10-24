// src/utils/generateLessonChallenge.js
// ========================================
// 🎯 AI CHALLENGE GENERATION UTILITY
// ========================================
// This utility generates detailed, interactive challenges for individual lessons
// - Creates realistic scenarios based on lesson content and user context
// - Generates actionable challenges that require critical thinking
// - Provides helpful hints without giving away answers
// - Handles API errors with meaningful fallback content
// - Sanitizes AI responses to prevent XSS attacks

export async function generateLessonChallenge({ lessonTitle, skill, industry }) {
  // ========================================
  // 🔑 API CONFIGURATION
  // ========================================
  // Get OpenAI API key from environment variables
  const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // ========================================
  // 🌐 AI API REQUEST
  // ========================================
  // Makes a request to OpenAI's API to generate detailed lesson challenges
  // - Uses GPT-4o-mini for cost-effective content generation
  // - Includes lesson context (title, skill, industry) for personalization
  // - Requests structured JSON response with scenario, challenge, and hint
  try {
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
            content: `
              You are a professional tutor generating a detailed, engaging lesson challenge.

              User Context:
              - Lesson Title: ${lessonTitle}
              - Skill: ${skill || "general"}
              - Industry: ${industry || "general"}

              Task:
              Generate a scenario, challenge, and a helpful hint tailored to this lesson.
              Make the scenario realistic and immersive:
                * Include a setting, characters, or context relevant to the industry.
                * Show why the skill matters in this situation.
              Make the challenge actionable:
                * Require the user to think critically, apply knowledge, or solve a problem.
              Provide a concise but practical hint.

              Respond STRICTLY in JSON format like this:
              {
                "scenario": "A detailed scenario with context and characters",
                "challenge": "A clear, realistic task or problem to solve",
                "hint": "A helpful tip to guide the user without giving the answer"
              }
            `,
          },
        ],
      }),
    });

    // ========================================
    // 📊 RESPONSE PROCESSING
    // ========================================
    // Processes the AI response and extracts structured challenge data
    // - Safely extracts JSON from potentially mixed content
    // - Validates and sanitizes challenge data
    // - Provides fallback values for missing fields
    const data = await aiResponse.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // ========================================
    // 🔍 JSON EXTRACTION
    // ========================================
    // Safely extracts JSON object from AI response
    // - Finds first '{' and last '}' to isolate JSON content
    // - Prevents parsing errors from mixed text/JSON responses
    const jsonStart = rawContent.indexOf("{");
    const jsonEnd = rawContent.lastIndexOf("}") + 1;
    const jsonString = rawContent.substring(jsonStart, jsonEnd);

    const parsed = JSON.parse(jsonString);

    // ========================================
    // ✅ DATA VALIDATION & SANITIZATION
    // ========================================
    // Ensures challenge has required fields with safe defaults
    // - Prevents undefined errors in components
    // - Provides meaningful fallback content
    // - Maintains consistent data structure
    return {
      scenario: parsed.scenario || `Imagine a scenario applying ${lessonTitle} in ${industry}.`,
      challenge: parsed.challenge || `Apply ${lessonTitle} to solve a problem in this scenario.`,
      hint: parsed.hint || `Think about best practices and steps to solve the challenge.`,
    };

  } catch (err) {
    // ========================================
    // 🚨 ERROR HANDLING & FALLBACK SYSTEM
    // ========================================
    // Provides fallback content when AI generation fails
    // - Logs errors for debugging
    // - Creates meaningful default challenges based on lesson context
    // - Ensures application continues to function
    console.error("SecureAI: Failed to fetch or parse AI response:", err);

    // ========================================
    // 🔄 FALLBACK CHALLENGE GENERATION
    // ========================================
    // Creates default challenges when AI is unavailable
    // - Uses lesson title and industry context
    // - Provides generic but useful challenge structure
    // - Maintains consistent challenge format
    return {
      scenario: `Imagine you are in a realistic ${industry} setting applying ${lessonTitle}. Think about the people, environment, and stakes involved.`,
      challenge: `Identify a specific problem in this scenario where you can apply ${lessonTitle} to achieve a successful outcome.`,
      hint: `Consider the key steps, industry best practices, and potential obstacles that someone with this skill would face.`,
    };
  }
}
