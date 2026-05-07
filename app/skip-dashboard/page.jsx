"use client";

import SkipDashboard from "@/components/SkipDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SkipDashboardPage() {
  return (
    <ProtectedRoute>
      <SkipDashboard />
    </ProtectedRoute>
  );
}
