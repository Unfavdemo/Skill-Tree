"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "../Context/UserContext";

const Spinner = () => (
  <motion.div
    className="flex items-center justify-center min-h-[40vh] py-16"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div
      className="animate-spin rounded-full h-14 w-14 border-2 border-transparent border-t-[rgba(0,209,255,0.85)] border-r-[rgba(157,0,255,0.35)]"
      role="status"
      aria-label="Loading"
    />
  </motion.div>
);

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();
  const router = useRouter();

  const authed = Boolean(user?.loggedIn);

  useEffect(() => {
    if (loading) return;
    if (!authed) {
      router.replace("/signin");
    }
  }, [loading, authed, router]);

  if (loading) {
    return <Spinner />;
  }

  if (!authed) {
    return null;
  }

  return children;
}
