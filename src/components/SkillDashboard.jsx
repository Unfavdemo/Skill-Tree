import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { generateLessons } from "../utils/generateLessons";

const SkillDashboard = ({ showResumeSkipped = false, showUploadButton = false }) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [aiLessons, setAiLessons] = useState([]);

  // Fetch AI lessons dynamically
  useEffect(() => {
    if (user) {
      generateLessons(user)
        .then((lessons) => {
          if (Array.isArray(lessons)) {
            setAiLessons(lessons);
          } else {
            console.error("AI lessons returned invalid data:", lessons);
            setAiLessons([]);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const skills = user?.skills || [];
  const lessons = user?.lessons || [];

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleUploadLater = () => navigate("/upload");

  // Merge user lessons + AI lessons for left panel
  const allLessons = [...lessons, ...aiLessons.map((l) => l.title)];

  // Multi-level tree (3 lessons per level)
  const treeLevels = [];
  if (aiLessons.length > 0) {
    const perLevel = 3;
    for (let i = 0; i < aiLessons.length; i += perLevel) {
      treeLevels.push(aiLessons.slice(i, i + perLevel));
    }
  }

  // Click handler to navigate to lesson page
  const handleLessonClick = (lesson) => {
    navigate(`/lesson/${lesson.title}`, { state: { lesson } });
  };

  return (
    <div className="dashboard-container">
      {/* Profile Header */}
      <div
        className="profile-pic-section"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <p>Welcome, {user?.username || "Guest"} 👋</p>
          {showResumeSkipped && (
            <p style={{ fontSize: "12px", color: "#bbb", marginTop: "4px" }}>
              You skipped the resume upload
            </p>
          )}
        </div>
        <button
          onClick={handleSignOut}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "none",
            background: "#4caf50",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Left Column */}
      <div className="sidebar-left">
        {/* Previous Lessons */}
        <div className="skill-card">
          <div className="skill-title">Previous Lessons</div>
          <ul className="previous-lessons-list">
            {aiLessons.length > 0 ? (
              aiLessons.map((lesson, i) => (
                <li
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <strong>{lesson.title}</strong>: {lesson.description}
                </li>
              ))
            ) : (
              <li>Loading AI lessons...</li>
            )}
          </ul>
        </div>

        {/* Upload Resume Later Button */}
        {showUploadButton && (
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button
              onClick={handleUploadLater}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                background: "rgba(255,255,255,0.08)",
                color: "#4caf50",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            >
              Upload Resume Later
            </button>
          </div>
        )}
      </div>

      {/* Right Column (Skill Tree) */}
      <div className="skill-tree-center">
        <div className="tree-header">
          <span>Skill Tree</span>
          <span>Progress</span>
        </div>

        <div className="tree-visual">
          {/* Multi-level AI lessons as clickable nodes */}
          {treeLevels.length > 0 ? (
            treeLevels.map((level, idx) => (
              <div key={idx} className="tree-level" style={{ justifyContent: "space-around" }}>
                {level.map((lesson, i) => (
                  <div
                    key={i}
                    className="skill-node child"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleLessonClick(lesson)}
                  >
                    <strong>{lesson.title}</strong>
                    <p style={{ fontSize: "12px", margin: "4px 0 0 0" }}>{lesson.description}</p>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p style={{ color: "#bbb", textAlign: "center", marginTop: "20px" }}>Loading AI lessons...</p>
          )}
        </div>

        <div className="tree-footer">
          <span>Keep going!</span>
          <span>{skills.length} skills</span>
        </div>
      </div>

      {/* Bottom Latest Skills */}
      <div className="latest-skills-card">
        <div className="latest-title">Latest Skills Added</div>
        <ul className="skill-list">
          {skills.map((skill, i) => (
            <li key={i}>✅ {skill}</li>
          ))}
        </ul>
        <div className="more-skills">+ more coming soon...</div>
      </div>
    </div>
  );
};

export default SkillDashboard;
