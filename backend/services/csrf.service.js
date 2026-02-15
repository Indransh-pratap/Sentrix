const axios = require("axios");
const { URL } = require("url");

/**
 * CSRF Detection Module (Passive)
 * -------------------------------
 * Detects potential CSRF risk based on:
 *  - Missing SameSite cookie attribute
 *  - Missing CSRF token indicators
 *  - Weak origin / referer validation hints
 *
 * ❌ No exploitation
 * ❌ No state-changing requests
 */

const csrfScan = async (targetUrl) => {
  const findings = [];
  let parsed;

  try {
    parsed = new URL(targetUrl);
  } catch {
    return findings;
  }

  let res;
  try {
    res = await axios.get(parsed.toString(), {
      timeout: 10000,
      validateStatus: () => true,
    });
  } catch {
    return findings;
  }

  const headers = res.headers || {};
  const cookies = headers["set-cookie"] || [];

  /* -----------------------------
     1️⃣ SameSite Cookie Check
     ----------------------------- */
  if (cookies.length > 0) {
    const sameSiteMissing = cookies.some(
      (c) => !/samesite=/i.test(c)
    );

    if (sameSiteMissing) {
      findings.push({
        type: "CSRF",
        title: "Potential CSRF Risk: Missing SameSite Cookie Attribute",
        severity: "Medium",
        detail:
          "Authentication cookies are set without the SameSite attribute.",
        impact:
          "Cookies may be included in cross-site requests, increasing CSRF risk.",
        fix:
          "Set SameSite=Lax or SameSite=Strict on authentication cookies.",
        confidence: "High",
      });
    }
  }

  /* -----------------------------
     2️⃣ CSRF Token Heuristic
     ----------------------------- */
  const body =
    typeof res.data === "string" ? res.data.toLowerCase() : "";

  const tokenIndicators = [
    "csrf",
    "_token",
    "xsrf",
    "authenticity_token",
  ];

  const tokenFound = tokenIndicators.some((t) =>
    body.includes(t)
  );

  if (!tokenFound) {
    findings.push({
      type: "CSRF",
      title: "Potential CSRF Risk: Missing CSRF Token",
      severity: "Medium",
      detail:
        "No CSRF token indicators were detected in the HTML response.",
      impact:
        "State-changing requests may be forgeable by third-party websites.",
      fix:
        "Include and validate a per-request CSRF token on the server.",
      confidence: "Medium",
    });
  }

  /* -----------------------------
     3️⃣ Origin / Referer Validation Heuristic
     ----------------------------- */
  const originHints =
    headers["access-control-allow-origin"] ||
    headers["origin"] ||
    headers["referer"];

  if (!originHints) {
    findings.push({
      type: "CSRF",
      title: "Potential CSRF Risk: Missing Origin / Referer Validation",
      severity: "Low",
      detail:
        "No evidence of Origin or Referer-based validation was observed.",
      impact:
        "Requests may be accepted regardless of their source.",
      fix:
        "Validate Origin or Referer headers for state-changing requests.",
      confidence: "Low",
    });
  }

  /* -----------------------------
     4️⃣ Overall CSRF Risk Inference
     ----------------------------- */
  if (findings.length > 0) {
    findings.push({
      type: "CSRF",
      title: "Potential CSRF Misconfiguration Detected",
      severity: "Info",
      detail:
        "One or more CSRF protection mechanisms appear to be missing or misconfigured.",
      impact:
        "If a user is authenticated, unintended actions could potentially be triggered.",
      fix:
        "Apply layered CSRF defenses: SameSite cookies, CSRF tokens, and origin validation.",
      confidence: "Medium",
    });
  }

  return findings;
};

module.exports = csrfScan;
