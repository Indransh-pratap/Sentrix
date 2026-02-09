const express = require("express");
const router = express.Router();
const { chatWithGemini } = require("../controllers/gemini.controller");

// POST /api/gemini/chat
router.post("/chat", chatWithGemini);

module.exports = router;