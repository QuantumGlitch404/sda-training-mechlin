const express =
  require("express");

const router =
  express.Router();

const productService =
  require(
    "../services/productService"
  );

const {
  validateProduct,
  validateId
} = require(
  "../middleware/validation"
);

router.get(
  "/",
  async (
    req,
    res,
    next
  ) => {
    try {
      const products =
        await productService
          .getAllProducts();

      res.json({
        success: true,
        data: products
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
      const product =
        await productService
          .getProductById(
            req.params.id
          );

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validateProduct,
  async (
    req,
    res,
    next
  ) => {
    try {
      const product =
        await productService
          .createProduct(
            req.body
          );

      res.status(201).json({
        success: true,
        message:
          "Product created successfully",
        data: product
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports =
  router;