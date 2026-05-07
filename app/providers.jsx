"use client";

import { AccessibilityProvider } from "@/Context/AccessibilityContext";
import { ThemeProvider } from "@/Context/ThemeContext";
import { UserProvider } from "@/Context/UserContext";
import PageTransition from "@/components/PageTransition";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <UserProvider>
          <PageTransition>{children}</PageTransition>
        </UserProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
