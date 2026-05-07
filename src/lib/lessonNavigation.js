const KEY = "skilltree-lesson-nav";

export function setLessonNavigationState(data) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore quota / private mode */
  }
}

/** Read and remove one-shot navigation payload (React Router `location.state` replacement). */
export function consumeLessonNavigationState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
