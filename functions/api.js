const app = require("../backend/server"); // Import the express app from backend folder
const serverless = require("serverless-http");

module.exports.handler = serverless(app);