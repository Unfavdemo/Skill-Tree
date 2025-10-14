// src/backend/server.js
import http from "http";
import { config } from "dotenv";
import fetch from "node-fetch"; // make sure node-fetch is installed

config(); // load .env

const server = http.createServer(async (req, res) => {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // --- API endpoint ---
  if (req.method === "POST" && req.url === "/api/generateLessons") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      try {
        const { resumeUploaded, skills, careerAnswers } = JSON.parse(body);

        // --- Improved Prompt for AI ---
        const prompt = `
          The user has the following skills: ${skills.join(", ")}.
          Career-related responses: ${JSON.stringify(careerAnswers)}.
          ${resumeUploaded ? "" : "Note: the user skipped uploading a resume."}

          Task:
          Suggest 3 personalized learning lessons to help the user grow in their chosen career path. 
          At least one lesson MUST be directly tied to the user's listed skills. 
          Use the career-related responses as context to ensure recommendations fit the user's interests and goals.
          Avoid repeating overly generic topics unless they are explicitly relevant.

          Format the response strictly as a JSON array, where each item has:
          - "title": a short name of the lesson
          - "description": a concise explanation of what will be learned
          - "relevance": a brief note on why this lesson matters for the user's career development
        `;

        let lessons = [];

        try {
          const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: prompt }]
            })
          });

          const data = await aiResponse.json();
          const rawContent = data.choices?.[0]?.message?.content || "";

          // Safely extract JSON array from response
          const jsonStart = rawContent.indexOf("[");
          const jsonEnd = rawContent.lastIndexOf("]") + 1;
          const jsonString = rawContent.substring(jsonStart, jsonEnd);
          lessons = JSON.parse(jsonString);

        } catch (err) {
          console.error("Failed to fetch or parse AI response:", err);

          // --- Adaptive Fallback Lessons ---
          lessons = skills.length > 0
            ? skills.slice(0, 3).map(skill => ({
                title: `Strengthen ${skill}`,
                description: `Deepen your knowledge and practical application of ${skill}.`,
                relevance: `${skill} is one of your core skills, and improving it increases your career opportunities.`
              }))
            : [
                {
                  title: "Problem-Solving Strategies",
                  description: "Practice structured approaches to analyze and solve complex challenges.",
                  relevance: "This skill is universally valuable across all industries."
                },
                {
                  title: "Professional Communication",
                  description: "Learn how to express ideas clearly and collaborate effectively.",
                  relevance: "Strong communication supports success in any career path."
                },
                {
                  title: "Continuous Learning Mindset",
                  description: "Build habits for staying adaptable and quickly learning new skills.",
                  relevance: "Adaptability ensures long-term growth in evolving industries."
                }
              ];
        }

        // Return lessons
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ lessons }));

      } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

// --- Start server ---
server.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});
