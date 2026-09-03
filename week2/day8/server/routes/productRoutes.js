const express = require("express");

const productService = require(
  "../services/productService"
);

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const products =
      await productService.getAllProducts();

    res.json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const product =
        await productService.getProductById(
          req.params.id
        );

      res.json({
        success: true,
        product
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  async (req, res, next) => {
    try {
      const product =
        await productService.createProduct(
          req.body
        );

      res.status(201).json({
        success: true,
        product
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;