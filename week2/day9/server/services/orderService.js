const { v4: uuidv4 } = require("uuid");

class OrderService {
  constructor() {
    this.orders = new Map();
  }

  async initialize() {
    console.log(
      "OrderService initialized"
    );
  }

  async getAllOrders() {
    return Array.from(
      this.orders.values()
    );
  }

  async getOrderById(id) {
    const order =
      this.orders.get(id);

    if (!order) {
      throw new Error(
        "Order not found"
      );
    }

    return order;
  }

  async createOrder(data) {
    const order = {
      id: uuidv4(),
      userId: data.userId,
      items: data.items,
      shippingAddress:
        data.shippingAddress,
      status: "created",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.set(
      order.id,
      order
    );

    return order;
  }
}

module.exports =
  new OrderService();