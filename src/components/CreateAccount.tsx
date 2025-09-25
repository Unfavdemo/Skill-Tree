import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccount: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!username || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Account created successfully!');
      // ✅ store username + email
      localStorage.setItem("username", username);
      localStorage.setItem("userEmail", email);
      navigate('/quiz'); // ✅ go straight to questionnaire
    }, 1500);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="auth-title">🌱 Create Account</h1>
        <p className="auth-subtitle">Join SkillTree and start your journey</p>

        <input
          type="text"
          className="auth-input"
          placeholder="Choose a username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="email"
          className="auth-input"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <a
          onClick={() => navigate('/')}
          className="auth-link"
          style={{ cursor: 'pointer' }}
        >
          Already have an account? Sign In
        </a>

        <div className="auth-footer">
          © 2025 SkillTree. Start building your skills today.
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
