const express = require("express");
const router = express.Router();
const { calculateRisk } = require("../services/risk.service");

router.post("/", (req, res) => {
  try {
    const { vulnerabilities } = req.body;

    const result = calculateRisk(vulnerabilities);

    return res.status(200).json(result); // 👈 only this
  } catch (err) {
    console.error("Risk error:", err);
    return res.status(500).json({ error: "Risk calculation failed" });
  }
});

module.exports = router;