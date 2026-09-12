const express = require('express');

const users = require('../models/User');
const products = require('../models/Product');
const orders = require('../models/Order');

const router = express.Router();

const DEMO_TOKEN =
  'day14-demo-token';

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (
    !email ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      error: {
        message:
          'Email and password are required'
      }
    });
  }

  const user =
    users.find(
      (item) =>
        item.email === email
    ) || users[0];

  res.json({
    success: true,

    data: {
      user,

      accessToken:
        DEMO_TOKEN
    }
  });
});

function authenticate(
  req,
  res,
  next
) {
  const authorization =
    req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      error: {
        message:
          'Access token is required'
      }
    });
  }

  if (
    authorization !==
    `Bearer ${DEMO_TOKEN}`
  ) {
    return res.status(401).json({
      success: false,
      error: {
        message:
          'Invalid access token'
      }
    });
  }

  req.user = users[0];

  next();
}

router.get(
  '/users',
  authenticate,
  (req, res) => {
    res.json({
      success: true,

      data: {
        users,
        total: users.length
      }
    });
  }
);

router.get(
  '/products',
  authenticate,
  (req, res) => {
    res.json({
      success: true,

      data: {
        products,
        total: products.length
      }
    });
  }
);

router.get(
  '/products/:id',
  authenticate,
  (req, res) => {
    const product =
      products.find(
        (item) =>
          item.id === req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message:
            'Product not found'
        }
      });
    }

    res.json({
      success: true,
      data: product
    });
  }
);

router.post(
  '/orders',
  authenticate,
  (req, res) => {
    const {
      items,
      shippingAddress
    } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: {
          message:
            'Order items are required'
        }
      });
    }

    const order = {
      id: String(
        orders.length + 1
      ),

      userId:
        req.user.id,

      items,

      shippingAddress,

      total: items.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity),
        0
      ),

      status: 'pending',

      createdAt:
        new Date().toISOString()
    };

    orders.push(order);

    res.status(201).json({
      success: true,
      data: order
    });
  }
);

router.get(
  '/orders',
  authenticate,
  (req, res) => {
    const userOrders =
      orders.filter(
        (order) =>
          order.userId ===
          req.user.id
      );

    res.json({
      success: true,

      data: {
        orders: userOrders,
        total:
          userOrders.length
      }
    });
  }
);

router.get(
  '/analytics',
  authenticate,
  (req, res) => {
    const totalSales =
      orders.reduce(
        (sum, order) =>
          sum + order.total,
        0
      );

    res.json({
      success: true,

      data: {
        totalUsers:
          users.length,

        totalProducts:
          products.length,

        totalOrders:
          orders.length,

        totalSales
      }
    });
  }
);

module.exports = router;