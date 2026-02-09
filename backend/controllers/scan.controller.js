const runScanner = require("../services/scanner.service");
const { URL } = require("url");

exports.startScan = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const result = await runScanner(url);

    // 🛡️ FALSE POSITIVE FILTERING (Post-Processing)
    // The SQLi service adds a dummy "id" param if none exist. 
    // This often triggers false positives on generic 404/Error pages.
    // We filter out SQLi findings for param "id" IF the original URL didn't have it.
    try {
      const parsedUrl = new URL(url);
      const originalHasId = parsedUrl.searchParams.has("id");

      if (result.findings && Array.isArray(result.findings)) {
        result.findings = result.findings.filter(f => {
          // Check if finding is SQLi related to "id" parameter
          if (f.type === 'SQLi' && f.detail && f.detail.includes('parameter "id"')) {
             // Only keep it if the user actually supplied the "id" parameter
             // Otherwise, it's the auto-generated dummy param which is prone to FPs
             return originalHasId;
          }
          return true;
        });
      }
    } catch (e) {
      // If URL parsing fails here (unlikely since scanner ran), ignore filter
      console.warn("Post-processing filter failed:", e);
    }

    res.json(result);
  } catch (err) {
    console.error("Scan Controller Error:", err);
    res.status(500).json({ error: "Scan failed", details: err.message });
  }
};
