// generateLessonChallenge.js
export async function generateLessonChallenge({ lessonTitle, skill, industry }) {
  const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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

    const data = await aiResponse.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Safely extract JSON from AI response
    const jsonStart = rawContent.indexOf("{");
    const jsonEnd = rawContent.lastIndexOf("}") + 1;
    const jsonString = rawContent.substring(jsonStart, jsonEnd);

    return JSON.parse(jsonString);

  } catch (err) {
    console.error("Failed to fetch or parse AI response:", err);

    // --- Fallback content ---
    return {
      scenario: `Imagine you are in a realistic ${industry} setting applying ${lessonTitle}. Think about the people, environment, and stakes involved.`,
      challenge: `Identify a specific problem in this scenario where you can apply ${lessonTitle} to achieve a successful outcome.`,
      hint: `Consider the key steps, industry best practices, and potential obstacles that someone with this skill would face.`,
    };
  }
}
