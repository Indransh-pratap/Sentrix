const express = require("express");
const cors = require("cors");
const path = require("path");

const scanRoutes = require("./routes/scan.routes");
const geminiRoutes = require("./routes/gemini.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../Client/dist")));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/scan", scanRoutes);
app.use("/gemini", geminiRoutes);

// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
