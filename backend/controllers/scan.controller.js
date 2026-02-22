const runScanner = require("../services/scanner.service");
const { URL } = require("url");
const { calculateRisk } = require("../services/risk.service");

exports.startScan = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  try {
    const result = await runScanner(url);

    // 🔥 Ensure findings array exists
    const findings = Array.isArray(result.findings)
      ? result.findings
      : [];

    // 🔥 Normalize severity if missing
    const normalizedFindings = findings.map((f) => ({
      ...f,
      severity:
        f.severity ||
        (f.type === "SQLi"
          ? "Critical"
          : f.type === "XSS"
          ? "High"
          : "Medium"),
    }));

    // 🔥 Calculate Risk
    const riskAnalysis = calculateRisk(normalizedFindings);

    // 🔥 Attach to result
    result.findings = normalizedFindings;
    result.riskAnalysis = riskAnalysis;

    return res.status(200).json(result);

  } catch (err) {
    console.error("Scan Controller Error:", err);
    return res.status(500).json({
      error: "Scan failed",
      details: err.message,
    });
  }
};