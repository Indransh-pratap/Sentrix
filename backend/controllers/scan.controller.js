const runScanner = require("../services/scanner.service");
const { URL } = require("url");

exports.startScan = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const result = await runScanner(url);

    // 🛡️ FALSE POSITIVE FILTERING (Disabled for now to ensure all SQLi are shown)
    // The SQLi service adds a dummy "id" param if none exist. 
    // We previously filtered this, but it might hide valid findings if the user relies on auto-discovery.
    
    /* 
    try {
      const parsedUrl = new URL(url);
      const originalHasId = parsedUrl.searchParams.has("id");

      if (result.findings && Array.isArray(result.findings)) {
        result.findings = result.findings.filter(f => {
          if (f.type === 'SQLi' && f.detail && f.detail.includes('parameter "id"')) {
             return originalHasId;
          }
          return true;
        });
      }
    } catch (e) {
      console.warn("Post-processing filter failed:", e);
    }
    */

    res.json(result);
  } catch (err) {
    console.error("Scan Controller Error:", err);
    res.status(500).json({ error: "Scan failed", details: err.message });
  }
};
