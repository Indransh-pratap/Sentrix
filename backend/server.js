const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");

const scanRoutes = require("./routes/scan.routes");
const geminiRoutes = require("./routes/gemini.routes");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// HEALTH — ONLY THIS
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ROUTES — NO /api HERE
app.use("/scan", scanRoutes);
app.use("/gemini", geminiRoutes);

// LOCAL ONLY
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

module.exports = app;
