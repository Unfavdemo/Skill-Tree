"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/Context/UserContext";
import { useTheme } from "@/Context/ThemeContext";
import { useAccessibility } from "@/Context/AccessibilityContext";
import {
  IconAccess,
  IconDashboard,
  IconLeave,
  IconMoon,
  IconSkillTree,
  IconSun,
  IconSurvey,
  IconUser,
} from "@/components/SidebarNavIcons";

const SURVEY_URL = "https://forms.gle/rhGhw52FcSNx3t9o9";

function getLevelTitle(level) {
  if (level >= 15) return "Architect";
  if (level >= 10) return "Senior Builder";
  if (level >= 6) return "Creative Engineer";
  if (level >= 3) return "Student Developer";
  return "Explorer";
}

function computeXp(user) {
  const skillsCount = user?.skills?.length || 0;
  return skillsCount * 100;
}

function computeLevel(user) {
  const skillsCount = user?.skills?.length || 0;
  return Math.floor(skillsCount / 3) + 1;
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const { announce } = useAccessibility();

  const isAuthed = Boolean(user?.loggedIn);
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/signin" ||
    pathname === "/create-account" ||
    pathname === "/career" ||
    pathname === "/upload";

  const xp = useMemo(() => computeXp(user), [user]);
  const level = useMemo(() => computeLevel(user), [user]);
  const title = useMemo(() => getLevelTitle(level), [level]);

  const username = user?.username || "Demo";

  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem("user");
    } catch {
      // ignore
    }
    router.push("/");
  };

  const openSurvey = () => {
    window.open(SURVEY_URL, "_blank", "noopener,noreferrer");
    announce("Opening survey in a new tab");
  };

  // Public routes should not show the signed-in chrome.
  if (!isAuthed && isPublicRoute) {
    if (pathname === "/") {
      return (
        <div className="public-shell public-landing-shell">
          <header className="public-nav" role="banner">
            <div className="public-nav-inner">
              <Link href="/" className="public-brand" aria-label="SkillTree Home">
                <span className="brand-orb" aria-hidden="true">
                  <span className="brand-letter">L</span>
                </span>
                <span className="public-brand-name">SkillTree</span>
              </Link>

              <div className="public-nav-actions" role="toolbar" aria-label="Public actions">
                <a
                  className="btn btn-secondary"
                  href="https://job-buster-final-git-main-yaras-projects-cfce906a.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  JobBuster
                </a>
                <Link className="btn btn-secondary" href="/signin">
                  Sign In
                </Link>
                <Link className="btn btn-primary" href="/create-account">
                  Get Started
                </Link>
              </div>
            </div>
          </header>
          <main className="public-main" role="main">
            {children}
          </main>
        </div>
      );
    }

    return <div className="public-shell">{children}</div>;
  }

  const isDashboardShell =
    pathname === "/dashboard" ||
    pathname === "/skills-dashboard" ||
    pathname === "/skip-dashboard";

  const navItems = [
    { key: "dashboard", label: "Dashboard", shortLabel: "Dashboard", href: "/dashboard", Icon: IconDashboard },
    {
      key: "skill-tree",
      label: "Skill Tree",
      shortLabel: "Skill tree",
      href: "/skills-dashboard",
      Icon: IconSkillTree,
    },
    { key: "profile", label: "Profile", shortLabel: "Profile", href: "/profile", Icon: IconUser },
    {
      key: "settings",
      label: "Accessibility & display settings",
      shortLabel: "Access",
      href: "/accessibility",
      Icon: IconAccess,
    },
  ];

  return (
    <div className={`app-shell ${isDashboardShell ? "app-shell--dashboard" : ""}`}>
      <a className="skip-to-main app-skip-link" href="#app-main">
        Skip to main content
      </a>

      <div className={`app-frame ${isDashboardShell ? "" : "app-frame--no-sidebar"}`}>
        {isDashboardShell ? (
          <aside className="app-sidebar" aria-label="Primary navigation">
            <Link href="/dashboard" className="sidebar-brand" aria-label="SkillTree Dashboard">
              <span className="brand-orb" aria-hidden="true">
                <span className="brand-letter">L</span>
              </span>
            </Link>

            <nav className="sidebar-nav" aria-label="Sections">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                const NavIcon = item.Icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`nav-icon-btn ${isActive ? "is-active" : ""}`}
                    onClick={() => router.push(item.href)}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    title={item.label}
                  >
                    <span className="nav-icon-slot" aria-hidden="true">
                      <NavIcon className="nav-icon-svg" width={22} height={22} />
                    </span>
                    <span className="nav-label" aria-hidden="true">
                      {item.shortLabel}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="sidebar-bottom" aria-label="User utilities">
              <div
                className="sidebar-user"
                title={`${username} · L${level} ${title} · ${xp} XP`}
              >
                <div className="user-avatar" aria-hidden="true" />
                <div className="sidebar-user-meta">
                  <div className="sidebar-user-name">{username}</div>
                  <div className="sidebar-user-sub">
                    L{level} {title} · {xp} XP
                  </div>
                </div>
              </div>

              <div className="sidebar-actions" role="toolbar" aria-label="Utilities">
                <button
                  type="button"
                  className="sidebar-action-btn"
                  onClick={toggleTheme}
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  title={isDarkMode ? "Light mode" : "Dark mode"}
                >
                  <span className="sidebar-action-visual" aria-hidden="true">
                    {isDarkMode ? <IconSun width={18} height={18} /> : <IconMoon width={18} height={18} />}
                  </span>
                  <span className="sidebar-action-caption" aria-hidden="true">
                    Theme
                  </span>
                </button>
                <button
                  type="button"
                  className="sidebar-action-btn"
                  onClick={openSurvey}
                  aria-label="Take survey"
                  title="Open feedback survey"
                >
                  <span className="sidebar-action-visual" aria-hidden="true">
                    <IconSurvey width={18} height={18} />
                  </span>
                  <span className="sidebar-action-caption" aria-hidden="true">
                    Survey
                  </span>
                </button>
                {pathname !== "/skills-dashboard" ? (
                  <button
                    type="button"
                    className="sidebar-action-btn"
                    onClick={signOut}
                    aria-label="Sign out"
                    title="Sign out"
                  >
                    <span className="sidebar-action-visual" aria-hidden="true">
                      <IconLeave width={18} height={18} />
                    </span>
                    <span className="sidebar-action-caption" aria-hidden="true">
                      Log out
                    </span>
                  </button>
                ) : null}
              </div>
            </div>
          </aside>
        ) : null}

        <main id="app-main" className="app-stage" role="main">
          <div className="workspace">
            <div className="workspace-panel">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

