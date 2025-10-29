// src/App.jsx
// ========================================
// 🎯 MAIN APPLICATION COMPONENT
// ========================================
// This is the root component that handles:
// - Client-side routing with React Router
// - Protected route authentication
// - Smooth page transitions with Framer Motion
// - Global user state management via Context API
// - Component composition and navigation flow

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { UserProvider, useUser } from "./Context/UserContext";
import { ThemeProvider } from "./Context/ThemeContext";
import { AccessibilityProvider } from "./Context/AccessibilityContext";

// ========================================
// 📦 COMPONENT IMPORTS
// ========================================
// All page components for the application routing system
import HomePage from "./components/HomePage";       // Landing page
import SignIn from "./components/SignIn";           // Authentication entry point
import CreateAccount from "./components/CreateAccount"; // User registration
import Upload from "./components/Upload";          // Resume upload (optional)
import Dashboard from "./components/Dashboard";    // Main skill tree interface
import Career from "./components/Career";          // Career questionnaire
import SkipDashboard from "./components/SkipDashboard"; // Alternative dashboard
import LessonPage from "./components/LessonPage";  // Individual lesson interface
import SkillDashboard from "./components/SkillDashboard"; // Core skill management
import Profile from "./components/Profile";        // User profile management
import AccessibilitySettings from "./components/AccessibilitySettings"; // Accessibility settings

// ========================================
// 🔄 LOADING SPINNER COMPONENT
// ========================================
// Displays an animated spinner while user data is being loaded
// Uses Framer Motion for smooth fade-in/out transitions
const Spinner = () => (
  <motion.div
    className="flex items-center justify-center h-screen"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 border-b-4 border-gray-300"></div>
  </motion.div>
);

// ========================================
// 🛡️ PROTECTED ROUTE COMPONENT
// ========================================
// Authentication guard that ensures only logged-in users can access protected pages
// - Checks user authentication status from UserContext
// - Shows loading spinner while checking authentication
// - Redirects to sign-in page if user is not authenticated
// - Uses React Router's Navigate component for seamless redirects
function ProtectedRoute({ children }) {
  const { user, loading } = useUser();

  // Show spinner while checking authentication status
  if (loading) return <Spinner />;
  
  // If user exists, render the protected component
  // Otherwise, redirect to sign-in page
  return user ? children : <Navigate to="/signin" replace />;
}

// ========================================
// 🎬 MOTION WRAPPER COMPONENT
// ========================================
// Provides smooth page transition animations using Framer Motion
// - Wraps each page component with consistent animation effects
// - Creates a polished, professional user experience
// - Uses scale and opacity transitions for smooth page changes
const MotionWrapper = ({ children }) => {
  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, scale: 0.98, y: 30 },  // Start state: slightly smaller, transparent, moved down
    in: { opacity: 1, scale: 1, y: 0 },          // End state: full size, opaque, normal position
    out: { opacity: 0, scale: 0.98, y: -30 },   // Exit state: slightly smaller, transparent, moved up
  };

  // Transition configuration for smooth animations
  const pageTransition = { type: "tween", ease: "easeInOut", duration: 0.5 };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

// ========================================
// 🛣️ ANIMATED ROUTES COMPONENT
// ========================================
// Main routing component that defines all application routes
// - Handles both public and protected routes
// - Integrates Framer Motion for smooth page transitions
// - Uses AnimatePresence for exit animations
// - Implements authentication guards for protected content
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ========================================
            🌐 PUBLIC ROUTES (No Authentication Required)
            ======================================== */}
        <Route path="/" element={<MotionWrapper><HomePage /></MotionWrapper>} />
        <Route path="/signin" element={<MotionWrapper><SignIn /></MotionWrapper>} />
        <Route path="/create-account" element={<MotionWrapper><CreateAccount /></MotionWrapper>} />
        <Route path="/upload" element={<MotionWrapper><Upload /></MotionWrapper>} />
        <Route path="/career" element={<MotionWrapper><Career /></MotionWrapper>} />

        {/* ========================================
            🔒 PROTECTED ROUTES (Authentication Required)
            ======================================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MotionWrapper><Dashboard /></MotionWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/skills-dashboard"
          element={
            <ProtectedRoute>
              <MotionWrapper><SkillDashboard /></MotionWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/skip-dashboard"
          element={
            <ProtectedRoute>
              <MotionWrapper><SkipDashboard /></MotionWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:title"
          element={
            <ProtectedRoute>
              <MotionWrapper><LessonPage /></MotionWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MotionWrapper><Profile /></MotionWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/accessibility"
          element={
            <ProtectedRoute>
              <MotionWrapper><AccessibilitySettings /></MotionWrapper>
            </ProtectedRoute>
          }
        />

        {/* ========================================
            🔄 FALLBACK ROUTE
            ======================================== */}
        {/* Redirects any unmatched routes to the homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

// ========================================
// 🚀 MAIN APP COMPONENT
// ========================================
// Root component that initializes the entire application
// - Wraps the app in UserProvider for global state management
// - Renders the AnimatedRoutes component for navigation
// - Provides the foundation for all user interactions and data flow
export default function App() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <UserProvider>
          <AnimatedRoutes />
        </UserProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
