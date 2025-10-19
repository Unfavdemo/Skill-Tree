import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { UserProvider, useUser } from "./Context/UserContext";

// Components
import SignIn from "./components/SignIn";
import CreateAccount from "./components/CreateAccount";
import Upload from "./components/Upload";
import Dashboard from "./components/Dashboard";
import Career from "./components/Career";
import SkipDashboard from "./components/SkipDashboard";
import LessonPage from "./components/LessonPage"; 
import SkillDashboard from "./components/SkillDashboard";
import Profile from "./components/Profile"; // <-- Added

// ✅ Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) return null; // or a spinner while user loads

  return user ? children : <Navigate to="/" replace />;
}

// ✅ Motion Wrapper
const MotionWrapper = ({ children }) => {
  const pageVariants = {
    initial: { opacity: 0, scale: 0.98, y: 30 },
    in: { opacity: 1, scale: 1, y: 0 },
    out: { opacity: 0, scale: 0.98, y: -30 },
  };

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

// ✅ Animated Routes
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<MotionWrapper><SignIn /></MotionWrapper>} />
        <Route path="/create-account" element={<MotionWrapper><CreateAccount /></MotionWrapper>} />
        <Route path="/upload" element={<MotionWrapper><Upload /></MotionWrapper>} />
        <Route path="/career" element={<MotionWrapper><Career /></MotionWrapper>} />

        {/* Protected Routes */}
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
          path="/profile" // <-- Added route
          element={
            <ProtectedRoute>
              <MotionWrapper><Profile /></MotionWrapper>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

// ✅ Main App
export default function App() {
  return (
    <UserProvider>
        <AnimatedRoutes />
    </UserProvider>
  );
}
