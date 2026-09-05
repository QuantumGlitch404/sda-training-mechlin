const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();

    this.jwtSecret =
      process.env.JWT_SECRET ||
      "day9-development-secret";

    this.jwtExpiresIn =
      process.env.JWT_EXPIRES_IN ||
      "7d";
  }

  async initialize() {
    console.log("UserService initialized");
  }

  async createUser(userData) {
    const {
      name,
      email,
      password,
      role = "user"
    } = userData;

    if (!name || !email || !password) {
      throw new Error(
        "Name, email and password are required"
      );
    }

    if (this.users.has(email)) {
      throw new Error("User already exists");
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    this.users.set(email, user);

    return this.sanitizeUser(user);
  }

  async authenticateUser(email, password) {
    const user = this.users.get(email);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error(
        "User account is deactivated"
      );
    }

    const valid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!valid) {
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
  }

  async validateToken(token) {
    try {
      const decoded =
        jwt.verify(
          token,
          this.jwtSecret
        );

      const session =
        this.sessions.get(
          decoded.userId
        );

      if (
        !session ||
        session.token !== token
      ) {
        throw new Error("Invalid token");
      }

      session.lastActivity =
        new Date();

      return decoded;
    } catch (error) {
      if (
        error.name ===
        "TokenExpiredError"
      ) {
        throw error;
      }

      if (
        error.name ===
        "JsonWebTokenError"
      ) {
        throw error;
      }

      throw new Error("Invalid token");
    }
  }

  async getUserById(userId) {
    const user =
      Array.from(
        this.users.values()
      ).find(
        (item) =>
          item.id === userId
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    return this.sanitizeUser(user);
  }

  async updateUser(
    userId,
    updateData
  ) {
    const user =
      Array.from(
        this.users.values()
      ).find(
        (item) =>
          item.id === userId
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    if (
      updateData.name !==
      undefined
    ) {
      user.name =
        updateData.name;
    }

    if (
      updateData.email !==
      undefined &&
      updateData.email !==
      user.email
    ) {
      this.users.delete(
        user.email
      );

      user.email =
        updateData.email;
    }

    if (
      updateData.password
    ) {
      user.password =
        await bcrypt.hash(
          updateData.password,
          12
        );
    }

    if (
      updateData.role !==
      undefined
    ) {
      user.role =
        updateData.role;
    }

    user.updatedAt =
      new Date();

    this.users.set(
      user.email,
      user
    );

    return this.sanitizeUser(
      user
    );
  }

  async deleteUser(userId) {
    const user =
      Array.from(
        this.users.values()
      ).find(
        (item) =>
          item.id === userId
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    this.users.delete(
      user.email
    );

    this.sessions.delete(
      userId
    );

    return {
      message:
        "User deleted successfully"
    };
  }

  async getAllUsers(
    filters = {},
    options = {}
  ) {
    let users =
      Array.from(
        this.users.values()
      );

    if (filters.role) {
      users =
        users.filter(
          (user) =>
            user.role ===
            filters.role
        );
    }

    if (
      filters.isActive !==
      undefined
    ) {
      users =
        users.filter(
          (user) =>
            user.isActive ===
            (
              filters.isActive ===
                "true" ||
              filters.isActive ===
                true
            )
        );
    }

    const page =
      parseInt(
        options.page,
        10
      ) || 1;

    const limit =
      parseInt(
        options.limit,
        10
      ) || 10;

    const sort =
      options.sort ||
      "createdAt";

    const order =
      options.order ===
      "asc"
        ? 1
        : -1;

    users.sort(
      (a, b) => {
        const first =
          a[sort];
        const second =
          b[sort];

        if (
          first < second
        ) {
          return -1 * order;
        }

        if (
          first > second
        ) {
          return 1 * order;
        }

        return 0;
      }
    );

    const total =
      users.length;

    const start =
      (page - 1) *
      limit;

    const paginatedUsers =
      users
        .slice(
          start,
          start + limit
        )
        .map(
          (user) =>
            this.sanitizeUser(
              user
            )
        );

    return {
      users:
        paginatedUsers,

      pagination: {
        page,
        limit,
        total,
        pages:
          Math.ceil(
            total / limit
          )
      }
    };
  }

  async logout(userId) {
    this.sessions.delete(
      userId
    );

    return {
      message:
        "Logged out successfully"
    };
  }

  sanitizeUser(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt:
        user.createdAt,
      updatedAt:
        user.updatedAt,
      isActive:
        user.isActive
    };
  }
}

module.exports =
  new UserService();