import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn.jsx';
import Dashboard from './components/Dashboard.jsx';
import Upload from './components/Upload.jsx';
import Career from './components/Career.jsx';
import CreateAccount from './components/CreateAccount.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/quiz" element={<Career />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
