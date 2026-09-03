const { v4: uuidv4 } = require("uuid");

class ProductService {
  constructor() {
    this.products = new Map();
  }

  async initialize() {
    const products = [
      {
        name: "Laptop",
        price: 65000,
        category: "Electronics"
      },
      {
        name: "Keyboard",
        price: 2500,
        category: "Accessories"
      },
      {
        name: "Mouse",
        price: 1200,
        category: "Accessories"
      }
    ];

    products.forEach((product) => {
      const id = uuidv4();

      this.products.set(id, {
        id,
        ...product,
        createdAt: new Date()
      });
    });

    console.log(
      `ProductService initialized with ${this.products.size} products`
    );
  }

  async getAllProducts() {
    return Array.from(
      this.products.values()
    );
  }

  async getProductById(id) {
    const product = this.products.get(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async createProduct(data) {
    if (!data.name || data.price === undefined) {
      throw new Error(
        "Product name and price are required"
      );
    }

    const id = uuidv4();

    const product = {
      id,
      name: data.name,
      price: Number(data.price),
      category: data.category || "General",
      createdAt: new Date()
    };

    this.products.set(id, product);

    return product;
  }
}

module.exports = new ProductService();