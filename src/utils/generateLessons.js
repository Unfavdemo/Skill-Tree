// src/utils/generateLessons.js
export async function generateLessons(user) {
  const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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

Return the response strictly as a JSON array only.
`,
          },
        ],
      }),
    });

    const data = await aiResponse.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // --- Safe extraction of JSON array ---
    const start = rawContent.indexOf("[");
    const end = rawContent.lastIndexOf("]") + 1;
    const jsonString = rawContent.substring(start, end);

    return JSON.parse(jsonString);

  } catch (err) {
    console.error("Failed to fetch or parse AI response:", err);

    // --- Fallback lessons if AI fails ---
    const { skills = [] } = user;
    return skills.length > 0
      ? skills.slice(0, 3).map((skill) => ({
          title: `Strengthen ${skill}`,
          description: `Deepen your knowledge and practical application of ${skill}.`,
          relevance: `${skill} is one of your core skills, and improving it increases your career opportunities.`,
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
