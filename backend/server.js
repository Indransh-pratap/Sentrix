const express = require("express");
const cors = require("cors");
const path = require("path");

const scanRoutes = require("./routes/scan.routes");
const geminiRoutes = require("./routes/gemini.routes");

const app = express();

app.use(cors());
app.use(express.json());

// health first
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// static
const clientPath = path.resolve(__dirname, "../Client/dist");
app.use(express.static(clientPath));

app.use("/scan", scanRoutes);
app.use("/gemini", geminiRoutes);

// react fallback
app.get("/*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
