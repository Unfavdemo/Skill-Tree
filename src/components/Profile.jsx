// src/pages/Profile.jsx
import React, { useState } from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { generateLessons } from "../utils/generateLessons";
import "./src/styles/profile.css";

export default function Profile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [industry, setIndustry] = useState(user?.industry || "");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  };

  const handleSave = async () => {
    setLoading(true);
    setFeedback("");

    try {
      // Convert resume to text if uploaded
      let resumeText = user?.resumeText || "";
      if (resumeFile) {
        resumeText = await resumeFile.text();
      }

      const updatedUser = {
        ...user,
        username,
        email,
        industry,
        resumeText,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Regenerate skills/lessons based on updated info
      const newSkills = await generateLessons({
        skills: [],
        careerAnswers: updatedUser.careerAnswers || [],
        resumeSkills: updatedUser.resumeText ? [updatedUser.resumeText] : [],
        challenges: 3,
      });

      const skillTitles = newSkills.map((lesson) => lesson.title);
      updatedUser.skills = skillTitles;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setFeedback("✅ Profile updated and skills regenerated!");
    } catch (err) {
      console.error("Failed to update profile:", err);
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
    <div className="screen p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-purple-400">Profile</h2>

      {/* User Info Form */}
      <div className="space-y-4 bg-purple-900/30 p-4 rounded-lg">
        <div>
          <label className="block text-gray-300 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-purple-900/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-purple-900/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full p-2 rounded bg-purple-900/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Industry</option>
            <option value="Technology / Software">Technology / Software</option>
            <option value="Finance / Banking">Finance / Banking</option>
            <option value="Healthcare / Biotech">Healthcare / Biotech</option>
            <option value="Education / Training">Education / Training</option>
            <option value="Entertainment / Media">Entertainment / Media</option>
            <option value="Manufacturing / Engineering">Manufacturing / Engineering</option>
            <option value="Consulting / Services">Consulting / Services</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Upload Resume (optional)</label>
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="w-full p-2 rounded bg-purple-900/40 text-white"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & Regenerate Skills"}
          </button>
          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

        {feedback && <p className="mt-2 text-green-400">{feedback}</p>}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-900/40 p-4 rounded-lg">
          <h4 className="text-purple-300 font-semibold mb-2">XP</h4>
          <p className="text-white">{xp}</p>
        </div>

        <div className="bg-purple-900/40 p-4 rounded-lg">
          <h4 className="text-purple-300 font-semibold mb-2">Level</h4>
          <p className="text-white">{level}</p>
        </div>

        <div className="bg-purple-900/40 p-4 rounded-lg">
          <h4 className="text-purple-300 font-semibold mb-2">Skills Gained</h4>
          {user.skills?.length > 0 ? (
            <ul className="text-white space-y-1">
              {user.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No skills gained yet.</p>
          )}
        </div>
      </div>

      {/* Previous Lessons */}
      <div className="bg-purple-900/40 p-4 rounded-lg">
        <h4 className="text-purple-300 font-semibold mb-2">Previous Lessons</h4>
        {user.completedLessons && Object.keys(user.completedLessons).length > 0 ? (
          <ul className="text-white space-y-1">
            {Object.entries(user.completedLessons).map(([skill, lessons]) => (
              <li key={skill}>
                <strong>{skill}:</strong>{" "}
                {Object.entries(lessons)
                  .map(([lessonName, data]) => `${lessonName} (Lvl ${data.level || 0})`)
                  .join(", ")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No lessons completed yet.</p>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
