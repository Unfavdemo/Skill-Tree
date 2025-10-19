// src/components/CreateAccount.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

export default function CreateAccount() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    resumeUploaded: false,
    resumeSkills: [], // Placeholder for future parsed skills
  });
  const [resumeFileName, setResumeFileName] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, resumeUploaded: true });
      setResumeFileName(file.name);

      // TODO: optional resume parsing logic here to populate resumeSkills
      // Example:
      // const extractedSkills = parseResume(file);
      // setForm({ ...form, resumeUploaded: true, resumeSkills: extractedSkills });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      username: form.username,
      email: form.email,
      loggedIn: true,
      resumeUploaded: form.resumeUploaded,
      resumeSkills: form.resumeSkills,
      careerAnswers: [],
      lessons: [],
      skills: [],
    };

    // Save user to context + localStorage
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    // ✅ Go straight to Career page
    navigate("/career");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="auth-title">Create Account</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
