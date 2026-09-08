const express = require("express");
const { cache } = require("../../../middleware/caching");

const router = express.Router();

router.get(
  "/",
  cache(120),
  (req, res) => {
    res.json({
      success: true,
      data: {
        users: 120,
        products: 45,
        orders: 320
      }
    });
  }
);

module.exports = router;