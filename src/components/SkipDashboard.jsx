// src/components/SkipDashboard.jsx
// ========================================
// ⏭️ SKIP DASHBOARD COMPONENT
// ========================================
// This component provides an alternative dashboard for users who skipped resume upload
// - Renders SkillDashboard with special props for skipped users
// - Shows additional UI elements like upload buttons
// - Provides a different user experience for users without resume data
// - Maintains the same core functionality as the main dashboard

import React from "react";
import SkillDashboard from "./SkillDashboard";

// ========================================
// 🎯 SKIP DASHBOARD WRAPPER COMPONENT
// ========================================
// Renders SkillDashboard with special configuration for users who skipped resume upload
const SkipDashboard = () => {
  return (
    <SkillDashboard 
      showResumeSkipped={true}    // Indicates user skipped resume upload
      showUploadButton={true}     // Shows option to upload resume later
    />
  );
};

export default SkipDashboard;
