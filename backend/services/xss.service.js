const axios = require("axios");
const { URL } = require("url");
const { generateMLPayloads, analyzeReflection } = require("./mlPayload.service");

const PAYLOADS = [
  "<script>alert(1)</script>",
  "'><script>alert(1)</script>",
  "\"><script>alert(1)</script>",
  "<img src=x onerror=alert(1)>"
];

const xssScan = async (targetUrl) => {
  const findings = [];
  let parsed;

  console.log("🧪 XSS SCAN STARTED:", targetUrl);

  try {
    parsed = new URL(targetUrl);
  } catch {
    return findings;
  }

  // If no params, try to inject common ones
  if (![...parsed.searchParams.keys()].length) {
    parsed.searchParams.set("q", "1");
    parsed.searchParams.set("search", "1");
    parsed.searchParams.set("id", "1");
    parsed.searchParams.set("query", "1");
  }

  const params = [...parsed.searchParams.keys()];

  for (const key of params) {
    let vulnerabilityFound = false;

    // Phase 1: Standard Payloads
    for (const payload of PAYLOADS) {
      if (vulnerabilityFound) break;

      const testUrl = new URL(parsed.toString());
      testUrl.searchParams.set(key, payload);

      console.log("➡️ Testing:", testUrl.toString());

      try {
        const res = await axios.get(testUrl.toString(), {
          timeout: 10000,
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "text/html,application/xhtml+xml",
          },
          validateStatus: () => true,
        });

        const contentType = (res.headers["content-type"] || "").toLowerCase();
        if (!contentType.includes("text/html")) continue;

        if (typeof res.data !== "string") continue;
        const body = res.data;

        // Check if payload is reflected EXACTLY
        if (body.includes(payload)) {
          console.log("🔥 XSS CONFIRMED");
          findings.push({
            title: "Reflected XSS",
            detail: `Reflected Cross-Site Scripting vulnerability found in parameter "${key}"`,
            impact: "Attacker can execute malicious scripts in the user's browser, potentially stealing cookies, session tokens, or redirecting the user.",
            severity: "High",
            fix: "Input validation and Output encoding (e.g. HTML entity encoding) are required.",
            url: testUrl.toString(),
          });
          vulnerabilityFound = true;
        } else {
          // ML Phase: If partial reflection is detected, try ML generation
          // Heuristic: If at least part of the payload (e.g., "alert(1)") is found, 
          // it means input is getting through but tags might be stripped.
          if (body.includes("alert(1)")) {
             console.log("⚠️ Partial reflection detected. Engaging ML Engine...");
             
             const mlPayloads = await generateMLPayloads(targetUrl, key, payload);
             
             for (const mlPayload of mlPayloads) {
               if (vulnerabilityFound) break;
               
               const mlTestUrl = new URL(parsed.toString());
               mlTestUrl.searchParams.set(key, mlPayload);
               console.log("🧠 ML Testing:", mlTestUrl.toString());

               const mlRes = await axios.get(mlTestUrl.toString(), {
                 timeout: 10000,
                 validateStatus: () => true
               });
               
               if (mlRes.data && mlRes.data.includes(mlPayload)) {
                  console.log("🔥 ML GENERATED PAYLOAD SUCCESS");
                  findings.push({
                    title: "Reflected XSS (ML Bypass)",
                    detail: `Machine Learning engine generated a bypass payload for parameter "${key}"`,
                    impact: "Complex WAF/Filter bypass achieved using adaptive payload generation.",
                    severity: "Critical",
                    fix: "Review WAF rules and sanitize all input vectors.",
                    url: mlTestUrl.toString(),
                  });
                  vulnerabilityFound = true;
               }
             }
          }
        }
      } catch (e) {
        console.log("⚠️ Request failed");
      }
    }
  }

  return findings;
};

module.exports = xssScan;
