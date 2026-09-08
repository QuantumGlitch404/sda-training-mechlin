const express = require("express");
const { cache } = require("../../../middleware/caching");

const router = express.Router();

router.get(
  "/",
  cache(60),
  (req, res) => {
    res.json({
      success: true,
      data: [
        {
          id: 1,
          name: "Day 11 Laptop",
          price: 65000,
          category: "Electronics"
        },
        {
          id: 2,
          name: "Day 11 Keyboard",
          price: 2500,
          category: "Accessories"
        }
      ]
    });
  }
);

router.post("/", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Product created successfully"
  });
});

module.exports = router;