const express = require("express");
const router = express.Router();
const { startScan } = require("../controllers/scan.controller");
const { generatePDF } = require("../services/pdf.service");

router.post("/", startScan);
router.post("/pdf", generatePDF);

module.exports = router;