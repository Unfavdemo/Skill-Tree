/**
 * Human-readable message for error boundaries and catch blocks.
 * Avoids useless strings like "[object Event]" when a non-Error value is thrown.
 */
export function getErrorMessage(thing) {
  if (thing == null) return "An unexpected error occurred.";
  if (typeof thing === "string") return thing;
  if (thing instanceof Error) return thing.message || "An unexpected error occurred.";
  if (typeof thing === "object") {
    const tag = Object.prototype.toString.call(thing);
    if (tag === "[object Event]" || tag.includes("Event]")) {
      return "Something went wrong while handling an interaction. Please try again.";
    }
    if (typeof thing.message === "string" && thing.message.trim()) {
      return thing.message;
    }
  }
  return "An unexpected error occurred.";
}
