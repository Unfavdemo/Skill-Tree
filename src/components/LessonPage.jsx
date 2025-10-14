// src/components/LessonPage.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const LessonPage = () => {
  const location = useLocation();
  const lesson = location.state?.lesson;

  if (!lesson) return <p>Lesson not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>
      {/* Add more AI-generated content here if available */}
    </div>
  );
};

export default LessonPage;
