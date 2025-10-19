import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserState(parsed);
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Safe setter (no infinite loops)
  const setUser = (value) => {
    setUserState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;

      try {
        if (next === null) {
          localStorage.removeItem("user");
        } else {
          localStorage.setItem("user", JSON.stringify(next));
        }
      } catch (err) {
        console.error("Failed to save user:", err);
      }

      return next;
    });
  };

  // ✅ Initialize empty structure for new users
  const initializeUser = (data) => {
    const newUser = {
      name: data.name || "",
      email: data.email || "",
      industry: data.industry || "", // <– new field for industry selection
      completedLessons: data.completedLessons || {}, // skill-based tracking
      ...data,
    };
    setUser(newUser);
  };

  // ✅ Reset user data (e.g., on sign-out)
  const clearUser = () => {
    localStorage.removeItem("user");
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, initializeUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside a UserProvider");
  return ctx;
};
