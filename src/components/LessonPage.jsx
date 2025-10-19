// LessonPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { motion } from "framer-motion";
import { generateLessonChallenge } from "../utils/generateLessonChallenge";

export default function LessonPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, setUser, loading } = useUser();

  const lesson = state?.lesson;
  const skill = state?.skill;

  const [gameState, setGameState] = useState({ completed: false });
  const [challenges, setChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  // Fetch AI-generated challenges
  useEffect(() => {
    if (!lesson || !user) return;

    const fetchChallenges = async () => {
      const generatedChallenges = [];
      const challengeCount = 3; // number of challenges per lesson

      for (let i = 0; i < challengeCount; i++) {
        const aiData = await generateLessonChallenge({
          lessonTitle: lesson.title,
          skill,
          industry: user.industry,
        });
        generatedChallenges.push(aiData);
      }

      setChallenges(generatedChallenges);
    };

    fetchChallenges();
  }, [lesson, user]);

  const handleCompleteChallenge = () => {
    if (!answer.trim()) {
      setFeedback("💬 Please enter an answer before completing the challenge!");
      return;
    }

    setFeedback("🎉 Great job on this challenge!");

    // Update user completedLessons with mastery level
    setUser((prev) => {
      const existing = prev.completedLessons?.[skill] || {};
      const newLevel = (existing[lesson.title]?.level || 0) + 1; // increment mastery

      return {
        ...prev,
        completedLessons: {
          ...prev.completedLessons,
          [skill]: {
            ...prev.completedLessons?.[skill],
            [lesson.title]: { level: newLevel },
          },
        },
      };
    });

    // Move to next challenge or complete lesson
    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
      setFeedback("");
    } else {
      setGameState({ completed: true });
      setTimeout(() => navigate("/dashboard"), 2500);
    }
  };

  if (loading) return <div className="screen p-6 text-center text-gray-300">Loading lesson...</div>;
  if (!lesson) {
    setTimeout(() => navigate("/dashboard"), 1500);
    return <div className="screen p-6 text-center text-gray-300">No lesson data found. Returning to dashboard...</div>;
  }

  const currentChallenge = challenges[currentIndex] || {};

  return (
    <div className="screen lesson-page text-gray-100">
      <div className="screen-header flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-400">{lesson.title}</h2>
        <button className="auth-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>

      <motion.div className="bg-purple-900/30 p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      >
        {!gameState.completed ? (
          <>
            {/* Scenario */}
            <p className="text-gray-300 mb-4 italic">{currentChallenge.scenario || "Generating scenario..."}</p>

            {/* Challenge */}
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Challenge {currentIndex + 1}:</h4>
            <p className="text-gray-200 mb-4">{currentChallenge.challenge || "Generating challenge..."}</p>

            {/* Answer Input */}
            <textarea
              className="w-full p-3 bg-purple-800/40 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              placeholder="Write your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white" onClick={handleCompleteChallenge}>
                Submit Answer
              </button>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white" onClick={() => setFeedback(`💡 Hint: ${currentChallenge.hint}`)}>
                Need Hint
              </button>
            </div>

            {feedback && <div className="mt-4 text-center text-green-400 animate-pulse">{feedback}</div>}
          </>
        ) : (
          <motion.div className="text-center mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-xl font-bold text-green-400">🎉 Lesson Completed!</h3>
            <p className="text-gray-300">Returning to dashboard...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
