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

        // Allow html / text / json
        if (
          !contentType.includes("html") &&
          !contentType.includes("text") &&
          !contentType.includes("json")
        ) {
          continue;
        }

        const normalizedBody = body.toLowerCase();
        const normalizedPayload = payload.toLowerCase();

        // 🔥 Reflection detection (realistic)
        if (
          normalizedBody.includes(normalizedPayload) ||
          normalizedBody.includes("alert(1)") ||
          normalizedBody.includes("<script") ||
          normalizedBody.includes("onerror") ||
          normalizedBody.includes("onload")
        ) {
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
        if (
          normalizedBody.includes("alert") ||
          normalizedBody.includes("onerror") ||
          normalizedBody.includes("onload")
        ) {
          console.log("⚠️ Partial reflection detected. Engaging ML engine...");

          const mlPayloads = await generateMLPayloads(targetUrl, key, payload);

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
