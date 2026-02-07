const runScanner = require("../services/scanner.service");

exports.startScan = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const result = await runScanner(url);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Scan failed" });
  }
};
