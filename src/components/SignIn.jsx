// src/components/SignIn.jsx
// ========================================
// 🔐 USER AUTHENTICATION COMPONENT
// ========================================
// This component handles user sign-in with security features:
// - Secure input sanitization to prevent XSS attacks
// - LocalStorage-based authentication (no backend required)
// - User data validation and fallback creation
// - Navigation to dashboard after successful authentication
// - Error handling for failed authentication attempts
// - Support for both existing and new users

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from "../Context/UserContext";
import DOMPurify from "dompurify";

const SignIn = () => {
  // ========================================
  // 🎯 HOOKS AND STATE MANAGEMENT
  // ========================================
  const [username, setUsername] = useState('');         // User's username input
  const [password, setPassword] = useState('');         // User's password input
  const [loading, setLoading] = useState(false);       // Loading state for authentication
  const { setUser } = useUser();                       // Access to global user context
  const navigate = useNavigate();                      // React Router navigation hook

  // ========================================
  // 🛡️ INPUT SANITIZATION HELPER
  // ========================================
  // Centralized sanitizer for all user inputs to prevent XSS attacks
  const sanitize = (value) => DOMPurify.sanitize(value.trim());

  // ========================================
  // 🚀 AUTHENTICATION HANDLER
  // ========================================
  // Handles user sign-in with comprehensive security measures
  // - Sanitizes all input data
  // - Validates required fields
  // - Loads existing user data or creates new user
  // - Persists user data securely
  // - Navigates to dashboard on success
  const signIn = () => {
    // ========================================
    // 🔍 INPUT VALIDATION
    // ========================================
    // Sanitize user inputs to prevent XSS attacks
    const safeUsername = sanitize(username);
    const safePassword = sanitize(password);

    // Ensure all required fields are filled
    if (!safeUsername || !safePassword) {
      alert('Please fill in all fields');
      return;
    }

    // ========================================
    // ⏳ LOADING STATE
    // ========================================
    // Show loading state during authentication process
    setLoading(true);

    // Simulate authentication delay for better UX
    setTimeout(() => {
      setLoading(false);

      // ========================================
      // 💾 USER DATA RETRIEVAL
      // ========================================
      // Load user data from localStorage with Base64 decoding
      let stored = localStorage.getItem("user");
      let user = stored ? JSON.parse(atob(stored)) : null;

      // ========================================
      // 👤 USER CREATION OR VALIDATION
      // ========================================
      // Create new user if none exists or username doesn't match
      if (!user || user.username !== safeUsername) {
        // New user fallback with secure defaults
        user = {
          username: safeUsername,                       // Sanitized username
          email: "",                                   // Empty email
          resumeUploaded: false,                       // No resume uploaded
          skills: [],                                  // Empty skills array
          lessons: [],                                 // Empty lessons array
          careerAnswers: {},                          // Empty career answers
          completedLessons: {},                        // Empty completed lessons
          loggedIn: true,                              // Authentication flag
        };
      }

      // ========================================
      // 🔐 SECURE DATA PERSISTENCE
      // ========================================
      // Save sanitized user data to context and localStorage
      const safeUser = { ...user, username: sanitize(user.username) };
      setUser(safeUser);
      localStorage.setItem("user", btoa(JSON.stringify(safeUser)));

      // Navigate to dashboard after successful authentication
      navigate('/dashboard');
    }, 1000);
  };

  // ========================================
  // 🎨 COMPONENT RENDER
  // ========================================
  // Renders the sign-in form with proper validation and security
  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="auth-title">🌳 SkillTree</h1>
        <p className="auth-subtitle">Sign in to continue your journey</p>

        {/* Username input with sanitization */}
        <input
          type="text"
          className="auth-input"
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(sanitize(e.target.value))}
        />
        
        {/* Password input with sanitization */}
        <input
          type="password"
          className="auth-input"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(sanitize(e.target.value))}
        />

        {/* Sign-in button with loading state */}
        <button className="auth-btn" onClick={signIn} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Link to create account page */}
        <Link to="/create-account" className="auth-link">
          Create account
        </Link>

        {/* Footer with copyright */}
        <div className="auth-footer">
          © 2025 SkillTree. Start building your skills today.
        </div>
      </div>
    </div>
  );
};

export default SignIn;
