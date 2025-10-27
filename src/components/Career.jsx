import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import DOMPurify from "dompurify";

export default function Career() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // 🧩 Initialize answers safely (avoid undefined structures)
  const [answers, setAnswers] = useState(() => {
    try {
      return user?.careerAnswers || {};
    } catch {
      console.warn("SecureAI: Failed to load user career answers.");
      return {};
    }
  });

  // 🧠 Centralized sanitizer for defensive input handling
  const sanitizeInput = (input) => {
    if (Array.isArray(input)) return input.map((v) => DOMPurify.sanitize(v));
    return DOMPurify.sanitize(input);
  };

  // 🎯 Secure question definitions
  const questions = [
    {
      question: "What are your top career goals?(select all that apply)",
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
      question: "Which skills are you most interested in developing?(select all that apply)",
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
      question: "Which industries interest you the most?(select all that apply)",
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

  // 🧰 Toggle checkbox securely with sanitized input
  const handleCheckboxChange = (questionKey, option) => {
    const safeKey = DOMPurify.sanitize(questionKey);
    const safeOption = DOMPurify.sanitize(option);

    const current = answers[safeKey] || [];
    const updated = current.includes(safeOption)
      ? current.filter((o) => o !== safeOption)
      : [...current, safeOption];

    setAnswers({ ...answers, [safeKey]: updated });
  };

  // 🚀 Submit securely with safe local storage handling
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const sanitizedAnswers = Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [k, sanitizeInput(v)])
      );

      const updatedUser = {
        ...user,
        careerAnswers: sanitizedAnswers,
        onboarding: true,
      };

      setUser(updatedUser);
      // Note: setUser already saves to localStorage with proper Unicode-safe encoding

      navigate("/upload");
    } catch (err) {
      console.error("SecureAI: Failed to persist user answers", err);
      alert("⚠️ Your progress could not be saved securely. Please try again.");
    }
  };

  // 🔎 Runtime guard: detect missing or corrupted user data
  useEffect(() => {
    if (!user) {
      console.warn("SecureAI: Missing user context – redirecting to login.");
      navigate("/");
      return;
    }

    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const decoded = decodeURIComponent(escape(atob(stored)));
        JSON.parse(decoded);
      }
    } catch {
      console.warn("SecureAI: Corrupted or tampered user data detected.");
      localStorage.removeItem("user");
    }
  }, [user, navigate]);

  // 📊 Progress bar calculation
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
