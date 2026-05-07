"use client";

import SkillDashboard from "@/components/SkillDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SkillsDashboardPage() {
  return (
    <ProtectedRoute>
      <SkillDashboard />
    </ProtectedRoute>
  );
}
