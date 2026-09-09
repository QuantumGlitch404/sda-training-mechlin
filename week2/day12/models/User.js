const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false
    },

    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user"
    },

    avatar: {
      type: String,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);



userSchema.index({
  role: 1
});

userSchema.index({
  isActive: 1
});

userSchema.index({
  createdAt: -1
});

userSchema.virtual("fullName").get(function () {
  return this.name;
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt =
    await bcrypt.genSalt(12);

  this.password =
    await bcrypt.hash(
      this.password,
      salt
    );
});

userSchema.methods.comparePassword =
  async function (candidatePassword) {
    return bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

userSchema.methods.generateAuthToken =
  function () {
    return jwt.sign(
      {
        userId:
          this._id.toString(),
        email: this.email,
        role: this.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || "7d"
      }
    );
  };

userSchema.statics.findByCredentials =
  async function (
    email,
    password
  ) {
    const user =
      await this.findOne({
        email,
        isActive: true
      }).select("+password");

    if (!user) {
      throw new Error(
        "Invalid credentials"
      );
    }

    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {
      throw new Error(
        "Invalid credentials"
      );
    }

    return user;
  };

userSchema.statics.getUserStats =
  async function () {
    return this.aggregate([
      {
        $group: {
          _id: "$role",
          count: {
            $sum: 1
          },
          activeUsers: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$isActive",
                    true
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);
  };

module.exports =
  mongoose.model(
    "Day12User",
    userSchema
  );