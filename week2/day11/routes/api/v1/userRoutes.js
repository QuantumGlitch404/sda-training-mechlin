const express = require("express");
const { strictLimiter, loginLimiter } = require("../../../middleware/rateLimiting");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        name: "Day 11 User"
      }
    ]
  });
});

router.post("/login", loginLimiter, (req, res) => {
  res.json({
    success: true,
    message: "Login endpoint is working",
    apiVersion: req.apiVersion
  });
});

router.get("/secure", strictLimiter, (req, res) => {
  res.json({
    success: true,
    message: "Secure user endpoint is working"
  });
});

module.exports = router;