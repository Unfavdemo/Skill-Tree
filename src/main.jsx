// src/main.jsx
// ========================================
// 🚀 APPLICATION ENTRY POINT
// ========================================
// This is the main entry point for the SkillTree React application
// - Initializes React with React 18's createRoot API
// - Sets up React Router for client-side navigation
// - Renders the main App component with proper providers
// - Enables React StrictMode for development warnings

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";

// ========================================
// 🎯 ROOT RENDERING
// ========================================
// Creates the root element and renders the application
// - Uses React 18's createRoot for better performance
// - Wraps App in BrowserRouter for navigation
// - Enables StrictMode for development debugging
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
