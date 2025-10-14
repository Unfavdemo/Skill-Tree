// src/Context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);

  // load from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUserState(JSON.parse(raw));
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
    }
  }, []);

  // wrapped setter keeps localStorage and state in sync, supports functional updates
  const setUser = (value) => {
    if (typeof value === "function") {
      setUserState((prev) => {
        const next = value(prev);
        try {
          if (next === null) localStorage.removeItem("user");
          else localStorage.setItem("user", JSON.stringify(next));
        } catch (err) {
          console.error("Failed to persist user", err);
        }
        return next;
      });
    } else {
      try {
        if (value === null) localStorage.removeItem("user");
        else localStorage.setItem("user", JSON.stringify(value));
      } catch (err) {
        console.error("Failed to persist user", err);
      }
      setUserState(value);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside a UserProvider");
  }
  return ctx;
};
