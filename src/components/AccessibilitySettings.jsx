// src/components/AccessibilitySettings.jsx
// ========================================
// ♿ ACCESSIBILITY SETTINGS COMPONENT
// ========================================
// Comprehensive accessibility settings page with:
// - Visual needs (high contrast)
// - Motor control (large touch targets)
// - Cognitive support (simplified navigation, clear layouts)

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "../Context/AccessibilityContext";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";

const sanitize = (value) => DOMPurify.sanitize(value);

export default function AccessibilitySettings() {
  const navigate = useNavigate();
  const { settings, updateSetting, toggleSetting, resetSettings, announce } = useAccessibility();


  // Setting toggle component
  const SettingToggle = ({ 
    label, 
    description, 
    settingKey, 
    icon,
    disabled = false 
  }) => {
    const handleToggle = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent?.stopImmediatePropagation();
      }
      
      if (disabled) {
        return false;
      }
      
      const newValue = !settings[settingKey];
      toggleSetting(settingKey);
      announce(`${sanitize(label)} ${newValue ? "enabled" : "disabled"}`);
      return false;
    };

    return (
      <motion.div
        className="accessibility-setting-item"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => {
          // Prevent clicks on the container from bubbling
          e.stopPropagation();
        }}
      >
        <div className="setting-content">
          <div className="setting-header">
            <span className="setting-icon" aria-hidden="true">{icon}</span>
            <span className="setting-label" role="text">
              {sanitize(label)}
            </span>
          </div>
          <p className="setting-description">{sanitize(description)}</p>
        </div>
        <div className="setting-control">
          <button
            id={settingKey}
            type="button"
            role="switch"
            aria-checked={settings[settingKey]}
            aria-label={`${sanitize(label)}. Currently ${settings[settingKey] ? "enabled" : "disabled"}`}
            className={`toggle-switch ${settings[settingKey] ? "toggle-switch-on" : "toggle-switch-off"}`}
            onClick={handleToggle}
            disabled={disabled}
            aria-disabled={disabled}
          >
            <span className="toggle-slider" aria-hidden="true"></span>
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="accessibility-settings" role="main" aria-label="Accessibility settings">
      <motion.div
        className="accessibility-settings-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <header className="accessibility-header">
          <div className="accessibility-header-top">
            <button
              onClick={() => navigate("/profile")}
              className="accessibility-btn accessibility-btn-back"
              type="button"
              aria-label="Return to profile page"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate("/profile");
                }
              }}
            >
              ← Back to Profile
            </button>
          </div>
          <h1 className="accessibility-title">
            <span aria-hidden="true">♿</span> Accessibility Settings
          </h1>
          <p className="accessibility-subtitle">
            Customize your experience to meet your needs. These settings help make SkillTree accessible to everyone.
          </p>
        </header>

        {/* Visual Needs Section */}
        <section className="accessibility-section" aria-labelledby="visual-needs-heading">
          <h2 id="visual-needs-heading" className="section-title">
            <span aria-hidden="true">👁️</span> Visual Needs
          </h2>
          <div className="settings-grid">
            <SettingToggle
              label="High Contrast Mode"
              description="Increase contrast between text and backgrounds for better visibility"
              settingKey="highContrastMode"
              icon="🎨"
            />
            <SettingToggle
              label="Reduced Motion"
              description="Reduce animations and transitions for a calmer experience"
              settingKey="reducedMotion"
              icon="⏸️"
            />
          </div>
        </section>

        {/* Motor Control Section */}
        <section className="accessibility-section" aria-labelledby="motor-needs-heading">
          <h2 id="motor-needs-heading" className="section-title">
            <span aria-hidden="true">🖱️</span> Motor Control
          </h2>
          <div className="settings-grid">
            <SettingToggle
              label="Large Touch Targets"
              description="Increase button and interactive element sizes for easier interaction"
              settingKey="largeTouchTargets"
              icon="👆"
            />
            <SettingToggle
              label="Keyboard Navigation"
              description="Enhanced keyboard navigation support (always enabled)"
              settingKey="keyboardNavigation"
              icon="⌨️"
              disabled={true}
            />
          </div>
        </section>

        {/* Cognitive Support Section */}
        <section className="accessibility-section" aria-labelledby="cognitive-needs-heading">
          <h2 id="cognitive-needs-heading" className="section-title">
            <span aria-hidden="true">🧠</span> Cognitive Support
          </h2>
          <div className="settings-grid">
            <SettingToggle
              label="Simplified Navigation"
              description="Show a simplified navigation menu with fewer options"
              settingKey="simplifiedNavigation"
              icon="🧭"
            />
            <SettingToggle
              label="Clear Layouts"
              description="Use clear, uncluttered layouts with better spacing"
              settingKey="clearLayouts"
              icon="📐"
            />
            <SettingToggle
              label="Reduce Animations"
              description="Minimize animations throughout the app"
              settingKey="reduceAnimations"
              icon="🎬"
            />
          </div>
        </section>

        {/* Actions */}
        <section className="accessibility-actions">
          <button
            type="button"
            className="accessibility-btn accessibility-btn-secondary"
            onClick={() => {
              resetSettings();
              announce("All accessibility settings have been reset to defaults");
            }}
            aria-label="Reset all accessibility settings to defaults"
          >
            Reset to Defaults
          </button>
        </section>

        {/* Information */}
        <section className="accessibility-info" role="complementary" aria-label="Accessibility information">
          <h3 className="info-title">Need More Help?</h3>
          <p className="info-text">
            Many of these features can also be configured in your device's system accessibility settings.
            On Windows: Settings → Accessibility
            On Mac: System Preferences → Accessibility
            On iOS/Android: Settings → Accessibility
          </p>
        </section>
      </motion.div>
    </div>
  );
}

