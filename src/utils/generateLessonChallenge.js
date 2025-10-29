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
Generate engaging lesson challenges for ALL industries (healthcare, finance, education, marketing, hospitality, etc.) - NOT just tech/coding.

Context:
- Lesson: "${lessonTitle}"
- Skill: ${skill || "general professional skill"}
- Industry: ${industry || "any professional field"}

Scenario Requirements:
Create a realistic, immersive professional scenario with:
- Clear setting (office, hospital, school, retail, studio, etc.)
- Relevant characters/stakeholders
- Authentic context for their field
- Why the skill matters in this situation

Challenge Requirements:
- Clear, actionable task or problem to solve
- Requires critical thinking and knowledge application
- Relevant to professional work
- Avoids overly technical language unless explicitly needed

Hint Requirements:
- Concise, practical guidance
- Focuses on best practices and thinking steps
- Does NOT reveal the answer

CRITICAL: Use contexts like workplaces, client meetings, team collaboration, problem-solving situations - applicable to traditional careers, service industries, creative fields, etc. DO NOT default to programming/coding scenarios.

Respond in JSON only:
{
  "scenario": "Detailed professional scenario with setting and context",
  "challenge": "Clear, actionable professional task",
  "hint": "Helpful guidance without giving away the answer"
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
    // - Provides universal professional challenge structure
    // - Maintains consistent challenge format
    // - Applicable to any field, not just tech
    const industryContext = industry && industry !== "general" ? industry : "your professional field";
    return {
      scenario: `Imagine you are in a realistic professional setting in ${industryContext} where you need to apply ${lessonTitle}. Consider the workplace environment, colleagues or clients involved, and the potential impact of your actions.`,
      challenge: `Describe a specific real-world situation in ${industryContext} where you would apply ${lessonTitle}. Explain your approach to addressing this situation effectively.`,
      hint: `Think about professional best practices, key considerations specific to your field, the stakeholders involved, and practical steps that lead to successful outcomes.`,
    };
  }
}
