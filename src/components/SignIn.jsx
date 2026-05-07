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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../Context/UserContext";
import { parseStoredJson } from "../lib/parseStoredJson";
import DOMPurify from "isomorphic-dompurify";

const SignIn = () => {
  // ========================================
  // 🎯 HOOKS AND STATE MANAGEMENT
  // ========================================
  const [username, setUsername] = useState(""); // User's username input
  const [password, setPassword] = useState(""); // User's password input
  const [loading, setLoading] = useState(false); // Loading state for authentication
  const [error, setError] = useState(""); // Error message state
  const { setUser } = useUser(); // Access to global user context
  const router = useRouter();

  // ========================================
  // 🛡️ INPUT SANITIZATION HELPER
  // ========================================
  // Centralized sanitizer for all user inputs to prevent XSS attacks
  const sanitize = (value) => DOMPurify.sanitize(value.trim());

  // ========================================
  // 💾 ACCOUNT REGISTRY HELPERS
  // ========================================
  // Helper function to get accounts from storage
  const getAccounts = () => {
    try {
      const accountsData = localStorage.getItem("accounts");
      if (accountsData) {
        const parsed = parseStoredJson(accountsData);
        if (parsed != null && typeof parsed === "object") return parsed;
      }
    } catch (err) {
      console.error("Failed to load accounts:", err);
    }
    return {};
  };

  // ========================================
  // 🚀 AUTHENTICATION HANDLER
  // ========================================
  // Handles user sign-in with proper authentication
  // - Sanitizes all input data
  // - Validates required fields
  // - Checks if account exists
  // - Verifies password
  // - Loads user data and navigates on success
  // - Shows error messages for failures
  const signIn = () => {
    // ========================================
    // 🔍 INPUT VALIDATION
    // ========================================
    // Sanitize user inputs to prevent XSS attacks
    const safeUsername = sanitize(username);
    const safePassword = sanitize(password);

    // Clear previous errors
    setError("");

    // Ensure all required fields are filled
    if (!safeUsername || !safePassword) {
      setError("Please fill in all fields");
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
      // 💾 ACCOUNT LOOKUP
      // ========================================
      // Get accounts from registry
      const accounts = getAccounts();
      const account = accounts[safeUsername];

      // ========================================
      // 🔐 ACCOUNT VALIDATION
      // ========================================
      // Check if account exists
      if (!account) {
        setError("Account not found. Please create an account first.");
        return;
      }

      // ========================================
      // 🔐 PASSWORD VERIFICATION
      // ========================================
      // Encode provided password to compare with stored hash
      const encodedPassword = btoa(unescape(encodeURIComponent(safePassword)));

      // Verify password matches
      if (account.passwordHash !== encodedPassword) {
        setError("Incorrect password. Please try again.");
        return;
      }

      // ========================================
      // ✅ AUTHENTICATION SUCCESS
      // ========================================
      // Create user object for current session with all account data
      const user = {
        ...account,
        loggedIn: true, // Authentication flag
      };

      // ========================================
      // 🔐 SECURE DATA PERSISTENCE
      // ========================================
      // Save user to context (handles localStorage with proper encoding)
      setUser(user);

      // Navigate to dashboard after successful authentication
      router.push("/dashboard");
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
          onChange={(e) => setUsername(sanitize(e.target.value))}
        />

        {/* Password input with sanitization */}
        <input
          type="password"
          className="auth-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(sanitize(e.target.value))}
        />

        {/* Sign-in button with loading state */}
        <button className="auth-btn" onClick={signIn} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Error message display */}
        {error && (
          <div
            className="auth-error"
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              color: "#f87171",
              fontSize: "0.9rem",
              textAlign: "center",
              marginTop: "0.5rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Link to create account page */}
        <Link href="/create-account" className="auth-link">
          Create account
        </Link>

        {/* Footer with copyright */}
        <div className="auth-footer">© 2025 SkillTree. Start building your skills today.</div>
      </div>
    </div>
  );
};

export default SignIn;
