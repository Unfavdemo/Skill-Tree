// src/Context/AccessibilityContext.jsx
// ========================================
// ♿ ACCESSIBILITY CONTEXT PROVIDER
// ========================================
// This context provides comprehensive accessibility features:
// - Screen reader support settings
// - High contrast mode
// - Larger touch targets
// - Voice commands
// - Simplified navigation
// - Captions and transcriptions (for future media)
// - localStorage persistence

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ========================================
// 🏗️ CONTEXT CREATION
// ========================================
const AccessibilityContext = createContext();

/** Stable defaults (module scope) so SSR and first client render stay identical */
const DEFAULT_ACCESSIBILITY_SETTINGS = {
  screenReaderAnnouncements: true,
  highContrastMode: false,
  reducedMotion: false,
  largeTouchTargets: false,
  voiceCommandsEnabled: false,
  keyboardNavigation: true,
  simplifiedNavigation: false,
  clearLayouts: true,
  reduceAnimations: false,
};

// ========================================
// 🎯 ACCESSIBILITY PROVIDER COMPONENT
// ========================================
export const AccessibilityProvider = ({ children }) => {
  // Screen reader announcement state
  const [announcement, setAnnouncement] = useState("");
  const [announcementPriority, setAnnouncementPriority] = useState("polite");

  // Match SSR on first paint; merge localStorage after mount (fixes React hydration #418)
  const [settings, setSettings] = useState(DEFAULT_ACCESSIBILITY_SETTINGS);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("accessibilitySettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_ACCESSIBILITY_SETTINGS, ...parsed });
      }
    } catch (err) {
      console.error("Failed to load accessibility settings:", err);
    }
    setHasHydrated(true);
  }, []);

  // Save settings after initial load so we don't overwrite storage with defaults before read completes
  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
    } catch (err) {
      console.error("Failed to save accessibility settings:", err);
    }
  }, [settings, hasHydrated]);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;

    // High contrast mode
    if (settings.highContrastMode) {
      root.classList.add("high-contrast-mode");
    } else {
      root.classList.remove("high-contrast-mode");
    }

    // Large touch targets
    if (settings.largeTouchTargets) {
      root.classList.add("large-touch-targets");
    } else {
      root.classList.remove("large-touch-targets");
    }

    // Simplified navigation
    if (settings.simplifiedNavigation) {
      root.classList.add("simplified-navigation");
    } else {
      root.classList.remove("simplified-navigation");
    }

    // Reduced motion
    if (settings.reducedMotion || settings.reduceAnimations) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }

    // Clear layouts
    if (settings.clearLayouts) {
      root.classList.add("clear-layouts");
    } else {
      root.classList.remove("clear-layouts");
    }
  }, [settings]);

  // Screen reader announcement function
  const announce = useCallback(
    (message, priority = "polite") => {
      if (!settings.screenReaderAnnouncements || !message) {
        return;
      }

      // Set priority first
      setAnnouncementPriority(priority);

      // Clear first to trigger a change, then set new message
      // This two-step process (clear then set) is more reliable for screen readers
      setAnnouncement("");

      // Use requestAnimationFrame to ensure the clear happens, then set the message
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnnouncement(message);
        });
      });

      // Clear the announcement after it's been read (3 seconds should be enough)
      setTimeout(() => {
        setAnnouncement("");
      }, 3000);
    },
    [settings.screenReaderAnnouncements]
  );

  // Update a specific setting
  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset all settings to defaults
  const resetSettings = () => {
    setSettings({ ...DEFAULT_ACCESSIBILITY_SETTINGS });
  };

  // Toggle a setting
  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        toggleSetting,
        resetSettings,
        announce,
      }}
    >
      {children}
      {/* Screen reader announcement region - must be in React tree for proper updates */}
      <div
        id="sr-announcement-region"
        role="status"
        aria-live={announcementPriority}
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
};

// ========================================
// 🎨 USE ACCESSIBILITY HOOK
// ========================================
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
};
