const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");

const scanRoutes = require("./routes/scan.routes");
// const aiRoutes = require("./routes/ai.routes");
const geminiRoutes = require("./routes/gemini.routes");

const app = express();

// Enable CORS with specific options for Vercel/Localhost compatibility
app.use(cors({
  origin: true, // Reflects the request origin, effectively allowing all
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests explicitly
app.options(/.*/, cors());

app.use(express.json());

// 👉 ROOT ROUTE
app.get("/", (req, res) => {
  res.send("🚀 Server is live");
});

// 👉 HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 👉 API ROUTES
// We use /api prefix for everything to match Vercel/Serverless structure
app.use("/api/scan", scanRoutes);
// app.use("/api/ai", aiRoutes);
app.use("/api/gemini", geminiRoutes); // New Gemini Chatbot Route

// Legacy/Root support for convenience (optional)
app.use("/scan", scanRoutes); 
// app.use("/ai", aiRoutes);

// ==========================================
//  LOCAL SERVER (Starts only if run directly)
// ==========================================
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// ==========================================
//  SERVERLESS EXPORT (For Vercel)
// ==========================================
module.exports = app;
