// src/components/LessonPage.jsx
// ========================================
// 🎓 INTERACTIVE LESSON COMPONENT
// ========================================
// This component provides an interactive learning experience with:
// - AI-generated challenges and scenarios
// - Real-time answer evaluation and feedback
// - Progressive difficulty and skill building
// - Comprehensive feedback system that prevents advancement until correct answers
// - Secure content sanitization and error handling
// - Gamified learning with progress tracking

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "../Context/UserContext";
import { useAccessibility } from "../Context/AccessibilityContext";
import { motion } from "framer-motion";
import { generateLessonChallenge } from "../utils/generateLessonChallenge";
import { evaluateAnswer } from "../utils/evaluateAnswer";
import DOMPurify from "isomorphic-dompurify";
import { consumeLessonNavigationState } from "@/lib/lessonNavigation";

export default function LessonPage() {
  // ========================================
  // 🎯 HOOKS AND STATE MANAGEMENT
  // ========================================
  const params = useParams();
  const urlTitle = params?.title;
  const router = useRouter();
  const bridgeState = useMemo(() => consumeLessonNavigationState(), []);
  const { user, setUser, loading } = useUser(); // Access to global user context
  const { announce } = useAccessibility(); // Access to accessibility features

  // ========================================
  // 📊 LESSON DATA
  // ========================================
  // Try in-app navigation payload, then savedLessons (URL segment is fallback key only)
  const getLessonData = () => {
    if (bridgeState?.lesson && bridgeState?.skill) {
      return { lesson: bridgeState.lesson, skill: bridgeState.skill };
    }

    // Try to load from saved lessons
    const decodedTitle = typeof urlTitle === "string" ? decodeURIComponent(urlTitle) : null;
    if (decodedTitle && user?.savedLessons?.[decodedTitle]) {
      const saved = user.savedLessons[decodedTitle];
      return { lesson: saved.lesson, skill: saved.skill };
    }

    return null;
  };

  const lessonData = getLessonData();
  const lesson = lessonData?.lesson;
  const skill = lessonData?.skill;

  // ========================================
  // 🎮 GAME STATE MANAGEMENT
  // ========================================
  const [gameState, setGameState] = useState({ completed: false }); // Overall lesson completion
  const [challenges, setChallenges] = useState([]); // Array of generated challenges
  const [currentIndex, setCurrentIndex] = useState(0); // Current challenge index
  const [answer, setAnswer] = useState(""); // User's current answer
  const [feedback, setFeedback] = useState(""); // Current feedback message
  const [isEvaluating, setIsEvaluating] = useState(false); // Evaluation loading state
  const [evaluationResult, setEvaluationResult] = useState(null); // Latest evaluation result
  const [attempts, setAttempts] = useState(0); // Number of attempts for current challenge
  const [showNextButton, setShowNextButton] = useState(false); // Show next challenge button after correct answer
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false); // Loading state for challenge generation

  // ========================================
  // 🔄 CHALLENGE GENERATION EFFECT
  // ========================================
  // Generates AI-powered challenges when component mounts
  // - Creates multiple challenges for progressive learning
  // - Handles errors gracefully with fallback content
  // - Sanitizes all AI-generated content for security
  useEffect(() => {
    if (!lesson || !user) return;

    const fetchChallenges = async () => {
      setIsLoadingChallenges(true);
      try {
        const generatedChallenges = [];
        const challengeCount = 3; // Generate 3 challenges per lesson

        // Generate multiple challenges for progressive difficulty
        for (let i = 0; i < challengeCount; i++) {
          const aiData = await generateLessonChallenge({
            lessonTitle: lesson.title,
            skill,
            industry: user.industry || "",
          });

          // Sanitize all AI-generated content to prevent XSS
          generatedChallenges.push({
            scenario: DOMPurify.sanitize(aiData.scenario || ""),
            challenge: DOMPurify.sanitize(aiData.challenge || ""),
            hint: DOMPurify.sanitize(aiData.hint || ""),
          });
        }

        setChallenges(generatedChallenges);
        setIsLoadingChallenges(false);

        // ========================================
        // 💾 SAVE LESSON DATA
        // ========================================
        // Save lesson and challenges so user can return to it later
        if (lesson && skill) {
          setUser((prev) => {
            const safeTitle = DOMPurify.sanitize(lesson.title);
            return {
              ...prev,
              savedLessons: {
                ...prev.savedLessons,
                [safeTitle]: {
                  lesson: lesson,
                  skill: skill,
                  challenges: generatedChallenges,
                  lastAccessed: new Date().toISOString(),
                },
              },
            };
          });
        }
      } catch (err) {
        console.error("SecureAI: Failed to generate lesson challenges", err);
        // Fallback challenge if AI generation fails
        setChallenges([
          {
            scenario: "Failed to generate scenario.",
            challenge: "Try again later.",
            hint: "Please refresh the page and try again.",
          },
        ]);
        setIsLoadingChallenges(false);
      }
    };

    // Check if we have saved challenges first
    const savedChallenges = lesson && user?.savedLessons?.[lesson.title]?.challenges;
    if (savedChallenges && savedChallenges.length > 0) {
      setChallenges(savedChallenges);
    } else {
      fetchChallenges();
    }
  }, [lesson, user, skill]);

  // ========================================
  // 🚀 ANSWER EVALUATION HANDLER
  // ========================================
  // Handles answer submission with comprehensive evaluation
  // - Validates answer completeness
  // - Uses AI to evaluate answer quality
  // - Provides detailed feedback and suggestions
  // - Only allows progression with correct/acceptable answers
  // - Tracks attempts and provides encouragement
  const handleCompleteChallenge = async () => {
    // ========================================
    // 🔍 INPUT VALIDATION
    // ========================================
    if (!answer.trim()) {
      setFeedback("💬 Please enter an answer before completing the challenge!");
      return;
    }

    // ========================================
    // ⏳ EVALUATION PROCESS
    // ========================================
    setIsEvaluating(true);
    setFeedback("🤔 Evaluating your answer...");
    setAttempts((prev) => prev + 1);

    try {
      const currentChallenge = challenges[currentIndex];

      // ========================================
      // 🤖 AI ANSWER EVALUATION
      // ========================================
      // Use AI to evaluate the user's answer
      const evaluation = await evaluateAnswer({
        userAnswer: answer,
        challenge: currentChallenge.challenge,
        scenario: currentChallenge.scenario,
        lessonTitle: lesson.title,
        skill: skill,
        industry: user.industry || "",
      });

      setEvaluationResult(evaluation);

      // ========================================
      // 📊 FEEDBACK PROCESSING
      // ========================================
      if (evaluation.canProceed) {
        // Answer is acceptable - provide positive feedback
        setFeedback(`🎉 ${evaluation.feedback}`);
        announce(`Challenge ${currentIndex + 1} completed successfully`);

        // Update user progress
        updateUserProgress();

        // Show next button instead of auto-advancing
        setShowNextButton(true);
      } else {
        // Answer needs improvement - provide constructive feedback
        const attemptMessage = attempts > 1 ? ` (Attempt ${attempts})` : "";
        setFeedback(`📝 ${evaluation.feedback}${attemptMessage}`);
        announce(`Answer needs improvement. Please review the feedback and try again.`);
        setShowNextButton(false); // Hide next button if answer needs improvement

        // Show suggestions for improvement
        if (evaluation.suggestions) {
          setTimeout(() => {
            setFeedback((prev) => prev + `\n\n💡 Suggestions: ${evaluation.suggestions}`);
          }, 1000);
        }
      }
    } catch (err) {
      // ========================================
      // 🚨 ERROR HANDLING
      // ========================================
      console.error("SecureAI: Failed to evaluate answer:", err);
      setFeedback("⚠️ Unable to evaluate your answer. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // ========================================
  // 📈 USER PROGRESS UPDATE
  // ========================================
  // Updates user's completed lessons and skill progress
  const updateUserProgress = () => {
    setUser((prev) => {
      const safeSkill = DOMPurify.sanitize(skill || "");
      const existing = prev.completedLessons?.[safeSkill] || {};
      const currentLevel = existing[lesson.title]?.level || 0;

      return {
        ...prev,
        completedLessons: {
          ...prev.completedLessons,
          [safeSkill]: {
            ...prev.completedLessons?.[safeSkill],
            [lesson.title]: {
              level: currentLevel + 1,
              attempts: attempts + 1,
              lastCompleted: new Date().toISOString(),
            },
          },
        },
      };
    });
  };

  // ========================================
  // ➡️ ADVANCE TO NEXT CHALLENGE
  // ========================================
  // Resets state for the next challenge
  const advanceToNextChallenge = () => {
    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
      setFeedback("");
      setEvaluationResult(null);
      setAttempts(0);
      setShowNextButton(false);
      announce(`Starting challenge ${currentIndex + 2} of ${challenges.length}`);
    } else {
      completeLesson();
    }
  };

  // ========================================
  // 🏆 COMPLETE LESSON
  // ========================================
  // Handles lesson completion and navigation
  // Adds skill to user.skills when lesson is completed
  const completeLesson = () => {
    setGameState({ completed: true });
    announce(
      `Lesson ${DOMPurify.sanitize(lesson?.title || "completed")} completed! Congratulations!`
    );

    // Add skill to user.skills if not already present
    if (skill && lesson) {
      setUser((prev) => {
        const safeSkill = DOMPurify.sanitize(skill);
        const currentSkills = prev.skills || [];

        // Only add if skill is not already in the list
        if (!currentSkills.includes(safeSkill)) {
          return {
            ...prev,
            skills: [...currentSkills, safeSkill],
          };
        }
        return prev;
      });
    }

    // Navigate to skills dashboard to show skills gained
    setTimeout(() => {
      router.push("/skills-dashboard");
    }, 2000);
  };

  useEffect(() => {
    if (loading || lesson) return;
    const t = setTimeout(() => router.push("/dashboard"), 1500);
    return () => clearTimeout(t);
  }, [loading, lesson, router]);

  if (loading) return <div className="screen p-6 text-center text-gray-300">Loading lesson...</div>;
  if (!lesson) {
    return (
      <div className="screen p-6 text-center text-gray-300">
        No lesson data found. Returning to dashboard...
      </div>
    );
  }

  const currentChallenge = challenges[currentIndex] || {};

  return (
    <div className="screen lesson-page text-gray-100">
      <header className="challenge-header" role="banner">
        <div className="challenge-title">
          <div className="challenge-kicker">
            {DOMPurify.sanitize(skill || "Skill")} • Challenge {currentIndex + 1}/
            {Math.max(1, challenges.length)}
          </div>
          <h2 className="challenge-heading">{DOMPurify.sanitize(lesson.title)}</h2>
        </div>
        <div className="challenge-actions" role="toolbar" aria-label="Challenge actions">
          <button type="button" className="btn btn-secondary" onClick={() => router.push("/dashboard")}>
            Back
          </button>
        </div>
      </header>

      <motion.section
        className="focus-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        aria-label="Challenge workspace"
      >
        {isLoadingChallenges ? (
          <div className="ai-loader" role="status" aria-live="polite" aria-busy="true">
            <div className="ai-loader-spinner" aria-hidden="true"></div>
            <p className="ai-loader-text">✨ Generating your personalized challenges...</p>
          </div>
        ) : !gameState.completed ? (
          <>
            <div className="challenge-copy">
              <p className="challenge-scenario">{currentChallenge.scenario || "Generating scenario..."}</p>
              <p className="challenge-prompt">{currentChallenge.challenge || "Generating challenge..."}</p>
            </div>

            <textarea
              className="focus-editor"
              rows={8}
              placeholder="Write your answer here..."
              value={answer}
              onChange={(e) => {
                setAnswer(DOMPurify.sanitize(e.target.value));
                // Reset next button if user starts typing again
                if (showNextButton) {
                  setShowNextButton(false);
                }
              }}
            />

            <div className="challenge-cta" role="toolbar" aria-label="Submission actions">
              {!showNextButton ? (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      void handleCompleteChallenge().catch((err) => {
                        console.error(err);
                        setIsEvaluating(false);
                        setFeedback("⚠️ Unable to evaluate your answer. Please try again.");
                      });
                    }}
                    disabled={isEvaluating || !answer.trim()}
                  >
                    {isEvaluating ? "Evaluating..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setFeedback(`💡 Hint: ${currentChallenge.hint}`)}
                  >
                    Hint
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => advanceToNextChallenge()}
                >
                  {currentIndex + 1 < challenges.length ? "Next Challenge →" : "Complete Lesson →"}
                </button>
              )}
            </div>

            {/* Enhanced Feedback Display */}
            {feedback && (
              <motion.div
                className="mt-4 p-4 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Success Feedback */}
                {evaluationResult?.canProceed && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 text-xl">✅</span>
                      <span className="text-green-300 font-semibold">Great Answer!</span>
                      {evaluationResult.score && (
                        <span className="text-green-400 text-sm">
                          ({evaluationResult.score}/100)
                        </span>
                      )}
                    </div>
                    <p className="text-green-200 whitespace-pre-line">{feedback}</p>
                  </div>
                )}

                {/* Improvement Needed Feedback */}
                {evaluationResult && !evaluationResult.canProceed && (
                  <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 text-xl">📝</span>
                      <span className="text-yellow-300 font-semibold">Keep Improving!</span>
                      {evaluationResult.score && (
                        <span className="text-yellow-400 text-sm">
                          ({evaluationResult.score}/100)
                        </span>
                      )}
                    </div>
                    <p className="text-yellow-200 whitespace-pre-line">{feedback}</p>
                  </div>
                )}

                {/* General Feedback */}
                {!evaluationResult && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-blue-200 whitespace-pre-line">{feedback}</p>
                  </div>
                )}

                {/* Attempt Counter */}
                {attempts > 0 && (
                  <div className="mt-2 text-sm text-gray-400">Attempts: {attempts}</div>
                )}
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-bold text-green-400 mb-4">🎉 Lesson Completed!</h3>
            <p className="text-gray-300 mb-4">
              You've gained a new skill! Redirecting to skills dashboard...
            </p>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}
