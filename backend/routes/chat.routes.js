const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../controllers/chat.controller");

// POST /api/chat
router.post("/", chatWithAI);

module.exports = router;