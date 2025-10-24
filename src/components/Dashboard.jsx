// src/components/Dashboard.jsx
// ========================================
// 🏠 MAIN DASHBOARD COMPONENT
// ========================================
// This is a simple wrapper component that renders the SkillDashboard
// - Acts as a routing component for the main dashboard route
// - Delegates all functionality to SkillDashboard component
// - Provides a clean separation between routing and functionality
// - Maintains consistent component structure

import React from "react";
import SkillDashboard from "./SkillDashboard";

// ========================================
// 🎯 DASHBOARD WRAPPER COMPONENT
// ========================================
// Simple wrapper that renders the main skill dashboard interface
const Dashboard = () => {
  return <SkillDashboard />;
};

export default Dashboard;
