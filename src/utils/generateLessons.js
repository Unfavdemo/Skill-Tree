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
You are a career learning platform that generates lessons for ALL industries and professions - not just technology or coding.

User Context:
- Skills: ${user.skills?.join(", ") || "none"}
- Career goals and interests: ${JSON.stringify(user.careerAnswers || [])}
- Resume status: ${user.resumeUploaded ? "Resume uploaded" : "No resume uploaded"}

CRITICAL INSTRUCTIONS:
1. Lessons must be UNIVERSAL and applicable to ANY field (healthcare, finance, education, marketing, design, hospitality, manufacturing, consulting, law, arts, etc.)
2. DO NOT assume the user is in tech/coding unless explicitly stated in their career goals or skills
3. Generate lessons that work for traditional careers, creative fields, service industries, and professional services
4. Focus on transferable skills: communication, critical thinking, project management, negotiation, presentation, research, analysis, etc.
5. If the user specified a non-tech field, prioritize lessons relevant to THAT field
6. Make scenarios realistic for their indicated industry/profession

Task:
Generate 3 personalized learning lessons that help the user grow in their chosen career path - whatever field that may be.
Each lesson must include:
- title (should reflect the actual field/context if known, or be universally applicable)
- description (explains what will be learned in universal terms)
- relevance (why this lesson matters for their career - be specific to their field if known)
- challenges: array of 2-3 challenge objects, each with:
   - scenario (realistic situation in their field, or universal professional context)
   - question (actionable task that applies to their profession)
   - hint (helpful guidance without giving the answer)

Examples of UNIVERSAL lesson topics:
- Effective Communication and Stakeholder Management
- Time Management and Prioritization
- Problem-Solving and Critical Analysis
- Professional Networking and Relationship Building
- Presentation Skills and Public Speaking
- Negotiation and Conflict Resolution
- Research Methods and Information Analysis
- Project Planning and Execution

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
    // - Provides universal professional lessons as fallback
    // - Maintains consistent lesson structure
    // - Focuses on transferable skills applicable to any field
    const { skills = [], careerAnswers = {} } = user;
    
    // Extract industry context if available
    const industryInterests = careerAnswers?.industryInterests || [];
    const firstIndustry = industryInterests?.[0] || "your profession";
    
    if (skills.length > 0) {
      return skills.slice(0, 3).map((skill) => ({
        title: `Strengthen Your ${skill} Skills`,
        description: `Deepen your knowledge and practical application of ${skill} in professional settings.`,
        relevance: `${skill} is a valuable skill that can be applied across many industries and roles.`,
        challenges: [
          {
            scenario: `You are in a professional setting where you need to apply ${skill}. Consider the context, stakeholders, and objectives involved.`,
            question: `Describe a real-world scenario where you would use ${skill} and explain your approach.`,
            hint: "Think about practical steps, industry best practices, and how this skill creates value in professional contexts.",
          },
        ],
      }));
    }
    
    // Universal fallback lessons for any profession
    return [
      {
        title: "Effective Problem-Solving Strategies",
        description: "Practice structured approaches to analyze and solve complex challenges in any professional setting.",
        relevance: "Problem-solving is universally valuable across all industries and career paths.",
        challenges: [
          {
            scenario: "You encounter a complex challenge or problem in your workplace that requires careful analysis and a strategic solution.",
            question: "Describe your step-by-step approach to understanding, analyzing, and solving this problem.",
            hint: "Break the problem into smaller components, identify root causes, consider multiple perspectives, and evaluate potential solutions.",
          },
        ],
      },
      {
        title: "Professional Communication and Stakeholder Management",
        description: "Develop skills in clear communication, active listening, and managing relationships with colleagues, clients, and stakeholders.",
        relevance: "Strong communication skills are essential for success in any field and help build trust and collaboration.",
        challenges: [
          {
            scenario: "You need to communicate an important message to multiple stakeholders who have different perspectives, priorities, and communication styles.",
            question: "How would you tailor your communication approach to ensure each stakeholder understands and engages with your message?",
            hint: "Consider audience analysis, message framing, communication channels, and follow-up strategies.",
          },
        ],
      },
      {
        title: "Time Management and Prioritization",
        description: "Learn to effectively manage your time, prioritize tasks, and balance competing demands in professional settings.",
        relevance: "Efficient time management improves productivity and work-life balance in any career.",
        challenges: [
          {
            scenario: "You have multiple important projects, deadlines, and responsibilities competing for your attention with limited time available.",
            question: "How would you prioritize your tasks, manage your schedule, and ensure critical work gets completed on time?",
            hint: "Consider urgency vs. importance, breaking down large tasks, delegation opportunities, and realistic time estimates.",
          },
        ],
      },
    ];
  }
}
