import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { generateLessons } from "../utils/generateLessons";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";

export default function SkillDashboard() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [aiLessons, setAiLessons] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  // Get available skills from saved data - prioritize user.availableSkills if exists
  const getAvailableSkills = () => {
    if (user?.availableSkills && user.availableSkills.length > 0) {
      return user.availableSkills;
    }
    // Fallback to skills from saved lessons
    if (user?.savedLessons && Object.keys(user.savedLessons).length > 0) {
      const skillsFromLessons = new Set();
      Object.values(user.savedLessons).forEach(lessonData => {
        if (lessonData.skill) {
          skillsFromLessons.add(lessonData.skill);
        }
      });
      return Array.from(skillsFromLessons);
    }
    // Include completed skills
    if (user?.skills && user.skills.length > 0) {
      return user.skills;
    }
    return [];
  };
  
  const [availableSkills, setAvailableSkills] = useState(getAvailableSkills);
  const [previousLessons, setPreviousLessons] = useState(user?.completedLessons || {});
  
  // Update available skills and previous lessons when user changes
  useEffect(() => {
    if (!user) return;
    setPreviousLessons(user.completedLessons || {});
    const skills = getAvailableSkills();
    if (skills.length > 0) {
      setAvailableSkills(skills);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.availableSkills, user?.savedLessons, user?.skills]);

  const sanitize = (value) => DOMPurify.sanitize(value);

  // ========================================
  // ✂️ TEXT TRUNCATION HELPER
  // ========================================
  // Truncates long skill names to fit better in skill nodes
  const truncateSkillName = (skillName, maxLength = 12) => {
    if (skillName.length <= maxLength) return skillName;
    // Try to break at word boundaries
    const truncated = skillName.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength / 2) {
      return truncated.substring(0, lastSpace) + "...";
    }
    return truncated + "...";
  };

  useEffect(() => {
    if (!user) return navigate("/"); // redirect if no user
    
    // Only generate if no saved skills exist and user has career answers or resume
    const hasCareerData = (user.careerAnswers && Object.keys(user.careerAnswers).length > 0) || user.resumeText;
    
    if (availableSkills.length > 0 || !hasCareerData) return;

    const generateSkillsOnce = async () => {
      setLoading(true);
      try {
        const lessons = await generateLessons({
          skills: [],
          careerAnswers: user.careerAnswers || {},
          resumeSkills: user.resumeText ? [user.resumeText] : [],
          resumeUploaded: user.resumeUploaded || false,
        });

        const skillTitles = lessons.map((lesson) => sanitize(lesson.title));

        // Save to user.availableSkills for persistence
        setAvailableSkills(skillTitles);
        
        // Save to user object
        setUser((prev) => ({
          ...prev,
          availableSkills: skillTitles,
        }));
      } catch (err) {
        console.error("SecureAI: Failed to generate skills:", err);
      } finally {
        setLoading(false);
      }
    };

    generateSkillsOnce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNodeClick = async (skill) => {
    setSelectedSkill(skill);
    setSelectedLesson(null); // Reset selected lesson when changing skills
    
    // Check if lessons are already saved for this skill
    const savedLessonsForSkill = user?.skillLessons?.[skill];
    if (savedLessonsForSkill && savedLessonsForSkill.length > 0) {
      setAiLessons(savedLessonsForSkill.map(l => ({
        ...l,
        title: sanitize(l.title),
        description: sanitize(l.description),
      })));
      return;
    }
    
    // Generate lessons if not saved
    setLoading(true);
    try {
      const lessons = await generateLessons({
        skills: [skill],
        careerAnswers: user.careerAnswers || {},
        resumeSkills: user.resumeText ? [user.resumeText] : [],
        resumeUploaded: user.resumeUploaded || false,
      });

      const sanitizedLessons = Array.isArray(lessons) ? lessons.map(l => ({
        ...l,
        title: sanitize(l.title),
        description: sanitize(l.description),
      })) : [];

      setAiLessons(sanitizedLessons);
      
      // Save lessons for this skill to user object
      setUser((prev) => ({
        ...prev,
        skillLessons: {
          ...(prev.skillLessons || {}),
          [skill]: sanitizedLessons,
        },
      }));
    } catch (err) {
      console.error("SecureAI: Failed to generate lessons:", err);
      setAiLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson.title);
    navigate(`/lesson/${lesson.title}`, {
      state: { lesson, skill: selectedSkill },
    });
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // ========================================
  // 🌳 TREE LAYOUT CALCULATION
  // ========================================
  // Arranges skills in a tree structure with even spacing
  const getTreePositions = (skills) => {
    if (skills.length === 0) return [];
    
    const positions = [];
    
    // Root node at top center (with padding from edges to account for hover scale)
    if (skills.length > 0) {
      positions.push({
        skill: skills[0],
        x: 50, // Center horizontally (percentage)
        y: 20, // Top level with padding from top edge
        level: 0
      });
    }
    
    if (skills.length === 1) return positions;
    
    // Calculate tree structure - evenly distribute remaining skills
    const remainingSkills = skills.length - 1;
    const levels = Math.ceil(Math.log2(remainingSkills + 1));
    let currentIndex = 1;
    
    for (let level = 1; level <= levels && currentIndex < skills.length; level++) {
      const nodesInLevel = Math.min(Math.pow(2, level), skills.length - currentIndex);
      const levelY = Math.min(80, 20 + (level * 18)); // Even vertical spacing, max 80% from top
      
      // Calculate horizontal positions evenly spread (with padding for hover scale)
      if (nodesInLevel === 1) {
        positions.push({
          skill: skills[currentIndex],
          x: 50,
          y: levelY,
          level: level
        });
        currentIndex++;
      } else {
        // Spread nodes evenly horizontally with padding from edges
        const spacing = 60 / (nodesInLevel - 1); // Use 60% of width (20% margin each side)
        const startX = 20;
        
        for (let i = 0; i < nodesInLevel && currentIndex < skills.length; i++) {
          positions.push({
            skill: skills[currentIndex],
            x: Math.max(20, Math.min(80, startX + (i * spacing))), // Clamp between 20% and 80%
            y: levelY,
            level: level
          });
          currentIndex++;
        }
      }
    }
    
    return positions;
  };

  const treePositions = getTreePositions(availableSkills);

  // Function to draw connections between parent and child nodes
  const getConnections = () => {
    const connections = [];
    
    if (treePositions.length === 0) return connections;
    
    // Connect root to first level
    const rootNode = treePositions.find(p => p.level === 0);
    if (!rootNode) return connections;
    
    const level1Nodes = treePositions.filter(p => p.level === 1);
    level1Nodes.forEach(childNode => {
      connections.push({
        x1: rootNode.x,
        y1: rootNode.y,
        x2: childNode.x,
        y2: childNode.y
      });
    });
    
    // Connect each level's nodes to their parent nodes
    const maxLevel = treePositions.length > 0 ? Math.max(...treePositions.map(p => p.level)) : 0;
    
    for (let level = 2; level <= maxLevel; level++) {
      const parentNodes = treePositions.filter(p => p.level === level - 1);
      const childNodes = treePositions.filter(p => p.level === level);
      
      childNodes.forEach((childNode, childIndex) => {
        // Connect to closest parent or distribute evenly
        const parentIndex = parentNodes.length === 1 
          ? 0 
          : Math.floor((childIndex / childNodes.length) * parentNodes.length);
        const parentNode = parentNodes[Math.min(parentIndex, parentNodes.length - 1)];
        
        connections.push({
          x1: parentNode.x,
          y1: parentNode.y,
          x2: childNode.x,
          y2: childNode.y
        });
      });
    }
    
    return connections;
  };

  const connections = getConnections();

  return (
    <div className="screen skill-dashboard">
      {/* Header */}
      <header className="screen-header flex justify-between items-center" role="banner">
        <div>
          <h1 className="text-2xl font-bold text-purple-400">
            Welcome, {sanitize(user?.username || "Adventurer")} <span aria-label="waving hand">👋</span>
          </h1>
          <p className="text-sm text-gray-300" id="dashboard-description">
            Your skill mastery journey begins here! Click on a skill to get started.
          </p>
        </div>

        <div className="flex items-center dashboard-button-group" role="toolbar" aria-label="User actions">
          <button
            onClick={handleProfileClick}
            className="auth-btn bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
            aria-label="View and edit profile"
            type="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleProfileClick();
              }
            }}
          >
            Profile
          </button>
          <button
            className="auth-btn bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            onClick={handleSignOut}
            aria-label="Sign out of your account"
            type="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSignOut();
              }
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="screen-content skill-content flex gap-6 mt-4 relative" role="main" aria-label="Skill dashboard">
        {/* Loading Overlay */}
        {loading && (
          <div className="dashboard-loader" role="status" aria-live="polite" aria-busy="true">
            <div className="dashboard-loader-content">
              <div className="dashboard-loader-spinner" aria-hidden="true"></div>
              <div className="dashboard-loader-text">
                {selectedSkill ? "✨ Generating lessons..." : "🎯 Generating your personalized skills..."}
              </div>
              <div className="dashboard-loader-subtext" aria-label="Loading status">
                {selectedSkill 
                  ? "AI is creating customized lessons for you..." 
                  : "This may take a few moments..."}
              </div>
            </div>
          </div>
        )}

        {/* Left Sidebar: Skills */}
        <nav className="sidebar-left" aria-label="Skills navigation">
          <h3>Your Skills</h3>
          {availableSkills.length > 0 ? (
            <ul className="space-y-3" role="list">
              {availableSkills.map((skill, i) => (
                <li
                  key={i}
                  role="button"
                  tabIndex={0}
                  className={`skill-sidebar-item p-3 rounded-lg cursor-pointer text-white hover:bg-purple-700/50 transition-all ${
                    selectedSkill === skill ? "bg-purple-700/70" : "bg-purple-900/40"
                  }`}
                  onClick={() => handleNodeClick(skill)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNodeClick(skill);
                    }
                  }}
                  aria-label={`${sanitize(skill)}, mastery level ${previousLessons[skill]?.level || 0}. Click to view lessons.`}
                  aria-pressed={selectedSkill === skill}
                  title={sanitize(skill)}
                >
                  <span className="skill-sidebar-name">{sanitize(skill)}</span>
                  <div className="text-xs text-green-300 mt-1" aria-label={`Mastery level ${previousLessons[skill]?.level || 0}`}>
                    Mastery: {previousLessons[skill]?.level || 0}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">
              {loading
                ? "Generating your personalized skills..."
                : "No skills yet. Upload your resume or complete the questionnaire to start!"}
            </p>
          )}
        </nav>

        {/* Center Skill Map */}
        <div className="skill-tree-center relative flex-1 min-h-[400px]" role="region" aria-label="Skill tree visualization">
          {/* SVG for tree connections */}
          <svg className="tree-connections" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} aria-hidden="true">
            {connections.map((conn, i) => (
              <line
                key={i}
                x1={`${conn.x1}%`}
                y1={`${conn.y1}%`}
                x2={`${conn.x2}%`}
                y2={`${conn.y2}%`}
                stroke="rgba(185, 144, 255, 0.4)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            ))}
          </svg>

          {/* Skill nodes arranged in tree */}
          {treePositions.map((pos, i) => {
            const isSelected = selectedSkill === pos.skill;
            return (
              <motion.div
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => handleNodeClick(pos.skill)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNodeClick(pos.skill);
                  }
                }}
                className={`skill-node ${isSelected ? 'skill-node-selected' : ''}`}
                style={{
                  position: "absolute",
                  top: `${pos.y}%`,
                  left: `${pos.x}%`,
                  zIndex: 2,
                }}
                initial={{ scale: 1, x: "-50%", y: "-50%" }}
                whileHover={{ scale: 1.15, boxShadow: "0 0 20px #d900ff" }}
                animate={{ scale: isSelected ? 1.1 : 1, x: "-50%", y: "-50%" }}
                transition={{ 
                  duration: 0.3, 
                  ease: "easeInOut",
                  scale: { type: "spring", stiffness: 300, damping: 20 }
                }}
                aria-label={`${sanitize(pos.skill)} skill node${isSelected ? ', currently selected' : ''}. Click to view lessons.`}
                aria-pressed={isSelected}
                title={sanitize(pos.skill)}
              >
                <span className="skill-node-text">{sanitize(pos.skill)}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Right Panel: Lessons */}
        <aside className="sidebar-right" aria-label="Lessons list">
          <h3>{selectedSkill ? `${sanitize(selectedSkill)} Lessons` : "Select a Skill"}</h3>
          {selectedSkill ? (
            loading ? (
              <div className="ai-loader" role="status" aria-live="polite" aria-busy="true">
                <div className="ai-loader-spinner" aria-hidden="true"></div>
                <p className="ai-loader-text">✨ Generating lessons...</p>
              </div>
            ) : aiLessons.length > 0 ? (
              <ul className="space-y-3" role="list">
                {aiLessons.map((lesson, i) => {
                  const isSelected = selectedLesson === lesson.title;
                  return (
                    <li
                      key={i}
                      role="button"
                      tabIndex={0}
                      className={`lesson-item p-3 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-purple-700/80 border-2 border-purple-400 shadow-lg shadow-purple-500/50" 
                          : "bg-purple-900/40 hover:bg-purple-700/50 border border-transparent"
                      }`}
                      onClick={() => handleLessonClick(lesson)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleLessonClick(lesson);
                        }
                      }}
                      aria-label={`${sanitize(lesson.title)}. ${sanitize(lesson.description)}${isSelected ? '. Currently selected.' : '. Click to open lesson.'}`}
                      aria-pressed={isSelected}
                    >
                      <strong className="lesson-title block break-words">{sanitize(lesson.title)}</strong>
                      <p className="lesson-description text-sm text-gray-300 mt-1 break-words">{sanitize(lesson.description)}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-400">Click a skill node to reveal lessons.</p>
            )
          ) : (
            <p className="text-gray-400">Select a skill to see lessons here.</p>
          )}
        </aside>
      </main>

      {/* Bottom Boxes */}
      <div className="dashboard-bottom flex gap-6 mt-6">
        {/* Previous Lessons */}
        <div className="bg-purple-900/40 flex-1 p-4 rounded-lg">
          <h4 className="text-purple-300 font-semibold mb-2">
            Previous Lessons
          </h4>
          {user?.savedLessons && Object.keys(user.savedLessons).length > 0 ? (
            <ul className="text-gray-200 space-y-2">
              {Object.entries(user.savedLessons).slice(0, 5).map(([lessonTitle, lessonData]) => {
                const lesson = lessonData.lesson;
                const skill = lessonData.skill;
                const completedData = user.completedLessons?.[skill]?.[lessonTitle];
                const level = completedData?.level || 0;
                
                return (
                  <li 
                    key={lessonTitle}
                    onClick={() => navigate(`/lesson/${encodeURIComponent(lessonTitle)}`, {
                      state: { lesson, skill }
                    })}
                    className="cursor-pointer p-2 rounded hover:bg-purple-800/50 transition-all"
                    style={{
                      border: '1px solid rgba(185, 144, 255, 0.2)'
                    }}
                  >
                    <strong className="text-purple-300">{sanitize(lessonTitle)}</strong>
                    {skill && <span className="text-gray-400 ml-2">• {sanitize(skill)}</span>}
                    {level > 0 && <span className="text-gray-500 ml-2">(Level {level})</span>}
                  </li>
                );
              })}
            </ul>
          ) : Object.keys(previousLessons).length > 0 ? (
            <ul className="text-gray-200 space-y-1">
              {Object.entries(previousLessons).map(([skill, lessons]) => (
                <li key={skill}>
                  <strong>{sanitize(skill)}:</strong>{" "}
                  {Object.entries(lessons)
                    .map(
                      ([lessonName, data]) =>
                        `${sanitize(lessonName)} (Lvl ${data.level || 0})`
                    )
                    .join(", ")}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No lessons completed yet.</p>
          )}
        </div>

        {/* Skills Gained */}
        <div className="bg-purple-900/40 flex-1 p-4 rounded-lg">
          <h4 className="text-purple-300 font-semibold mb-2">Skills Gained</h4>
          {user?.skills && user.skills.length > 0 ? (
            <ul className="text-gray-200 space-y-1">
              {user.skills.map((skill, i) => (
                <li key={i}>{sanitize(skill)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Complete lessons to gain skills here!</p>
          )}
        </div>
      </div>

      {/* Footer XP Tracker */}
      <div className="screen-footer xp-tracker mt-6">
        🧙‍♂️ Level {Math.floor((user?.skills?.length || 0) / 3) + 1} Adventurer • {(user?.skills?.length || 0) * 100} XP
      </div>
    </div>
  );
}
