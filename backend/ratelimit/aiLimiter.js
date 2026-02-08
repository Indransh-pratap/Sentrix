const rateLimit = require("express-rate-limit");

exports.aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20, // Increased limit for smoother demo experience
});
