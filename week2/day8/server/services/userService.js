const EventEmitter = require("events");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService extends EventEmitter {
  constructor() {
    super();

    this.users = new Map();
    this.sessions = new Map();

    this.jwtSecret =
      process.env.JWT_SECRET || "day8-development-secret";

    this.jwtExpiresIn =
      process.env.JWT_EXPIRES_IN || "7d";

    this.setupEventHandlers();
  }

  async initialize() {
    console.log("UserService initialized");

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.on("user:created", (user) => {
      console.log(`User created: ${user.email}`);
    });

    this.on("user:updated", (user) => {
      console.log(`User updated: ${user.email}`);
    });

    this.on("user:deleted", (userId) => {
      console.log(`User deleted: ${userId}`);
    });
  }

  async createUser(userData) {
    try {
      const {
        email,
        password,
        name,
        role = "user"
      } = userData;

      if (!email || !password || !name) {
        throw new Error(
          "Email, password and name are required"
        );
      }

      if (this.users.has(email)) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(
        password,
        12
      );

      const user = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        name,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      this.users.set(email, user);

      this.emit("user:created", user);

      return this.sanitizeUser(user);
    } catch (error) {
      console.error(
        "Error creating user:",
        error.message
      );

      throw error;
    }
  }

  async authenticateUser(email, password) {
    try {
      const user = this.users.get(email);

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.isActive) {
        throw new Error(
          "User account is deactivated"
        );
      }

      const isValidPassword =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        this.jwtSecret,
        {
          expiresIn: this.jwtExpiresIn
        }
      );

      this.sessions.set(user.id, {
        token,
        createdAt: new Date(),
        lastActivity: new Date()
      });

      return {
        token,
        user: this.sanitizeUser(user)
      };
    } catch (error) {
      console.error(
        "Error authenticating user:",
        error.message
      );

      throw error;
    }
  }

  async getUserById(userId) {
    const user = Array.from(
      this.users.values()
    ).find((item) => item.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    return this.sanitizeUser(user);
  }

  async updateUser(userId, updateData) {
    const user = Array.from(
      this.users.values()
    ).find((item) => item.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (updateData.name !== undefined) {
      user.name = updateData.name;
    }

    if (updateData.role !== undefined) {
      user.role = updateData.role;
    }

    user.updatedAt = new Date();

    this.emit("user:updated", user);

    return this.sanitizeUser(user);
  }

  async deleteUser(userId) {
    const user = Array.from(
      this.users.values()
    ).find((item) => item.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    this.users.delete(user.email);
    this.sessions.delete(userId);

    this.emit("user:deleted", userId);

    return {
      message: "User deleted successfully"
    };
  }

  async getAllUsers(filters = {}) {
    let users = Array.from(this.users.values());

    if (filters.role) {
      users = users.filter(
        (user) => user.role === filters.role
      );
    }

    if (filters.isActive !== undefined) {
      users = users.filter(
        (user) =>
          user.isActive ===
          (filters.isActive === "true" ||
            filters.isActive === true)
      );
    }

    const page =
      parseInt(filters.page, 10) || 1;

    const limit =
      parseInt(filters.limit, 10) || 10;

    const skip = (page - 1) * limit;

    const total = users.length;

    const paginatedUsers = users
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(skip, skip + limit)
      .map((user) =>
        this.sanitizeUser(user)
      );

    return {
      users: paginatedUsers,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async validateToken(token) {
    try {
      const decoded = jwt.verify(
        token,
        this.jwtSecret
      );

      const session =
        this.sessions.get(decoded.userId);

      if (
        !session ||
        session.token !== token
      ) {
        throw new Error("Invalid token");
      }

      session.lastActivity = new Date();

      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async logout(userId) {
    this.sessions.delete(userId);

    return {
      message: "Logged out successfully"
    };
  }

  sanitizeUser(user) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive
    };
  }
}

module.exports = new UserService();