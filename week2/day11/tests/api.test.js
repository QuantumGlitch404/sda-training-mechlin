require("dotenv").config();

const request = require("supertest");

const { app } = require("../server");
const { cacheService } = require("../middleware/caching");

const runTests = async () => {
  console.log("");
  console.log("============================================================");
  console.log("DAY 11 API TESTS");
  console.log("============================================================");

  // Connect Redis so caching can be tested.
  await cacheService.connect();

  await cacheService.flush();

  // 1. Health Check
  const healthResponse = await request(app)
    .get("/health");

  console.log("");
  console.log("1. Health Check");
  console.log(
    JSON.stringify(
      {
        statusCode: healthResponse.statusCode,
        body: healthResponse.body
      },
      null,
      2
    )
  );

  // 2. API Information
  const apiResponse = await request(app)
    .get("/api/v1");

  console.log("");
  console.log("2. API Information");
  console.log(
    JSON.stringify(
      {
        statusCode: apiResponse.statusCode,
        body: apiResponse.body
      },
      null,
      2
    )
  );

  // 3. Users Endpoint
  const usersResponse = await request(app)
    .get("/api/v1/users")
    .set("Accept", "application/json");

  console.log("");
  console.log("3. Users Endpoint");
  console.log(
    JSON.stringify(
      {
        statusCode: usersResponse.statusCode,
        body: usersResponse.body
      },
      null,
      2
    )
  );

  // 4. Products Endpoint - first request
  const productsResponse1 = await request(app)
    .get("/api/v1/products");

  console.log("");
  console.log("4. Products Endpoint - First Request");
  console.log(
    JSON.stringify(
      {
        statusCode: productsResponse1.statusCode,
        cacheHeader:
          productsResponse1.headers["x-cache"],
        body: productsResponse1.body
      },
      null,
      2
    )
  );

  // 5. Products Endpoint - second request
  const productsResponse2 = await request(app)
    .get("/api/v1/products");

  console.log("");
  console.log("5. Products Endpoint - Second Request");
  console.log(
    JSON.stringify(
      {
        statusCode: productsResponse2.statusCode,
        cacheHeader:
          productsResponse2.headers["x-cache"],
        body: productsResponse2.body
      },
      null,
      2
    )
  );

  // 6. Analytics Endpoint
  const analyticsResponse = await request(app)
    .get("/api/v1/analytics");

  console.log("");
  console.log("6. Analytics Endpoint");
  console.log(
    JSON.stringify(
      {
        statusCode: analyticsResponse.statusCode,
        body: analyticsResponse.body
      },
      null,
      2
    )
  );

  // 7. Unsupported API version
  const versionResponse = await request(app)
    .get("/api/v3");

  console.log("");
  console.log("7. Unsupported API Version");
  console.log(
    JSON.stringify(
      {
        statusCode: versionResponse.statusCode,
        body: versionResponse.body
      },
      null,
      2
    )
  );

  // 8. Swagger documentation
  const docsResponse = await request(app)
    .get("/api/v1/docs/");

  console.log("");
  console.log("8. Swagger Documentation");
  console.log(
    JSON.stringify(
      {
        statusCode: docsResponse.statusCode,
        available:
          docsResponse.statusCode === 200 ||
          docsResponse.statusCode === 301 ||
          docsResponse.statusCode === 302
      },
      null,
      2
    )
  );

  // 9. Strict rate limiter
  const rateLimitResults = [];

  for (let i = 1; i <= 7; i += 1) {
    const response = await request(app)
      .get("/api/v1/users/secure");

    rateLimitResults.push({
      request: i,
      statusCode: response.statusCode
    });
  }

  console.log("");
  console.log("9. Rate Limiting");
  console.log(
    JSON.stringify(
      rateLimitResults,
      null,
      2
    )
  );

  // Final result
  const testsPassed =
    healthResponse.statusCode === 200 &&
    apiResponse.statusCode === 200 &&
    usersResponse.statusCode === 200 &&
    productsResponse1.statusCode === 200 &&
    productsResponse2.statusCode === 200 &&
    productsResponse1.headers["x-cache"] === "MISS" &&
    productsResponse2.headers["x-cache"] === "HIT" &&
    analyticsResponse.statusCode === 200 &&
    versionResponse.statusCode === 400 &&
    (docsResponse.statusCode === 200 ||
      docsResponse.statusCode === 301 ||
      docsResponse.statusCode === 302) &&
    rateLimitResults.some(
      (result) => result.statusCode === 429
    );

  console.log("");
  console.log("============================================================");
  console.log("DAY 11 RESULT");
  console.log("============================================================");

  console.log(
    JSON.stringify(
      {
        apiHealth: healthResponse.statusCode === 200
          ? "PASSED"
          : "FAILED",

        apiInformation: apiResponse.statusCode === 200
          ? "PASSED"
          : "FAILED",

        usersEndpoint: usersResponse.statusCode === 200
          ? "PASSED"
          : "FAILED",

        caching:
          productsResponse1.headers["x-cache"] === "MISS" &&
          productsResponse2.headers["x-cache"] === "HIT"
            ? "PASSED"
            : "FAILED",

        analytics: analyticsResponse.statusCode === 200
          ? "PASSED"
          : "FAILED",

        versioning: versionResponse.statusCode === 400
          ? "PASSED"
          : "FAILED",

        swagger:
          docsResponse.statusCode === 200 ||
          docsResponse.statusCode === 301 ||
          docsResponse.statusCode === 302
            ? "PASSED"
            : "FAILED",

        rateLimiting: rateLimitResults.some(
          (result) => result.statusCode === 429
        )
          ? "PASSED"
          : "FAILED",

        overall: testsPassed
          ? "PASSED"
          : "FAILED"
      },
      null,
      2
    )
  );

  await cacheService.flush();
  await cacheService.disconnect();

  if (!testsPassed) {
    process.exitCode = 1;
  }
};

runTests().catch(async (error) => {
  console.error("");
  console.error("============================================================");
  console.error("DAY 11 TEST FAILED");
  console.error("============================================================");
  console.error(error);

  try {
    await cacheService.disconnect();
  } catch (disconnectError) {
    // Ignore disconnect errors during failure cleanup.
  }

  process.exitCode = 1;
});