// src/components/Career.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

const Career = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [answers, setAnswers] = useState({});

  const questions = [
    { id: "interest", question: "Which area interests you the most?", options: ["Technology", "Creative Arts", "Healthcare", "Business", "Education"] },
    { id: "style", question: "What work style do you prefer?", options: ["Independent", "Team-based", "Hands-on", "Analytical", "Leadership"] },
    { id: "goal", question: "What motivates you in a career?", options: ["Helping others", "Innovation", "Financial growth", "Creativity", "Stability"] },
  ];

  const handleSelect = (qId, option) => setAnswers(prev => ({ ...prev, [qId]: option }));

  const handleSubmit = () => {
    // debug: confirm handler runs
    console.log("Career.handleSubmit called - answers:", answers);

    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions!");
      return;
    }

    const updatedUser = {
      ...(user || {}),
      username: (user && user.username) || "GuestUser",
      careerAnswers: answers,
      resumeUploaded: !!(user && user.resumeUploaded),
      skills: (user && user.skills) || [],
      lessons: (user && user.lessons) || [],
    };

    console.log("Career - updating user to:", updatedUser);

    // setUser from context will persist to localStorage via UserContext
    setUser(updatedUser);

    // navigation: go to dashboard if resume exists, else upload
    if (updatedUser.resumeUploaded) navigate("/dashboard");
    else navigate("/upload");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="auth-title">Career Questionnaire</h1>
        <p className="auth-subtitle">Tell us a bit about your career interests</p>

        {questions.map(q => (
          <div key={q.id} style={{ marginBottom: "16px", textAlign: "left" }}>
            <p style={{ fontWeight: "600" }}>{q.question}</p>
            {q.options.map(opt => (
              <label key={opt} style={{ display: "block", margin: "6px 0" }}>
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleSelect(q.id, opt)}
                />{" "}
                {opt}
              </label>
            ))}
          </div>
        ))}

        <button
          type="button"
          className="auth-btn"
          onClick={handleSubmit}
          aria-label="Continue to next step"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Career;
