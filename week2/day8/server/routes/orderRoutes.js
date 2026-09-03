const express = require("express");

const orderService = require("../services/orderService");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id
    );

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const order = await orderService.createOrder(
      req.body
    );

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;