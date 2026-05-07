import LessonPage from "@/components/LessonPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <LessonPage />
    </ProtectedRoute>
  );
}
