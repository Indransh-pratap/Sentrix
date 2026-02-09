const express = require("express");
const cors = require("cors");

const scanRoutes = require("./routes/scan.routes");
const geminiRoutes = require("./routes/gemini.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/scan", scanRoutes);
app.use("/gemini", geminiRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("Local server running");
  });
}

module.exports = app;
