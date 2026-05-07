/**
 * Parses localStorage blobs written as Base64+UTF-8 (see UserContext setUser)
 * or legacy / plain JSON strings. Returns null if invalid.
 */
export function parseStoredJson(raw) {
  if (raw == null || raw === "") return null;
  const s = String(raw).trim();
  if (s.startsWith("{") || s.startsWith("[")) {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  }
  try {
    const decoded = decodeURIComponent(escape(atob(s)));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
