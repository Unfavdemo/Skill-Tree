import React, { useState } from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { generateLessons } from "../utils/generateLessons";
import DOMPurify from "dompurify";
import "../styles/Profile.css";

export default function Profile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [industry, setIndustry] = useState(user?.industry || "");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Sanitize input helper
  const sanitize = (value) => DOMPurify.sanitize(value.trim());

  // Resume upload with validation
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Only allow text, PDF, or DOC/DOCX; max 5MB
    const allowedTypes = ["text/plain", "application/pdf", 
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported file type. Use TXT, PDF, or DOC/DOCX.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Maximum 5MB.");
      return;
    }

    setResumeFile(file);
  };

  const handleSave = async () => {
    setLoading(true);
    setFeedback("");

    try {
      // Extract resume text safely
      let resumeText = user?.resumeText || "";
      if (resumeFile) {
        resumeText = await resumeFile.text();
        resumeText = sanitize(resumeText);
      }

      const updatedUser = {
        ...user,
        username: sanitize(username),
        email: sanitize(email),
        industry: sanitize(industry),
        resumeText,
      };

      setUser(updatedUser);
      // Note: setUser already saves to localStorage with proper encoding

      // Regenerate lessons/skills
      const newSkills = await generateLessons({
        skills: [],
        careerAnswers: updatedUser.careerAnswers || [],
        resumeSkills: resumeText ? [resumeText] : [],
        challenges: 3,
      });

      const skillTitles = newSkills.map((lesson) => DOMPurify.sanitize(lesson.title));
      const finalUser = { ...updatedUser, skills: skillTitles };
      setUser(finalUser);
      // Note: setUser already saves to localStorage with proper encoding

      setFeedback("✅ Profile updated and skills regenerated!");
    } catch (err) {
      console.error("SecureAI: Failed to update profile:", err);
      setFeedback("❌ Failed to update profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  // XP and Level calculation
  const xp = user.skills?.length * 100 || 0;
  const level = Math.floor((user.skills?.length || 0) / 3) + 1;

  return (
    <div className="screen profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <h2>Profile</h2>
      </div>

      {/* User Info Form */}
      <div className="profile-form">
        <div className="profile-field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(sanitize(e.target.value))}
            placeholder="Enter your username"
          />
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(sanitize(e.target.value))}
            placeholder="Enter your email"
          />
        </div>

        <div className="profile-field">
          <label>Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(sanitize(e.target.value))}
          >
            <option value="">Select Industry</option>
            {[
              "Technology / Software",
              "Finance / Banking",
              "Healthcare / Biotech",
              "Education / Training",
              "Entertainment / Media",
              "Manufacturing / Engineering",
              "Consulting / Services",
            ].map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div className="profile-field">
          <label>Upload Resume (optional)</label>
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleResumeUpload}
          />
        </div>

        <div className="profile-actions">
          <button
            className="profile-btn profile-btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & Regenerate Skills"}
          </button>
          <button
            className="profile-btn profile-btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

        {feedback && (
          <div className={`profile-feedback ${
            feedback.includes("✅") ? "profile-feedback-success" : "profile-feedback-error"
          }`}>
            {feedback}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="profile-stats">
        <div className="profile-stat-card">
          <h4>XP</h4>
          <p>{xp}</p>
        </div>

        <div className="profile-stat-card">
          <h4>Level</h4>
          <p>{level}</p>
        </div>

        <div className="profile-stat-card">
          <h4>Skills Gained</h4>
          {user.skills?.length > 0 ? (
            <ul>
              {user.skills.map((skill, i) => (
                <li key={i}>{sanitize(skill)}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#9ca3af' }}>No skills gained yet.</p>
          )}
        </div>
      </div>

      {/* Previous Lessons */}
      <div className="profile-lessons">
        <h4>Previous Lessons</h4>
        {user.completedLessons && Object.keys(user.completedLessons).length > 0 ? (
          <ul>
            {Object.entries(user.completedLessons).map(([skill, lessons]) => (
              <li key={skill}>
                <strong>{sanitize(skill)}:</strong>{" "}
                {Object.entries(lessons)
                  .map(([lessonName, data]) => `${sanitize(lessonName)} (Lvl ${data.level || 0})`)
                  .join(", ")}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#9ca3af' }}>No lessons completed yet.</p>
        )}
      </div>

      {/* Sign Out Button */}
      <div className="profile-actions">
        <button
          onClick={handleSignOut}
          className="profile-btn profile-btn-danger"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
