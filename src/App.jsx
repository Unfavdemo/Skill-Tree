// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Import your pages
import SignIn from "./components/SignIn";
import CreateAccount from "./components/CreateAccount";
import Upload from "./components/Upload";
import Dashboard from "./components/Dashboard";
import Career from "./components/Career";
import SkipDashboard from "./components/SkipDashboard"; 
import LessonPage from "./components/LessonPage";
import { UserProvider } from './Context/UserContext';

const App = () => {
  return (
    <UserProvider>
      <Routes>
        {/* Auth pages */}
        <Route path="/" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />

        {/* Career and upload flow */}
        <Route path="/quiz" element={<Career />} />
        <Route path="/upload" element={<Upload />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skip-dashboard" element={<SkipDashboard />} />

        {/* AI Lesson Pages */}
        <Route path="/lesson/:id" element={<LessonPage />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
