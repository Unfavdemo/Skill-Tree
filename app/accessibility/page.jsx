import AccessibilitySettings from "@/components/AccessibilitySettings";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <AccessibilitySettings />
    </ProtectedRoute>
  );
}
