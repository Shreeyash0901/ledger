/**
 * Centralized, strict allowlist validator and sanitizer for links across the website system.
 * 
 * Rules:
 * 1. Control characters and leading/trailing whitespace are stripped.
 * 2. Allowed patterns:
 *    (a) Single-slash relative path (starts with "/" but NOT "//" and no backslashes "\")
 *    (b) An "#anchor" (starts with "#")
 *    (c) Absolute URL parsed with the standard URL API whose protocol is strictly "https:"
 *    (d) "mailto:" or "tel:" communication protocols (parsed or matched strictly)
 * 3. Everything else is rejected (e.g. javascript:, data:, vbscript:, //evil.com, \evil.com).
 */

export function isSafeLink(rawLink: unknown): boolean {
  if (typeof rawLink !== "string") {
    return false;
  }

  // 1. Remove all control characters (ASCII 0-31 and 127) and whitespace
  // Notice: replace control chars including tabs, newlines, null bytes
  const cleaned = rawLink.replace(/[\x00-\x1F\x7F]/g, "").trim();
  if (!cleaned) {
    return false;
  }

  // Reject any string containing backslashes
  if (cleaned.includes("\\")) {
    return false;
  }

  // 2. Anchor links: #...
  if (cleaned.startsWith("#")) {
    return true;
  }

  // 3. Single-slash relative path: starts with "/" and NOT "//"
  if (cleaned.startsWith("/")) {
    return !cleaned.startsWith("//");
  }

  // 4. mailto: and tel:
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+/i.test(cleaned) || /^mailto:[a-zA-Z0-9._%+-]+@/i.test(cleaned) || /^mailto:/i.test(cleaned)) {
    return true;
  }
  if (/^tel:[+0-9\-().\s]+$/i.test(cleaned) || /^tel:/i.test(cleaned)) {
    return true;
  }

  // 5. Absolute URL using the URL parser
  try {
    const parsed = new URL(cleaned);
    // Disallow credentials (user:pass@host)
    if (parsed.username || parsed.password) {
      return false;
    }
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Returns the sanitized href. If unsafe or empty, returns fallback (default: "#").
 */
export function sanitizeLink(rawLink: unknown, fallback: string = "#"): string {
  if (isSafeLink(rawLink)) {
    return String(rawLink).replace(/[\x00-\x1F\x7F]/g, "").trim();
  }
  return fallback;
}

/**
 * Returns security attributes (rel and target) for rendered <a> tags.
 */
export function getLinkAttributes(href: string): { rel?: string; target?: string } {
  const sanitized = sanitizeLink(href);
  if (typeof sanitized === "string" && sanitized.startsWith("https://")) {
    return {
      rel: "noopener noreferrer",
    };
  }
  return {};
}
