const express = require("express");
const cors = require("cors");
require("dotenv").config();

const scanRoutes = require("./routes/scan.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/*
=====================================
   ALL APIs UNDER /api
=====================================
*/

app.use("/api/scan", scanRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
