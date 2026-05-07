// src/utils/evaluateAnswer.js
// ========================================
// 🤖 AI ANSWER EVALUATION UTILITY
// ========================================
// This utility evaluates user answers using OpenAI's GPT-4o-mini
// - Compares user answers against expected concepts and keywords
// - Provides detailed feedback on correctness and areas for improvement
// - Returns a score and feedback to guide user learning
// - Handles API errors with fallback evaluation logic
// - Sanitizes all inputs and outputs for security

import { parseJsonObjectFromContent } from "../lib/parseAiJson";

export async function evaluateAnswer({
  userAnswer,
  challenge,
  scenario,
  lessonTitle,
  skill,
  industry,
}) {
  // ========================================
  // 🔑 API CONFIGURATION
  // ========================================
  // Get OpenAI API key from environment variables
  const VITE_OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  // No API key configured → fall back immediately.
  if (!VITE_OPENAI_API_KEY) {
    const answerLength = userAnswer.trim().length;
    const hasKeywords = checkForKeywords(userAnswer, challenge, skill);
    const score = hasKeywords ? 75 : Math.min(60, Math.max(10, Math.floor(answerLength / 3)));
    const canProceed = score >= 70;

    return {
      isCorrect: canProceed,
      score,
      feedback: canProceed
        ? "Good work — your answer shows understanding."
        : "I couldn’t verify this with AI right now. Try adding more concrete steps and specifics.",
      suggestions: canProceed
        ? "Nice. Consider adding one example from a real scenario."
        : "Add a clear step-by-step plan, mention stakeholders, and explain trade-offs.",
      canProceed,
    };
  }

  // ========================================
  // 🌐 AI API REQUEST
  // ========================================
  // Makes request to OpenAI API for answer evaluation
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
            content: `You are an expert tutor evaluating student answers. Your task is to:

1. Evaluate the user's answer for correctness and completeness
2. Provide constructive feedback
3. Determine if the answer is sufficient to proceed

Context:
- Lesson: ${lessonTitle}
- Skill: ${skill || "general"}
- Industry: ${industry || "general"}
- Scenario: ${scenario}
- Challenge: ${challenge}

Evaluation Criteria:
- Correctness: Does the answer address the challenge appropriately?
- Completeness: Does it cover the key concepts?
- Relevance: Is it relevant to the scenario and skill?
- Clarity: Is the explanation clear and well-structured?

Respond STRICTLY in JSON format:
{
  "isCorrect": boolean,
  "score": number (0-100),
  "feedback": "Detailed feedback on what's good and what could be improved",
  "suggestions": "Specific suggestions for improvement",
  "canProceed": boolean
}

Guidelines:
- isCorrect: true if answer demonstrates understanding of key concepts
- score: 0-100 based on correctness, completeness, and relevance
- canProceed: true if score >= 70 OR answer shows good understanding despite minor issues
- Be encouraging but honest in feedback
- Provide specific, actionable suggestions
- Consider partial credit for partially correct answers
            `,
          },
          {
            role: "user",
            content: `Please evaluate this student answer: "${userAnswer}"`,
          },
        ],
      }),
    });

    // ========================================
    // 📊 RESPONSE PROCESSING
    // ========================================
    // Processes AI response and extracts structured evaluation data
    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      const msg = data?.error?.message || data?.error || aiResponse.statusText;
      console.error("SecureAI: OpenAI API error:", msg);
      throw new Error(typeof msg === "string" ? msg : "OpenAI request failed");
    }

    const rawContent = data.choices?.[0]?.message?.content || "";
    const parsed = parseJsonObjectFromContent(rawContent);

    if (!parsed) {
      console.warn("SecureAI: Unparseable evaluation JSON. Preview:", String(rawContent).slice(0, 200));
      throw new Error("Invalid evaluation JSON from model");
    }

    // ========================================
    // ✅ DATA VALIDATION & SANITIZATION
    // ========================================
    // Ensures evaluation has required fields with safe defaults
    return {
      isCorrect: Boolean(parsed.isCorrect),
      score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
      feedback:
        parsed.feedback ||
        "Your answer has been received. Please review the challenge and try again.",
      suggestions:
        parsed.suggestions || "Consider reviewing the scenario and challenge requirements.",
      canProceed: Boolean(parsed.canProceed),
    };
  } catch (err) {
    // ========================================
    // 🚨 ERROR HANDLING & FALLBACK SYSTEM
    // ========================================
    console.error("SecureAI: Failed to evaluate answer:", err);

    // ========================================
    // 🔄 FALLBACK EVALUATION
    // ========================================
    // Simple keyword-based evaluation when AI is unavailable
    const answerLength = userAnswer.trim().length;
    const hasKeywords = checkForKeywords(userAnswer, challenge, skill);

    // Basic scoring based on length and keyword presence
    let score = 0;
    if (answerLength > 50) score += 30;
    if (answerLength > 100) score += 20;
    if (hasKeywords) score += 40;
    if (answerLength > 200) score += 10;

    const isCorrect = score >= 70;
    const canProceed = score >= 60; // Lower threshold for fallback

    return {
      isCorrect,
      score,
      feedback: isCorrect
        ? "Good answer! You've demonstrated understanding of the key concepts."
        : "Your answer needs more detail. Try to address the challenge more comprehensively.",
      suggestions:
        "Consider providing more specific examples and explaining your reasoning step by step.",
      canProceed,
    };
  }
}

// ========================================
// 🔍 KEYWORD CHECKING HELPER
// ========================================
// Simple keyword-based evaluation for fallback scenarios
function checkForKeywords(userAnswer, challenge, skill) {
  const answer = userAnswer.toLowerCase();
  const challengeText = challenge.toLowerCase();
  const skillText = skill?.toLowerCase() || "";

  // Extract potential keywords from challenge and skill
  const keywords = [
    ...challengeText.split(" ").filter((word) => word.length > 4),
    ...skillText.split(" ").filter((word) => word.length > 3),
    "problem",
    "solution",
    "approach",
    "strategy",
    "method",
    "technique",
    "analyze",
    "evaluate",
    "implement",
    "design",
    "create",
    "develop",
  ];

  // Check if answer contains relevant keywords
  const keywordMatches = keywords.filter((keyword) => answer.includes(keyword.toLowerCase()));

  return keywordMatches.length >= 2; // Require at least 2 keyword matches
}
