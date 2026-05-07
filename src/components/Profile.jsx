"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../Context/UserContext";
import { useAccessibility } from "../Context/AccessibilityContext";
import { setLessonNavigationState } from "@/lib/lessonNavigation";
import { generateLessons } from "../utils/generateLessons";
import DOMPurify from "isomorphic-dompurify";
import "../styles/Profile.css";

export default function Profile() {
  const { user, setUser } = useUser();
  const { announce } = useAccessibility();
  const router = useRouter();

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
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported file type. Use TXT, PDF, or DOC/DOCX.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Maximum 5MB.");
      return;
    }

    setResumeFile(file);
    announce(`Resume file ${sanitize(file.name)} uploaded successfully`);
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

      const newLessons = await generateLessons({
        skills: [],
        careerAnswers: updatedUser.careerAnswers || {},
        resumeSkills: resumeText ? [resumeText] : [],
        resumeUploaded: updatedUser.resumeUploaded || false,
      });

      const availableSkills = Array.isArray(newLessons)
        ? newLessons.map((l) => sanitize(l.title)).filter(Boolean)
        : [];

      setUser(updatedUser);

      const mergedUser =
        availableSkills.length > 0
          ? {
              ...updatedUser,
              availableSkills,
              skillLessons: {},
            }
          : updatedUser;

      if (availableSkills.length > 0) {
        setUser(mergedUser);
      }

      announce("Profile saved successfully");
      setFeedback("✅ Profile updated and skills regenerated!");
    } catch (err) {
      console.error("SecureAI: Failed to update profile:", err);
      setFeedback("❌ Failed to update profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // XP and Level calculation
  const xp = user.skills?.length * 100 || 0;
  const level = Math.floor((user.skills?.length || 0) / 3) + 1;

  return (
    <div className="screen profile-container">
      {/* Profile Header */}
      <header className="profile-header" role="banner">
        <div className="flex w-full justify-between items-start gap-4">
          <div>
            <h1 id="profile-title">Profile</h1>
            <p className="profile-header-lede">Update your details and rebuild your personalized skill offerings.</p>
          </div>
          <div className="profile-header-meta" aria-label="Progress summary">
            <span className="profile-level-pill">Level {level}</span>
            <span className="profile-xp-pill">{xp} XP</span>
          </div>
        </div>
      </header>

      {/* User Info Form */}
      <main role="main" aria-label="Profile settings">
        <form
          className="profile-form"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSave().catch((err) => {
              console.error(err);
              setLoading(false);
              setFeedback("❌ Failed to update profile. Try again.");
            });
          }}
          aria-label="Profile information form"
        >
          <fieldset>
            <legend className="sr-only">Personal Information</legend>

            <div className="profile-fields-grid">
            <div className="profile-field">
              <label htmlFor="username-input">
                Username
                <span className="sr-only">: required field</span>
              </label>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(sanitize(e.target.value))}
                placeholder="Enter your username"
                aria-required="true"
                aria-describedby="username-help"
                aria-invalid={username.trim() === ""}
              />
              <span id="username-help" className="sr-only">
                Enter your username. This is a required field.
              </span>
            </div>

            <div className="profile-field">
              <label htmlFor="email-input">
                Email
                <span className="sr-only">: required field</span>
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(sanitize(e.target.value))}
                placeholder="Enter your email"
                aria-required="true"
                aria-describedby="email-help"
                aria-invalid={email.trim() === "" || !email.includes("@")}
              />
              <span id="email-help" className="sr-only">
                Enter your email address. This is a required field.
              </span>
            </div>

            <div className="profile-field profile-field-span-2">
              <label htmlFor="industry-select">
                Industry
                <span className="sr-only">: optional field</span>
              </label>
              <select
                id="industry-select"
                value={industry}
                onChange={(e) => setIndustry(sanitize(e.target.value))}
                aria-describedby="industry-help"
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
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              <span id="industry-help" className="sr-only">
                Select your industry. This field is optional.
              </span>
            </div>

            <div className="profile-field profile-field-span-2 profile-field-file">
              <label htmlFor="resume-upload">
                Upload Resume
                <span className="sr-only">
                  : optional, accepts TXT, PDF, DOC, or DOCX files up to 5MB
                </span>
              </label>
              <div className="profile-file-row">
              <input
                id="resume-upload"
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleResumeUpload}
                aria-describedby="resume-help"
              />
              </div>
              <span id="resume-help" className="sr-only">
                Upload your resume. Accepted formats: TXT, PDF, DOC, DOCX. Maximum file size: 5MB.
                This field is optional.
              </span>
              {resumeFile && (
                <span className="file-selected" aria-live="polite">
                  File selected: {resumeFile.name}
                </span>
              )}
            </div>
            </div>
          </fieldset>

          <div className="profile-actions" role="toolbar" aria-label="Profile actions">
            <button
              className="profile-btn profile-btn-primary"
              disabled={loading}
              type="submit"
              aria-busy={loading}
              aria-label={loading ? "Saving profile changes" : "Save profile and regenerate skills"}
            >
              {loading ? "Saving..." : "Save & Regenerate Skills"}
            </button>
            <button
              className="profile-btn profile-btn-secondary"
              onClick={() => router.push("/dashboard")}
              type="button"
              aria-label="Return to dashboard"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push("/dashboard");
                }
              }}
            >
              Back to Dashboard
            </button>
          </div>

          {feedback && (
            <div
              className={`profile-feedback ${
                feedback.includes("✅") ? "profile-feedback-success" : "profile-feedback-error"
              }`}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {feedback}
            </div>
          )}
        </form>
      </main>

      {/* Stats Section */}
      <section className="profile-stats" aria-label="User statistics">
        <h2 className="sr-only">Statistics</h2>
        <div className="profile-stat-card" role="region" aria-label="Experience points">
          <h3>XP</h3>
          <p aria-label={`${xp} experience points`}>{xp}</p>
        </div>

        <div className="profile-stat-card" role="region" aria-label="User level">
          <h3>Level</h3>
          <p aria-label={`Level ${level}`}>{level}</p>
        </div>

        <div className="profile-stat-card" role="region" aria-label="Skills gained">
          <h3>Skills Gained</h3>
          {user.skills?.length > 0 ? (
            <ul role="list" aria-label={`${user.skills.length} skills gained`}>
              {user.skills.map((skill, i) => (
                <li key={i} aria-label={`Skill: ${sanitize(skill)}`}>
                  {sanitize(skill)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="profile-empty-message" aria-live="polite">
              No skills gained yet.
            </p>
          )}
        </div>
      </section>

      {/* Previous Lessons */}
      <section className="profile-lessons" aria-label="Previous lessons">
        <h2>Previous Lessons</h2>
        {user.savedLessons && Object.keys(user.savedLessons).length > 0 ? (
          <ul
            className="profile-lessons-list"
            role="list"
            aria-label={`${Object.keys(user.savedLessons).length} previous lessons`}
          >
            {Object.entries(user.savedLessons).map(([lessonTitle, lessonData]) => {
              const lesson = lessonData.lesson;
              const skill = lessonData.skill;
              const completedData = user.completedLessons?.[skill]?.[lessonTitle];
              const level = completedData?.level || 0;

              return (
                <li
                  key={lessonTitle}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setLessonNavigationState({ lesson, skill });
                    router.push(`/lesson/${encodeURIComponent(lessonTitle)}`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setLessonNavigationState({ lesson, skill });
                      router.push(`/lesson/${encodeURIComponent(lessonTitle)}`);
                    }
                  }}
                  className="profile-lesson-item"
                  aria-label={`${sanitize(lessonTitle)}${skill ? ` for skill ${sanitize(skill)}` : ""}${level > 0 ? `, completed at level ${level}` : ""}. Click to open lesson.`}
                  style={{
                    cursor: "pointer",
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    borderRadius: "8px",
                    background: "rgba(185, 144, 255, 0.1)",
                    transition: "all 0.2s ease",
                    border: "1px solid rgba(185, 144, 255, 0.2)",
                  }}
                >
                  <strong style={{ color: "#b990ff" }}>{sanitize(lessonTitle)}</strong>
                  {skill && (
                    <span
                      style={{ color: "#d3d8ff", marginLeft: "0.5rem" }}
                      aria-label={`Skill: ${sanitize(skill)}`}
                    >
                      • {sanitize(skill)}
                    </span>
                  )}
                  {level > 0 && (
                    <span
                      style={{ color: "#9ca3af", marginLeft: "0.5rem" }}
                      aria-label={`Level ${level}`}
                    >
                      (Level {level})
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : user.completedLessons && Object.keys(user.completedLessons).length > 0 ? (
          <ul role="list">
            {Object.entries(user.completedLessons).map(([skill, lessons]) => (
              <li key={skill}>
                <strong>{sanitize(skill)}:</strong>{" "}
                <span aria-label={`Lessons for ${sanitize(skill)}`}>
                  {Object.entries(lessons)
                    .map(([lessonName, data]) => `${sanitize(lessonName)} (Lvl ${data.level || 0})`)
                    .join(", ")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="profile-empty-message" aria-live="polite">
            No lessons completed yet.
          </p>
        )}
      </section>

    </div>
  );
}
