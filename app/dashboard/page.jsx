"use client";

import SkillDashboard from "@/components/SkillDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <SkillDashboard />
    </ProtectedRoute>
  );
}
