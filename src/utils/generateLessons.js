export async function generateLessons(user) {
  const response = await fetch("http://localhost:5000/api/generateLessons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resumeUploaded: user.resumeUploaded,
      skills: user.skills,
      careerAnswers: user.careerAnswers,
    }),
  });

  const { lessons } = await response.json();
  return lessons;
}
