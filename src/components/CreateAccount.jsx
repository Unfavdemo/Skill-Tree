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
import { useNavigate, Link } from "react-router-dom";
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
  const [error, setError] = useState(""); // Error message state

  // ========================================
  // 🛡️ INPUT SANITIZATION HELPER
  // ========================================
  // Centralized sanitizer for all user inputs to prevent XSS attacks
  const sanitize = (value) => DOMPurify.sanitize(value.trim());

  // ========================================
  // 💾 ACCOUNT REGISTRY HELPERS
  // ========================================
  // Helper functions to manage account storage
  const getAccounts = () => {
    try {
      const accountsData = localStorage.getItem("accounts");
      if (accountsData) {
        const decoded = decodeURIComponent(escape(atob(accountsData)));
        return JSON.parse(decoded);
      }
    } catch (err) {
      console.error("Failed to load accounts:", err);
    }
    return {};
  };

  const saveAccount = (username, accountData) => {
    try {
      const accounts = getAccounts();
      accounts[username] = accountData;
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(accounts))));
      localStorage.setItem("accounts", encoded);
    } catch (err) {
      console.error("Failed to save account:", err);
      throw err;
    }
  };

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
    setError(""); // Clear previous errors

    try {
      // ========================================
      // 🔍 FORM VALIDATION
      // ========================================
      // Ensure all required fields are filled
      if (!form.username || !form.email || !form.password) {
        setError("All fields are required.");
        return;
      }

      const safeUsername = sanitize(form.username);
      const safeEmail = sanitize(form.email);

      // ========================================
      // 🔍 CHECK FOR DUPLICATE USERNAME
      // ========================================
      const accounts = getAccounts();
      if (accounts[safeUsername]) {
        setError("Username already exists. Please choose a different username.");
        return;
      }

      // ========================================
      // 🔐 PASSWORD SECURITY
      // ========================================
      // Basic password encoding with Unicode support (replace with proper hashing in production)
      const encodedPassword = btoa(unescape(encodeURIComponent(form.password)));

      // ========================================
      // 👤 ACCOUNT OBJECT CREATION
      // ========================================
      // Create new account with sanitized data and default values
      const accountData = {
        username: safeUsername,
        email: safeEmail,
        passwordHash: encodedPassword,
        resumeUploaded: form.resumeUploaded,
        resumeSkills: form.resumeSkills,
        careerAnswers: {},
        lessons: [],
        skills: [],
        completedLessons: {},
        savedLessons: {},
        availableSkills: [], // Will be generated after career quiz
        skillLessons: {}, // Lessons saved by skill
      };

      // ========================================
      // 💾 SAVE ACCOUNT TO REGISTRY
      // ========================================
      saveAccount(safeUsername, accountData);

      // ========================================
      // 👤 USER OBJECT CREATION (for current session)
      // ========================================
      // Create user object for current session
      const newUser = {
        ...accountData,
        loggedIn: true, // Authentication flag
      };

      // Update global user context (already handles localStorage with proper encoding)
      setUser(newUser);

      // Navigate to next onboarding step (career questionnaire)
      navigate("/career");
    } catch (err) {
      // ========================================
      // 🚨 ERROR HANDLING
      // ========================================
      console.error("SecureAI: Account creation failed", err);
      setError("⚠️ Unable to create your account. Please try again.");
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

          {/* Error message display */}
          {error && (
            <div className="auth-error" style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#f87171',
              fontSize: '0.9rem',
              textAlign: 'center',
              marginTop: '0.5rem'
            }}>
              {error}
            </div>
          )}
        </form>

        {/* Link back to sign in page */}
        <Link to="/signin" className="auth-link">
          Back to Sign In
        </Link>

        {/* Footer with copyright */}
        <div className="auth-footer">
          © 2025 SkillTree. Start building your skills today.
        </div>
      </div>
    </div>
  );
}
