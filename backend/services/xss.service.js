const axios = require("axios");
const { URL } = require("url");
const { generateMLPayloads } = require("./mlPayload.service");

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

  // If no params exist, inject common ones
  if (![...parsed.searchParams.keys()].length) {
    parsed.searchParams.set("q", "1");
    parsed.searchParams.set("search", "1");
    parsed.searchParams.set("id", "1");
    parsed.searchParams.set("query", "1");
  }

  const params = [...parsed.searchParams.keys()];

  for (const key of params) {
    let vulnerabilityFound = false;

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
            Accept: "*/*",
          },
          validateStatus: () => true,
        });

        if (typeof res.data !== "string") continue;

        const body = res.data;
        const contentType = (res.headers["content-type"] || "").toLowerCase();

        // Allow ONLY html
        if (!contentType.includes("html")) {
          continue;
        }

        const normalizedBody = body.toLowerCase();
        const normalizedPayload = payload.toLowerCase();

        // 🔥 Reflection detection (Strict)
        // We only consider it a vulnerability if the KEY CHARACTERS (<, >, ') are reflected UNESCAPED.
        // If the body contains "&lt;script&gt;", it is SAFE.
        // If the body contains "<script>", it is VULNERABLE.
        
        // Check if the payload was reflected
        const isReflected = normalizedBody.includes(normalizedPayload);

        // Verify it wasn't escaped (Basic check)
        // If we sent "<script>" and we find "<script>", it's likely valid.
        // But we need to ensure we aren't matching our own URL in a meta tag or canonical link.
        // Real XSS usually appears in the <body> or inside <script> blocks.
        
        if (isReflected) {
          // Double check: Does the body contain the encoded version?
          // If body has "&lt;script" it might also have "<script" if we aren't careful?
          // No, includes() is exact.
          
          console.log("🔥 XSS CONFIRMED");

          findings.push({
            type: "XSS",
            title: "Reflected XSS",
            detail: `Reflected Cross-Site Scripting vulnerability found in parameter "${key}"`,
            impact:
              "An attacker can execute arbitrary JavaScript in the victim's browser, leading to session hijacking, phishing, or data theft.",
            severity: "High",
            fix:
              "Apply strict output encoding (HTML entity encoding) and validate all user-controlled input.",
            url: testUrl.toString(),
          });

          vulnerabilityFound = true;
          break;
        }

        // 🧠 ML PHASE (adaptive payloads)
        // Only trigger ML if we see a PARTIAL reflection of our unique string
        // We shouldn't trigger just because we see "alert" (common in JS).
        // We should check if our parameter value is somewhere in the source.
        
        // Let's use a unique probe to check reflection first?
        // For now, let's just restrict ML trigger.
        
        // If the payload was NOT reflected, check if at least the "alert(1)" part was?
        // No, that's too common.
        
        // We only try bypasses if we suspect a filter.
        // A filter usually strips tags but leaves content.
        // E.g. input: <script>alert(1)</script> -> output: alert(1)
        
        if (
          !isReflected &&
          normalizedBody.includes("alert(1)") && // Only if our specific alert value is there
          !normalizedBody.includes("function alert") // avoid matching function definitions
        ) {
          console.log("⚠️ Partial reflection detected. Engaging ML engine...");
          
          const mlPayloads = await generateMLPayloads(targetUrl, key, payload);
          // ... rest of logic

          for (const mlPayload of mlPayloads) {
            if (vulnerabilityFound) break;

            const mlTestUrl = new URL(parsed.toString());
            mlTestUrl.searchParams.set(key, mlPayload);

            console.log("🧠 ML Testing:", mlTestUrl.toString());

            const mlRes = await axios.get(mlTestUrl.toString(), {
              timeout: 10000,
              validateStatus: () => true,
            });

            if (
              typeof mlRes.data === "string" &&
              mlRes.data.toLowerCase().includes(mlPayload.toLowerCase())
            ) {
              if (!findings.some(f => f.url === mlTestUrl.toString())) {
                console.log("🔥 ADAPTIVE PAYLOAD SUCCESS");

                findings.push({
                  type: "XSS",
                  title: "Reflected XSS (Adaptive Payload Bypass)",
                  detail: `Adaptive payload bypass detected for parameter "${key}"`,
                  impact:
                    "Adaptive payload bypass indicates weak input filtering and high likelihood of real-world XSS exploitation.",
                  severity: "High",
                  fix:
                    "Review input filters, sanitize all reflected content, and enforce CSP headers.",
                  url: mlTestUrl.toString(),
                });
              }

              vulnerabilityFound = true;
              break;
            }
          }
        }
      } catch (e) {
        console.log("⚠️ XSS request failed:", e.message);
      }
    }
  }

  return findings;
};

module.exports = xssScan;
