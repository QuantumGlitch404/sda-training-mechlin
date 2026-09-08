const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        status: "completed"
      }
    ]
  });
});

router.post("/", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Order created successfully"
  });
});

module.exports = router;