const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const scanRoutes = require("./routes/scan.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(cors());
app.use(express.json());

// health check (Railway + uptime)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// APIs
app.use("/scan", scanRoutes);
app.use("/api/chat", chatRoutes);

// ❌ NO static serving
// ❌ NO React fallback
// ❌ NO Client/dist dependency

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
