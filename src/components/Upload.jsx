import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import DOMPurify from "dompurify";

const Upload = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [fileName, setFileName] = useState("");

  const sanitize = (value) => DOMPurify.sanitize(value.trim());

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) return;
    setFileName(sanitize(file.name));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!validateFile(file)) return;
    setFileName(sanitize(file.name));
  };

  const handleDragOver = (e) => e.preventDefault();

  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported file type. Use PDF, DOC, or DOCX.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Maximum 5MB.");
      return false;
    }
    return true;
  };

  const handleUploadContinue = () => {
    if (!fileName) {
      alert("Please upload your resume first!");
      return;
    }

    const updatedUser = {
      ...user,
      resumeUploaded: true,
      resumeSkills: [], // placeholder for extracted resume skills
    };

    setUser(updatedUser);
    localStorage.setItem("user", btoa(JSON.stringify(updatedUser)));
    navigate("/dashboard");
  };

  const handleSkip = () => {
    const updatedUser = { ...user, resumeUploaded: false, resumeSkills: [] };
    setUser(updatedUser);
    localStorage.setItem("user", btoa(JSON.stringify(updatedUser)));
    navigate("/dashboard");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="auth-title">{sanitize("Upload Your Resume")}</h1>
        <p className="auth-subtitle">Drag & drop or select a file</p>

        <div
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("resumeInput").click()}
        >
          <div className="upload-icon">📄</div>
          <p>{fileName || "Drag & drop your file here or click to browse"}</p>
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

        <button type="button" className="auth-btn secondary" onClick={handleSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default Upload;
