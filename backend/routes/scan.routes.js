const express = require("express");
const router = express.Router();
const { startScan } = require("../controllers/scan.controller");

router.post("/", startScan);
module.exports = router;
