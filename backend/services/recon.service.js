const axios = require("axios");

const reconScan = async (url) => {
  const findings = [];

  try {
    const res = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html",
      },
      validateStatus: () => true,
    });

    if (res.headers.server) {
      findings.push({
        title: "Server Header Disclosure",
        detail: res.headers.server,
        impact: "Reveals server technology information",
        severity: "Info",
        fix: "Hide or remove server version headers",
      });
    }

    const csp = res.headers["content-security-policy"];
    if (!csp) {
      findings.push({
        title: "Missing Content-Security-Policy",
        impact: "Increases risk of XSS and injection attacks",
        severity: "Medium",
        fix: "Add a strict Content-Security-Policy header",
      });
    }
  } catch {
    findings.push({
      title: "Scan Warning",
      detail: "Target restricted automated scanning",
      impact: "Some vulnerabilities may not be detected",
      severity: "Info",
    });
  }

  return findings;
};

module.exports = reconScan;
