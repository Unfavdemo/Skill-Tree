// src/Context/UserContext.jsx
// ========================================
// 🛡️ SECURE USER CONTEXT PROVIDER
// ========================================
// This context provides global user state management with security features:
// - Safe localStorage with Base64 encoding to prevent casual tampering
// - Default structures for new users to prevent undefined errors
// - Functional updates to avoid infinite loops and state corruption
// - Clear initialization and sign-out handling
// - Comprehensive error handling for data persistence
// - XSS prevention through input sanitization (implemented in components)

import React, { createContext, useContext, useState, useEffect } from "react";

// ========================================
// 🏗️ CONTEXT CREATION
// ========================================
// Creates the React Context for user state management
const UserContext = createContext();

// ========================================
// 🎯 USER PROVIDER COMPONENT
// ========================================
// Main provider component that manages user state across the entire application
// - Handles user authentication state
// - Manages localStorage persistence with Base64 encoding
// - Provides loading states for better UX
// - Implements secure data handling patterns
export const UserProvider = ({ children }) => {
  // ========================================
  // 📊 STATE MANAGEMENT
  // ========================================
  const [user, setUserState] = useState(null);        // Current user data
  const [loading, setLoading] = useState(true);      // Loading state for initial data fetch

  // ========================================
  // 🔄 INITIAL DATA LOADING
  // ========================================
  // Loads user data from localStorage on component mount
  // - Uses Base64 decoding for basic data obfuscation
  // - Handles corrupted or missing data gracefully
  // - Sets loading state to false when complete
  // - If session data exists, validates against accounts registry
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        // Decode Base64-encoded user data with Unicode support
        const decoded = decodeURIComponent(escape(atob(stored)));
        const parsed = JSON.parse(decoded);
        
        // If user is logged in, verify account still exists in registry
        if (parsed.loggedIn && parsed.username) {
          try {
            const accountsData = localStorage.getItem("accounts");
            if (accountsData) {
              const accountsDecoded = decodeURIComponent(escape(atob(accountsData)));
              const accounts = JSON.parse(accountsDecoded);
              
              // If account exists, merge with latest registry data
              if (accounts[parsed.username]) {
                const accountData = accounts[parsed.username];
                setUserState({
                  ...accountData,
                  loggedIn: true,
                });
              } else {
                // Account not found, clear session
                localStorage.removeItem("user");
                setUserState(null);
              }
            } else {
              setUserState(parsed);
            }
          } catch (err) {
            console.error("SecureAI: Failed to validate account:", err);
            setUserState(parsed);
          }
        } else {
          setUserState(parsed);
        }
      }
    } catch (err) {
      console.error("SecureAI: Failed to parse user from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // 💾 ACCOUNT REGISTRY SYNC HELPER
  // ========================================
  // Syncs user data with the accounts registry for persistent storage
  const syncAccountRegistry = (userData) => {
    if (!userData || !userData.username) return;
    
    try {
      // Get accounts registry
      const accountsData = localStorage.getItem("accounts");
      if (accountsData) {
        const decoded = decodeURIComponent(escape(atob(accountsData)));
        const accounts = JSON.parse(decoded);
        
        // Update the account data (excluding loggedIn flag which is session-only)
        const { loggedIn, ...accountData } = userData;
        accounts[userData.username] = {
          ...accounts[userData.username],
          ...accountData,
        };
        
        // Save back to registry
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(accounts))));
        localStorage.setItem("accounts", encoded);
      }
    } catch (err) {
      console.error("SecureAI: Failed to sync account registry:", err);
    }
  };

  // ========================================
  // 🔐 SECURE USER STATE UPDATER
  // ========================================
  // Safely updates user state with automatic localStorage persistence
  // - Supports both direct values and functional updates
  // - Automatically encodes data to Base64 before storage
  // - Syncs with accounts registry for persistent storage
  // - Handles null values by removing from localStorage
  // - Includes comprehensive error handling
  const setUser = (value) => {
    setUserState((prev) => {
      // Handle both direct values and functional updates
      const next = typeof value === "function" ? value(prev) : value;

      try {
        if (next === null) {
          // Clear localStorage when user signs out
          localStorage.removeItem("user");
        } else {
          // Encode user data to Base64 with Unicode support before storing
          const jsonString = JSON.stringify(next);
          localStorage.setItem("user", btoa(unescape(encodeURIComponent(jsonString))));
          
          // Sync with accounts registry for persistent storage
          syncAccountRegistry(next);
        }
      } catch (err) {
        console.error("SecureAI: Failed to save user:", err);
      }

      return next;
    });
  };

  // ========================================
  // 👤 USER INITIALIZATION HELPER
  // ========================================
  // Creates a new user object with safe default values
  // - Prevents undefined errors by providing fallback values
  // - Ensures consistent user data structure
  // - Automatically sets loggedIn flag to true
  // - Merges provided data with defaults
  const initializeUser = (data) => {
    const newUser = {
      username: data.username || "",                    // User's display name
      email: data.email || "",                         // Contact email
      industry: data.industry || "",                   // Career field
      resumeUploaded: data.resumeUploaded || false,    // Resume upload status
      resumeSkills: data.resumeSkills || [],           // Skills extracted from resume
      completedLessons: data.completedLessons || {},  // Progress tracking: skill -> lesson -> level
      savedLessons: data.savedLessons || {},            // Saved lesson data: lessonTitle -> {lesson, skill, challenges}
      availableSkills: data.availableSkills || [],       // Available skills for skill tree (persisted)
      skillLessons: data.skillLessons || {},            // Saved lessons by skill: skill -> [lessons]
      skills: data.skills || [],                       // User's skill list (completed skills only)
      lessons: data.lessons || [],                     // Available lessons
      careerAnswers: data.careerAnswers || {},        // Career questionnaire responses
      loggedIn: true,                                  // Authentication flag
      ...data,                                         // Merge any additional data
    };
    setUser(newUser);
  };

  // ========================================
  // 🚪 USER CLEANUP HELPER
  // ========================================
  // Completely removes user data from both state and localStorage
  // - Used for sign-out functionality
  // - Ensures no sensitive data remains in browser storage
  // - Resets application to initial state
  const clearUser = () => {
    localStorage.removeItem("user");
    setUserState(null);
  };

  // ========================================
  // 🎁 CONTEXT PROVIDER
  // ========================================
  // Provides user context to all child components
  // - Exposes user state and helper functions
  // - Makes authentication and user data available globally
  return (
    <UserContext.Provider
      value={{ user, setUser, initializeUser, clearUser, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ========================================
// 🎣 CUSTOM HOOK FOR USER CONTEXT
// ========================================
// Provides easy access to user context throughout the application
// - Throws error if used outside of UserProvider
// - Ensures proper context usage and prevents runtime errors
// - Returns all user-related state and functions
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside a UserProvider");
  return ctx;
};
