const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Day 8 Node.js server is healthy",
    timestamp: new Date().toISOString(),

    process: {
      pid: process.pid,
      node: process.version,
      platform: process.platform,
      arch: process.arch
    }
  });
});

module.exports = router;