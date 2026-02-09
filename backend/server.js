const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http"); // Added for Netlify

const scanRoutes = require("./routes/scan.routes");
// const aiRoutes = require("./routes/ai.routes"); // Uncomment if you want AI routes

const app = express();

app.use(cors());
app.use(express.json());

// 👉 ROOT ROUTE
app.get("/", (req, res) => {
  res.send("🚀 Server is live");
});

// 👉 HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 👉 API ROUTES (Use /api/ prefix for Netlify functions standard)
app.use("/scan", scanRoutes); // Legacy support
app.use("/api/scan", scanRoutes); // Netlify standard

// app.use("/api/ai", aiRoutes);

// ==========================================
//  LOCAL SERVER (Commented out for Serverless)
// ==========================================
/*
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
*/

// ==========================================
//  SERVERLESS EXPORT (For Netlify)
// ==========================================
module.exports.handler = serverless(app);
