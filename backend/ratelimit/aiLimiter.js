const rateLimit = require("express-rate-limit");

exports.aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // 5 requests per minute per IP
});
