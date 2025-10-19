import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

export default function Career() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Load existing answers (or empty object for multi-choice)
  const [answers, setAnswers] = useState(user?.careerAnswers || {});

  // Diverse questions for any career path
  const questions = [
    {
      question: "What are your top career goals?",
      options: [
        "Leadership/Management",
        "Technical expertise",
        "Creative development",
        "Entrepreneurship",
        "Work-life balance",
        "Professional growth",
      ],
      key: "careerGoals",
    },
    {
      question: "Which skills are you most interested in developing?",
      options: [
        "Coding / Programming",
        "Data Analysis",
        "Design / UX",
        "Marketing & Sales",
        "Project Management",
        "Communication / Presentation",
        "Problem Solving",
      ],
      key: "skillsDevelopment",
    },
    {
      question: "Which industries interest you the most?",
      options: [
        "Technology / Software",
        "Finance / Banking",
        "Healthcare / Biotech",
        "Education / Training",
        "Entertainment / Media",
        "Manufacturing / Engineering",
        "Consulting / Services",
      ],
      key: "industryInterests",
    },
  ];

  // Toggle checkbox selection
  const handleCheckboxChange = (questionKey, option) => {
    const current = answers[questionKey] || [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setAnswers({ ...answers, [questionKey]: updated });
  };

  // Submit answers and navigate
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      careerAnswers: answers,
      onboarding: true,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    navigate("/upload");
  };

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Progress: number of questions answered / total
  const progressPercent =
    (questions.filter((q) => (answers[q.key] || []).length > 0).length /
      questions.length) *
    100;

  return (
    <div className="screen career-screen">
      <div className="screen-header">Career Questionnaire</div>

      {/* Progress bar */}
      <div className="career-progress">
        <div
          className="career-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="screen-content">
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {questions.map((q, idx) => (
            <div key={idx} className="career-question">
              <label>{q.question}</label>
              <div className="career-options checkbox-group">
                {q.options.map((option) => {
                  const isChecked = (answers[q.key] || []).includes(option);
                  return (
                    <label
                      key={option}
                      className={`career-option checkbox-option ${
                        isChecked ? "checked" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(q.key, option)}
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <button type="submit" className="career-btn">
            Next
          </button>
        </form>
      </div>

      <div className="screen-footer">
        Progress:{" "}
        {questions.filter((q) => (answers[q.key] || []).length > 0).length} /{" "}
        {questions.length}
      </div>
    </div>
  );
}
