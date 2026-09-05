const { v4: uuidv4 } = require("uuid");

class ProductService {
  constructor() {
    this.products = new Map();
  }

  async initialize() {
    const initialProducts = [
      {
        name: "Laptop",
        description:
          "A development laptop for everyday programming work.",
        price: 65000,
        category: "Electronics",
        stock: 10
      },
      {
        name: "Keyboard",
        description:
          "A mechanical keyboard for comfortable typing.",
        price: 2500,
        category: "Accessories",
        stock: 25
      },
      {
        name: "Mouse",
        description:
          "A wireless mouse for everyday computer use.",
        price: 1200,
        category: "Accessories",
        stock: 30
      }
    ];

    for (
      const product of initialProducts
    ) {
      const id = uuidv4();

      this.products.set(id, {
        id,
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

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
    const product =
      this.products.get(id);

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    return product;
  }

  async createProduct(data) {
    const id = uuidv4();

    const product = {
      id,
      name: data.name,
      description:
        data.description,
      price:
        Number(data.price),
      category:
        data.category,
      stock:
        Number(data.stock),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.products.set(
      id,
      product
    );

    return product;
  }
}

module.exports =
  new ProductService();