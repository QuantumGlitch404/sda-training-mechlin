require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");

const { app } = require("../server");

const runTests = async () => {
  console.log("");
  console.log("============================================================");
  console.log("DAY 12 AUTHENTICATION & RBAC TESTS");
  console.log("============================================================");

  console.log("");
  console.log("Connecting to MongoDB...");

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected successfully");

  const testEmail = `day12-${Date.now()}@example.com`;
  const testPassword = "Day12Test@123";

  // 1. MongoDB Connection
  console.log("");
  console.log("1. MongoDB Connection");

  console.log(
    JSON.stringify(
      {
        connected: mongoose.connection.readyState === 1,
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      },
      null,
      2
    )
  );

  // 2. User Registration
  const registerResponse = await request(app)
    .post("/api/v1/auth/register")
    .send({
      name: "Day 12 Test User",
      email: testEmail,
      password: testPassword
    });

  console.log("");
  console.log("2. User Registration");

  console.log(
    JSON.stringify(
      {
        statusCode: registerResponse.statusCode,
        success: registerResponse.body.success,
        userCreated: Boolean(
          registerResponse.body.data?.user
        ),
        accessTokenCreated: Boolean(
          registerResponse.body.data?.accessToken
        ),
        refreshTokenCreated: Boolean(
          registerResponse.body.data?.refreshToken
        )
      },
      null,
      2
    )
  );

  const accessToken =
    registerResponse.body.data?.accessToken;

  const refreshToken =
    registerResponse.body.data?.refreshToken;

  // 3. User Login
  const loginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: testEmail,
      password: testPassword
    });

  console.log("");
  console.log("3. User Login");

  console.log(
    JSON.stringify(
      {
        statusCode: loginResponse.statusCode,
        success: loginResponse.body.success,
        accessTokenCreated: Boolean(
          loginResponse.body.data?.accessToken
        ),
        refreshTokenCreated: Boolean(
          loginResponse.body.data?.refreshToken
        )
      },
      null,
      2
    )
  );

  // 4. JWT Authentication
  const protectedResponse = await request(app)
    .get("/api/v1/protected")
    .set(
      "Authorization",
      `Bearer ${accessToken}`
    );

  console.log("");
  console.log("4. JWT Authentication");

  console.log(
    JSON.stringify(
      {
        statusCode: protectedResponse.statusCode,
        authenticated:
          protectedResponse.statusCode === 200,
        body: protectedResponse.body
      },
      null,
      2
    )
  );

  // 5. Current User
  const meResponse = await request(app)
    .get("/api/v1/auth/me")
    .set(
      "Authorization",
      `Bearer ${accessToken}`
    );

  console.log("");
  console.log("5. Current User");

  console.log(
    JSON.stringify(
      {
        statusCode: meResponse.statusCode,
        email: meResponse.body.data?.email,
        role: meResponse.body.data?.role
      },
      null,
      2
    )
  );

  // 6. Token Refresh
  const refreshResponse = await request(app)
    .post("/api/v1/auth/refresh")
    .send({
      refreshToken
    });

  console.log("");
  console.log("6. Token Refresh");

  console.log(
    JSON.stringify(
      {
        statusCode: refreshResponse.statusCode,
        refreshed: Boolean(
          refreshResponse.body.data?.accessToken
        )
      },
      null,
      2
    )
  );

  // 7. Invalid Credentials
  const invalidLoginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: testEmail,
      password: "WrongPassword@123"
    });

  console.log("");
  console.log("7. Invalid Credentials");

  console.log(
    JSON.stringify(
      {
        statusCode: invalidLoginResponse.statusCode,
        rejected:
          invalidLoginResponse.statusCode === 401,
        body: invalidLoginResponse.body
      },
      null,
      2
    )
  );

  // 8. Authentication Protection
  const unauthenticatedResponse = await request(app)
    .get("/api/v1/protected");

  console.log("");
  console.log("8. Authentication Protection");

  console.log(
    JSON.stringify(
      {
        statusCode:
          unauthenticatedResponse.statusCode,
        protected:
          unauthenticatedResponse.statusCode === 401,
        body: unauthenticatedResponse.body
      },
      null,
      2
    )
  );

  // 9. Password Validation
  const weakPasswordResponse = await request(app)
    .post("/api/v1/auth/register")
    .send({
      name: "Weak Password User",
      email: `weak-${Date.now()}@example.com`,
      password: "weak"
    });

  console.log("");
  console.log("9. Password Validation");

  console.log(
    JSON.stringify(
      {
        statusCode: weakPasswordResponse.statusCode,
        rejected:
          weakPasswordResponse.statusCode === 400,
        body: weakPasswordResponse.body
      },
      null,
      2
    )
  );

  // 10. OAuth Configuration
  const googleResponse = await request(app)
    .get("/api/v1/auth/google");

  console.log("");
  console.log("10. OAuth Configuration");

  console.log(
    JSON.stringify(
      {
        statusCode: googleResponse.statusCode,
        configured:
          googleResponse.statusCode !== 503,
        localState:
          "Google OAuth credentials are not configured for local testing"
      },
      null,
      2
    )
  );

  const results = {
    mongodb:
      mongoose.connection.readyState === 1
        ? "PASSED"
        : "FAILED",

    registration:
      registerResponse.statusCode === 201
        ? "PASSED"
        : "FAILED",

    login:
      loginResponse.statusCode === 200
        ? "PASSED"
        : "FAILED",

    jwt:
      protectedResponse.statusCode === 200
        ? "PASSED"
        : "FAILED",

    currentUser:
      meResponse.statusCode === 200
        ? "PASSED"
        : "FAILED",

    tokenRefresh:
      refreshResponse.statusCode === 200
        ? "PASSED"
        : "FAILED",

    invalidCredentials:
      invalidLoginResponse.statusCode === 401
        ? "PASSED"
        : "FAILED",

    protection:
      unauthenticatedResponse.statusCode === 401
        ? "PASSED"
        : "FAILED",

    passwordValidation:
      weakPasswordResponse.statusCode === 400
        ? "PASSED"
        : "FAILED",

    oauthConfiguration:
      googleResponse.statusCode === 503 ||
      googleResponse.statusCode === 302 ||
      googleResponse.statusCode === 200
        ? "PASSED"
        : "FAILED"
  };

  const overall = Object.values(results).every(
    (result) => result === "PASSED"
  );

  console.log("");
  console.log("============================================================");
  console.log("DAY 12 RESULT");
  console.log("============================================================");

  console.log(
    JSON.stringify(
      {
        ...results,
        overall: overall
          ? "PASSED"
          : "FAILED"
      },
      null,
      2
    )
  );

  await mongoose.disconnect();

  console.log("");
  console.log("MongoDB disconnected");

  if (!overall) {
    process.exitCode = 1;
  }
};

runTests().catch(async (error) => {
  console.error("");
  console.error("============================================================");
  console.error("DAY 12 TEST FAILED");
  console.error("============================================================");
  console.error(error);

  try {
    if (
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.disconnect();
    }
  } catch (disconnectError) {
    console.error(
      "MongoDB disconnect error:",
      disconnectError.message
    );
  }

  process.exitCode = 1;
});