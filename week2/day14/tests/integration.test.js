const request =
  require('supertest');

const app =
  require('../server');

const assert =
  require('node:assert/strict');

async function runTest(
  name,
  testFunction
) {
  try {
    await testFunction();

    console.log(
      `${name}: PASSED`
    );

    return true;
  } catch (error) {
    console.log(
      `${name}: FAILED`
    );

    console.log(
      error.message
    );

    return false;
  }
}

(async () => {
  let passed = true;

  let authToken = null;

  passed =
    (await runTest(
      'registration and login flow',
      async () => {
        const response =
          await request(app)
            .post(
              '/api/v1/auth/login'
            )
            .send({
              email:
                'integration@test.com',
              password:
                'password123'
            })
            .expect(200);

        assert.equal(
          response.body.success,
          true
        );

        assert.ok(
          response.body.data
            .accessToken
        );

        authToken =
          response.body.data
            .accessToken;
      }
    )) && passed;

  passed =
    (await runTest(
      'authentication protection',
      async () => {
        await request(app)
          .get(
            '/api/v1/products'
          )
          .expect(401);
      }
    )) && passed;

  passed =
    (await runTest(
      'products',
      async () => {
        const response =
          await request(app)
            .get(
              '/api/v1/products'
            )
            .set(
              'Authorization',
              `Bearer ${authToken}`
            )
            .expect(200);

        assert.equal(
          response.body.success,
          true
        );

        assert.ok(
          Array.isArray(
            response.body.data
              .products
          )
        );
      }
    )) && passed;

  passed =
    (await runTest(
      'single product',
      async () => {
        const response =
          await request(app)
            .get(
              '/api/v1/products/1'
            )
            .set(
              'Authorization',
              `Bearer ${authToken}`
            )
            .expect(200);

        assert.equal(
          response.body.data.name,
          'Wireless Headphones'
        );
      }
    )) && passed;

  passed =
    (await runTest(
      'create order',
      async () => {
        const response =
          await request(app)
            .post(
              '/api/v1/orders'
            )
            .set(
              'Authorization',
              `Bearer ${authToken}`
            )
            .send({
              items: [
                {
                  productId: '1',
                  quantity: 2,
                  price: 199.99
                }
              ],

              shippingAddress: {
                street:
                  '123 Test Street',
                city:
                  'Jaipur',
                state:
                  'Rajasthan',
                zipCode:
                  '302001',
                country:
                  'India'
              }
            })
            .expect(201);

        assert.equal(
          response.body.success,
          true
        );

        assert.equal(
          response.body.data.total,
          399.98
        );
      }
    )) && passed;

  passed =
    (await runTest(
      'get user orders',
      async () => {
        const response =
          await request(app)
            .get(
              '/api/v1/orders'
            )
            .set(
              'Authorization',
              `Bearer ${authToken}`
            )
            .expect(200);

        assert.equal(
          response.body.data
            .orders.length,
          1
        );
      }
    )) && passed;

  passed =
    (await runTest(
      'analytics',
      async () => {
        const response =
          await request(app)
            .get(
              '/api/v1/analytics'
            )
            .set(
              'Authorization',
              `Bearer ${authToken}`
            )
            .expect(200);

        assert.equal(
          response.body.data
            .totalOrders,
          1
        );

        assert.equal(
          response.body.data
            .totalSales,
          399.98
        );
      }
    )) && passed;

  passed =
    (await runTest(
      'validation error',
      async () => {
        await request(app)
          .post(
            '/api/v1/orders'
          )
          .set(
            'Authorization',
            `Bearer ${authToken}`
          )
          .send({
            items: []
          })
          .expect(400);
      }
    )) && passed;

  passed =
    (await runTest(
      'concurrent requests',
      async () => {
        const requests =
          Array.from(
            { length: 10 },
            () =>
              request(app)
                .get(
                  '/api/v1/products'
                )
                .set(
                  'Authorization',
                  `Bearer ${authToken}`
                )
          );

        const responses =
          await Promise.all(
            requests
          );

        responses.forEach(
          (response) => {
            assert.equal(
              response.status,
              200
            );
          }
        );
      }
    )) && passed;

  passed =
    (await runTest(
      'response time',
      async () => {
        const start =
          Date.now();

        await request(app)
          .get(
            '/api/v1/products'
          )
          .set(
            'Authorization',
            `Bearer ${authToken}`
          )
          .expect(200);

        const duration =
          Date.now() - start;

        assert.ok(
          duration < 1000,
          `Response took ${duration}ms`
        );
      }
    )) && passed;

  console.log('');
  console.log(
    '=========================='
  );
  console.log(
    'DAY 14 RESULT'
  );
  console.log(
    '=========================='
  );

  console.log(
    JSON.stringify(
      {
        overall:
          passed
            ? 'PASSED'
            : 'FAILED'
      },
      null,
      2
    )
  );

  process.exit(
    passed ? 0 : 1
  );
})();