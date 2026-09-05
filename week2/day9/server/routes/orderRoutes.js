const express =
  require("express");

const router =
  express.Router();

const orderService =
  require(
    "../services/orderService"
  );

const {
  authMiddleware
} = require(
  "../middleware/auth"
);

const {
  validateOrder,
  validateId
} = require(
  "../middleware/validation"
);

router.use(
  authMiddleware
);

router.get(
  "/",
  async (
    req,
    res,
    next
  ) => {
    try {
      const orders =
        await orderService
          .getAllOrders();

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  validateId,
  async (
    req,
    res,
    next
  ) => {
    try {
      const order =
        await orderService
          .getOrderById(
            req.params.id
          );

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validateOrder,
  async (
    req,
    res,
    next
  ) => {
    try {
      const order =
        await orderService
          .createOrder({
            ...req.body,
            userId:
              req.user.userId
          });

      res.status(201).json({
        success: true,
        message:
          "Order created successfully",
        data: order
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports =
  router;