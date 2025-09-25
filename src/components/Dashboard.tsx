import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const latestSkills = [
  'Component Architecture',
  'State Management',
  'Event Handling',
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Profile at the top */}
      <header className="profile-pic-section">
        <div className="profile-pic">👤</div>
        <span>
          {username ? `Welcome back, ${username}` : "Welcome back!"}
        </span>
        <div className="status-dot"></div>
        <button
          className="signout-btn"
          onClick={() => {
            localStorage.removeItem("username");
            localStorage.removeItem("userEmail");
            navigate('/');
          }}
        >
          Sign Out
        </button>
      </header>

      {/* Previous lessons on the left */}
      <aside className="sidebar-left">
        <div className="skill-card completed">
          <div className="skill-title">React Basics</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
          <div className="progress-text">✔ 100%</div>
        </div>
        <p className="prev-lesson-label">Previous lesson</p>

        <div className="skill-card completed">
          <div className="skill-title">JavaScript Functions</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
          <div className="progress-text">✔ 100%</div>
        </div>
        <p className="prev-lesson-label">Previous lesson</p>

        <div className="skill-card completed">
          <div className="skill-title">CSS Flexbox</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
          <div className="progress-text">✔ 100%</div>
        </div>
        <p className="prev-lesson-label">Previous lesson</p>
      </aside>

      {/* Skill Tree on the right */}
      <main className="skill-tree-center">
        <div className="tree-header">
          <span>Skill Tree</span>
        </div>

        <div className="tree-visual">
          <div className="tree-level root-level">
            <div className="skill-node root">React</div>
          </div>

          <div className="tree-level">
            <div className="skill-node child">Hooks</div>
            <div className="skill-node child">Routing</div>
          </div>

          <div className="tree-level">
            <div className="skill-node child">useState</div>
            <div className="skill-node child">useEffect</div>
          </div>
        </div>

      </main>

      {/* Latest skills at the bottom */}
      <section className="latest-skills-card">
        <div className="latest-title">
          📈 <span>⭐⭐⭐</span>
        </div>
        <h1 className="section-title">Latest skills learned</h1>

        <ul className="skill-list">
          {latestSkills.map((skill, idx) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>
        <p className="more-skills">+1 more</p>
      </section>
    </div>
  );
};

export default Dashboard;
