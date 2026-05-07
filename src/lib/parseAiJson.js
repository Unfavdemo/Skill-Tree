/**
 * Extract JSON written by chat models: may include markdown fences, prose, or truncated output.
 */

function stripFirstCodeFence(text) {
  const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return m ? m[1].trim() : text;
}

/**
 * @returns {unknown[] | null}
 */
export function parseJsonArrayFromContent(rawContent) {
  if (rawContent == null) return null;
  let text = String(rawContent).trim();
  if (!text) return null;

  text = stripFirstCodeFence(text);

  const tryParseArray = (s) => {
    if (!s || typeof s !== "string") return null;
    try {
      const v = JSON.parse(s.trim());
      return Array.isArray(v) ? v : null;
    } catch {
      return null;
    }
  };

  let parsed = tryParseArray(text);
  if (parsed) return parsed;

  const start = text.indexOf("[");
  const endBracket = text.lastIndexOf("]");
  if (start !== -1 && endBracket !== -1 && endBracket > start) {
    parsed = tryParseArray(text.slice(start, endBracket + 1));
    if (parsed) return parsed;
  }

  return null;
}

/**
 * @returns {Record<string, unknown> | null}
 */
export function parseJsonObjectFromContent(rawContent) {
  if (rawContent == null) return null;
  let text = String(rawContent).trim();
  if (!text) return null;

  text = stripFirstCodeFence(text);

  const tryParseObject = (s) => {
    if (!s || typeof s !== "string") return null;
    try {
      const v = JSON.parse(s.trim());
      return v && typeof v === "object" && !Array.isArray(v) ? v : null;
    } catch {
      return null;
    }
  };

  let parsed = tryParseObject(text);
  if (parsed) return parsed;

  const start = text.indexOf("{");
  const endBrace = text.lastIndexOf("}");
  if (start !== -1 && endBrace !== -1 && endBrace > start) {
    parsed = tryParseObject(text.slice(start, endBrace + 1));
    if (parsed) return parsed;
  }

  return null;
}
