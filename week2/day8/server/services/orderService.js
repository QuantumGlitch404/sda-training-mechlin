const { v4: uuidv4 } = require("uuid");

class OrderService {
  constructor() {
    this.orders = new Map();
  }

  async initialize() {
    console.log("OrderService initialized");
  }

  async getAllOrders() {
    return Array.from(this.orders.values());
  }

  async getOrderById(id) {
    const order = this.orders.get(id);

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  async createOrder(orderData) {
    if (!orderData.productId || !orderData.quantity) {
      throw new Error(
        "Product ID and quantity are required"
      );
    }

    const order = {
      id: uuidv4(),
      productId: orderData.productId,
      quantity: Number(orderData.quantity),
      status: "created",
      createdAt: new Date()
    };

    this.orders.set(order.id, order);

    return order;
  }
}

module.exports = new OrderService();