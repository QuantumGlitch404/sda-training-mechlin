const express = require("express");

const userService = require(
  "../services/userService"
);

const auth = require(
  "../middleware/auth"
);

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const user =
      await userService.createUser(
        req.body
      );

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/login",
  async (req, res, next) => {
    try {
      const {
        email,
        password
      } = req.body;

      const result =
        await userService.authenticateUser(
          email,
          password
        );

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/",
  auth,
  async (req, res, next) => {
    try {
      const result =
        await userService.getAllUsers(
          req.query
        );

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  auth,
  async (req, res, next) => {
    try {
      const user =
        await userService.getUserById(
          req.params.id
        );

      res.json({
        success: true,
        user
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id",
  auth,
  async (req, res, next) => {
    try {
      const user =
        await userService.updateUser(
          req.params.id,
          req.body
        );

      res.json({
        success: true,
        user
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  auth,
  async (req, res, next) => {
    try {
      const result =
        await userService.deleteUser(
          req.params.id
        );

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/logout",
  auth,
  async (req, res, next) => {
    try {
      const result =
        await userService.logout(
          req.user.userId
        );

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;