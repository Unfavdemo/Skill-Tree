// src/components/SkillDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { generateLessons } from "../utils/generateLessons";
import { motion } from "framer-motion";

export default function SkillDashboard() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [aiLessons, setAiLessons] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skills, setSkills] = useState(user?.skills || []);
  const [previousLessons, setPreviousLessons] = useState(
    user?.completedLessons || {}
  );

  useEffect(() => {
    if (!user) return navigate("/"); // redirect if no user
    if (skills.length > 0) return;

    const generateSkillsOnce = async () => {
      setLoading(true);
      try {
        const lessons = await generateLessons({
          skills: [],
          careerAnswers: user.careerAnswers || [],
          resumeSkills: user.resumeText ? [user.resumeText] : [],
          challenges: 3,
        });

        const skillTitles = lessons.map((lesson) => lesson.title);

        setSkills(skillTitles);
        setUser((prev) => ({ ...prev, skills: skillTitles }));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, skills: skillTitles })
        );
      } catch (err) {
        console.error("Failed to generate skills:", err);
      } finally {
        setLoading(false);
      }
    };

    generateSkillsOnce();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNodeClick = async (skill) => {
    setSelectedSkill(skill);
    setLoading(true);
    try {
      const lessons = await generateLessons({
        skills: [skill],
        careerAnswers: user.careerAnswers || [],
        resumeSkills: user.resumeText ? [user.resumeText] : [],
        challenges: 3,
      });

      setAiLessons(Array.isArray(lessons) ? lessons : []);
    } catch (err) {
      console.error("Failed to generate lessons:", err);
      setAiLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson) => {
    navigate(`/lesson/${lesson.title}`, {
      state: { lesson, skill: selectedSkill },
    });
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="screen skill-dashboard">
      {/* Header */}
      <div className="screen-header flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-400">
            Welcome, {user?.username || "Adventurer"} 👋
          </h2>
          <p className="text-sm text-gray-300">
            Your skill mastery journey begins here...
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Profile Button */}
          <button
            onClick={handleProfileClick}
            className="auth-btn bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
          >
            Profile
          </button>

          {/* Sign Out */}
          <button
            className="auth-btn bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="screen-content skill-content flex gap-6 mt-4">
        {/* Left Sidebar: Skills */}
        <div className="sidebar-left">
          <h3>Your Skills</h3>
          {skills.length > 0 ? (
            <ul className="space-y-3">
              {skills.map((skill, i) => (
                <li
                  key={i}
                  className={`p-3 rounded-lg cursor-pointer text-white hover:bg-purple-700/50 transition-all ${
                    selectedSkill === skill
                      ? "bg-purple-700/70"
                      : "bg-purple-900/40"
                  }`}
                  onClick={() => handleNodeClick(skill)}
                >
                  {skill}
                  <div className="text-xs text-green-300 mt-1">
                    Mastery: {previousLessons[skill]?.level || 0}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">
              {loading
                ? "Generating your personalized skills..."
                : "No skills yet. Upload your resume or complete the questionnaire to start!"}
            </p>
          )}
        </div>

        {/* Center Skill Map */}
        <div className="skill-tree-center relative flex-1 min-h-[400px]">
          {skills.map((skill, i) => {
            const x = 20 + (i * 25) % 60;
            const y = 20 + (i * 15) % 50;
            return (
              <motion.div
                key={i}
                onClick={() => handleNodeClick(skill)}
                className="skill-node"
                style={{
                  position: "absolute",
                  top: `${y}%`,
                  left: `${x}%`,
                  transform: "translate(-50%, -50%)",
                }}
                whileHover={{ scale: 1.2, boxShadow: "0 0 20px #d900ff" }}
              >
                {skill}
              </motion.div>
            );
          })}
        </div>

        {/* Right Panel: Lessons */}
        <div className="sidebar-right">
          <h3>{selectedSkill ? `${selectedSkill} Lessons` : "Select a Skill"}</h3>
          {selectedSkill ? (
            loading ? (
              <p className="text-gray-300">✨ Generating lessons...</p>
            ) : aiLessons.length > 0 ? (
              <ul className="space-y-3">
                {aiLessons.map((lesson, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-lg cursor-pointer bg-purple-900/40 hover:bg-purple-700/50"
                    onClick={() => handleLessonClick(lesson)}
                  >
                    <strong>{lesson.title}</strong>
                    <p className="text-sm text-gray-300">{lesson.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Click a skill node to reveal lessons.</p>
            )
          ) : (
            <p className="text-gray-400">Select a skill to see lessons here.</p>
          )}
        </div>
      </div>

      {/* Bottom Boxes */}
      <div className="dashboard-bottom flex gap-6 mt-6">
        {/* Previous Lessons */}
        <div className="bg-purple-900/40 flex-1 p-4 rounded-lg">
          <h4 className="text-purple-300 font-semibold mb-2">
            Previous Lessons
          </h4>
          {Object.keys(previousLessons).length > 0 ? (
            <ul className="text-gray-200 space-y-1">
              {Object.entries(previousLessons).map(([skill, lessons]) => (
                <li key={skill}>
                  <strong>{skill}:</strong>{" "}
                  {Object.entries(lessons)
                    .map(
                      ([lessonName, data]) =>
                        `${lessonName} (Lvl ${data.level || 0})`
                    )
                    .join(", ")}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No lessons completed yet.</p>
          )}
        </div>

        {/* Skills Gained */}
        <div className="bg-purple-900/40 flex-1 p-4 rounded-lg">
          <h4 className="text-purple-300 font-semibold mb-2">Skills Gained</h4>
          {skills.length > 0 ? (
            <ul className="text-gray-200 space-y-1">
              {skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No skills gained yet.</p>
          )}
        </div>
      </div>

      {/* Footer XP Tracker */}
      <div className="screen-footer xp-tracker mt-6">
        🧙‍♂️ Level {Math.floor(skills.length / 3) + 1} Adventurer •{" "}
        {skills.length * 100} XP
      </div>
    </div>
  );
}
