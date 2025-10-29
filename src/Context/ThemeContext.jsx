// src/Context/ThemeContext.jsx
// ========================================
// 🌙 THEME CONTEXT PROVIDER
// ========================================
// This context provides theme management (light/dark mode):
// - Dark mode toggle functionality
// - localStorage persistence
// - Applies theme classes to root element

import React, { createContext, useContext, useState, useEffect } from "react";

// ========================================
// 🏗️ CONTEXT CREATION
// ========================================
const ThemeContext = createContext();

// ========================================
// 🎯 THEME PROVIDER COMPONENT
// ========================================
export const ThemeProvider = ({ children }) => {
  // Check for saved theme preference or default to light
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      return saved === "dark";
    } catch {
      return false;
    }
  });

  // Apply theme class to document root on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark-mode");
    } else {
      root.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Save theme preference to localStorage
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      try {
        localStorage.setItem("theme", newTheme ? "dark" : "light");
      } catch (err) {
        console.error("Failed to save theme preference:", err);
      }
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ========================================
// 🎨 USE THEME HOOK
// ========================================
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

