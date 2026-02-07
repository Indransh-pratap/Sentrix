require("dotenv").config();
const express = require("express");
const cors = require("cors");
const scanRoutes = require("./routes/scan.routes");

const app = express();

app.use(cors());
app.use(express.json());

// 👉 ROOT ROUTE (for localhost check)
app.get("/", (req, res) => {
  res.send("🚀 Server is live");
});

// 👉 HEALTH CHECK (for frontend)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/scan", scanRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
