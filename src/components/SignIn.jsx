import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = () => {
    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("username", username);
      navigate('/quiz');
    }, 1200);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="auth-title">🌳 SkillTree</h1>
        <p className="auth-subtitle">Sign in to continue your journey</p>

        <input
          type="text"
          className="auth-input"
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={signIn} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <a
          onClick={() => navigate('/create-account')}
          className="auth-link"
          style={{ cursor: 'pointer' }}
        >
          Create account
        </a>

        <div className="auth-footer">
          © 2025 SkillTree. Start building your skills today.
        </div>
      </div>
    </div>
  );
};

export default SignIn;
