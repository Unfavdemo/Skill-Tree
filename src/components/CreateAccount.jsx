// src/components/CreateAccount.jsx
// ========================================
// 👤 USER REGISTRATION COMPONENT
// ========================================
// This component handles new user account creation with security features:
// - Secure form validation and input sanitization
// - Resume upload with file type and size validation
// - Password encoding for basic security
// - User data initialization with default values
// - Navigation to career questionnaire after successful registration
// - Error handling for failed account creation

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import DOMPurify from "dompurify";

export default function CreateAccount() {
  // ========================================
  // 🎯 HOOKS AND STATE MANAGEMENT
  // ========================================
  const { setUser } = useUser();                        // Access to global user context
  const navigate = useNavigate();                       // React Router navigation hook

  // ========================================
  // 📊 FORM STATE MANAGEMENT
  // ========================================
  // Manages all form data with controlled inputs
  const [form, setForm] = useState({
    username: "",                                       // User's display name
    email: "",                                         // Contact email address
    password: "",                                      // User's password
    resumeUploaded: false,                             // Resume upload status
    resumeSkills: [],                                  // Skills extracted from resume
  });

  const [resumeFileName, setResumeFileName] = useState(""); // Track uploaded file name

  // ========================================
  // 🛡️ INPUT SANITIZATION HELPER
  // ========================================
  // Centralized sanitizer for all user inputs to prevent XSS attacks
  const sanitize = (value) => DOMPurify.sanitize(value.trim());

  // ========================================
  // 📝 FORM INPUT HANDLERS
  // ========================================
  // Handles controlled input changes with sanitization
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: sanitize(value) });
  };

  // ========================================
  // 📄 RESUME UPLOAD HANDLER
  // ========================================
  // Handles resume file upload with comprehensive validation
  // - Validates file type (PDF, DOC, DOCX only)
  // - Enforces file size limit (5MB maximum)
  // - Updates form state with upload status
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ========================================
    // 🔍 FILE VALIDATION
    // ========================================
    // Validate file type and size for security
    if (!file.type.includes("pdf") && !file.type.includes("doc")) {
      alert("Please upload a valid PDF or DOC/DOCX file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Maximum 5MB allowed.");
      return;
    }

    // Update form state with upload confirmation
    setForm({ ...form, resumeUploaded: true });
    setResumeFileName(file.name);

    // TODO: Implement resume parsing logic to extract skills
    // Future enhancement: Parse resume content to automatically extract skills
    // Example implementation:
    // const extractedSkills = parseResume(file);
    // setForm({ ...form, resumeUploaded: true, resumeSkills: extractedSkills });
  };

  // ========================================
  // 🚀 FORM SUBMISSION HANDLER
  // ========================================
  // Handles secure form submission with comprehensive validation
  // - Validates all required fields
  // - Encodes password for basic security
  // - Creates new user object with default values
  // - Persists user data to localStorage
  // - Navigates to career questionnaire
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // ========================================
      // 🔍 FORM VALIDATION
      // ========================================
      // Ensure all required fields are filled
      if (!form.username || !form.email || !form.password) {
        alert("All fields are required.");
        return;
      }

      // ========================================
      // 🔐 PASSWORD SECURITY
      // ========================================
      // Basic password encoding (replace with proper hashing in production)
      const encodedPassword = btoa(form.password);

      // ========================================
      // 👤 USER OBJECT CREATION
      // ========================================
      // Create new user with sanitized data and default values
      const newUser = {
        username: sanitize(form.username),              // Sanitized username
        email: sanitize(form.email),                    // Sanitized email
        passwordHash: encodedPassword,                  // Encoded password
        loggedIn: true,                                 // Authentication flag
        resumeUploaded: form.resumeUploaded,           // Resume upload status
        resumeSkills: form.resumeSkills,                // Extracted skills
        careerAnswers: [],                              // Empty career answers
        lessons: [],                                    // Empty lessons array
        skills: [],                                     // Empty skills array
      };

      // ========================================
      // 💾 DATA PERSISTENCE
      // ========================================
      // Update global user context
      setUser(newUser);

      // Encode user data for localStorage to prevent casual tampering
      const encodedData = btoa(JSON.stringify(newUser));
      localStorage.setItem("user", encodedData);

      // Navigate to next onboarding step (career questionnaire)
      navigate("/career");
    } catch (err) {
      // ========================================
      // 🚨 ERROR HANDLING
      // ========================================
      console.error("SecureAI: Account creation failed", err);
      alert("⚠️ Unable to create your account securely. Please retry.");
    }
  };

  // ========================================
  // 🎨 COMPONENT RENDER
  // ========================================
  // Renders the account creation form with proper validation
  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="auth-title">Create Account</h1>
        <form onSubmit={handleSubmit}>
          {/* Username input with validation */}
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={20}
          />
          {/* Email input with validation */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {/* Password input with validation */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />

          {/* Submit button */}
          <button type="submit" className="auth-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
