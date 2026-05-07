"use client";

/** Small stroke icons so rail actions read clearly without ambiguous Unicode glyphs */

export function IconDashboard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="3" width="7" height="5" rx="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="11" width="7" height="10" rx="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="15" width="7" height="6" rx="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSkillTree(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v4.2M12 8.2c-3.4 0-6.2 2.6-6.2 6.2M12 8.2c3.4 0 6.2 2.6 6.2 6.2M7.2 20h9.6"
      />
      <circle cx="12" cy="4.3" r="2.15" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5.8" cy="15.2" r="2.05" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18.2" cy="15.2" r="2.05" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" {...props}>
      <circle cx="12" cy="8.5" r="3.8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.2 19.5c.8-4.2 4.2-6.7 6.8-6.7s6 2.5 6.8 6.7"
      />
    </svg>
  );
}

/** Accessibility — horizontal sliders */
export function IconAccess(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" {...props}>
      <line x1="3" y1="7" x2="21" y2="7" strokeLinecap="round" />
      <circle cx="14" cy="7" r="2.2" />
      <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
      <circle cx="9" cy="12" r="2.2" />
      <line x1="3" y1="17" x2="21" y2="17" strokeLinecap="round" />
      <circle cx="16" cy="17" r="2.2" />
    </svg>
  );
}

/** Sun (light mode) */
export function IconSun(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" {...props}>
      <circle cx="12" cy="12" r="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5.06 5.06l2.12 2.12m9.74 9.74l2.12 2.12M18.94 5.06l-2.12 2.12M7.06 18.94l-2.12 2.12M5.06 18.94l2.12-2.12M15.94 15.94l2.12 2.12" />
    </svg>
  );
}

/** Moon */
export function IconMoon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.93 13.94a9 9 0 010 .12 8.62 8.62 0 11-11.74-11.94 12.6 12.6 0 005.94 11.82z"
      />
    </svg>
  );
}

/** Survey / form */
export function IconSurvey(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h13M8 12h13M8 17h13" />
      <rect x="3" y="5" width="3" height="3" rx="0.65" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="10.2" width="3" height="3" rx="0.65" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="15.4" width="3" height="3" rx="0.65" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Sign out / door */
export function IconLeave(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.7 21H19a2 2 0 002-2V5a2 2 0 00-2-2h-6.62" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.8 17.92L21 11.93l-6.08-6.04M21 11.93H9.25" />
    </svg>
  );
}
