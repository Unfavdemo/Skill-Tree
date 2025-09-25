import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Career: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const questions = [
    {
      id: "interest",
      question: "Which area interests you the most?",
      options: ["Technology", "Creative Arts", "Healthcare", "Business", "Education"],
    },
    {
      id: "style",
      question: "What work style do you prefer?",
      options: ["Independent", "Team-based", "Hands-on", "Analytical", "Leadership"],
    },
    {
      id: "goal",
      question: "What motivates you in a career?",
      options: ["Helping others", "Innovation", "Financial growth", "Creativity", "Stability"],
    },
  ];

  const handleSelect = (qId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions!");
      return;
    }
    console.log("Career quiz results:", answers);
    navigate("/upload");
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

        <button className="auth-btn" onClick={handleSubmit}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default Career;
