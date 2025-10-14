// src/components/Upload.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

const Upload = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [fileName, setFileName] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUploadContinue = () => {
    if (!fileName) {
      alert("Please upload your resume first!");
      return;
    }

    const updatedUser = {
      ...(user || {}),
      resumeUploaded: true,
      skills: user?.skills || [],
      lessons: user?.lessons || [],
      careerAnswers: user?.careerAnswers || {},
      username: user?.username || "Guest",
    };

    setUser(updatedUser);

    navigate("/dashboard");
  };

  const handleSkip = () => {
    // update user to indicate they skipped resume upload
    const updatedUser = {
      ...(user || {}),
      resumeUploaded: false,
      skills: user?.skills || [],
      lessons: user?.lessons || [],
      careerAnswers: user?.careerAnswers || {},
      username: user?.username || "Guest",
    };

    setUser(updatedUser);

    // ✅ Navigate to SkipDashboard
    navigate("/skip-dashboard");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="auth-title">Upload Your Resume</h1>
        <p className="auth-subtitle">Drag & drop or select a file</p>

        <div
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("resumeInput").click()}
        >
          <div className="upload-icon">📄</div>
          <p>{fileName ? fileName : "Drag & drop your file here or click to browse"}</p>
          <input
            id="resumeInput"
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>

        <button type="button" className="auth-btn" onClick={handleUploadContinue}>
          Continue
        </button>

        <button
          type="button"
          className="auth-btn secondary"
          onClick={handleSkip}
          style={{ marginTop: "12px" }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default Upload;
