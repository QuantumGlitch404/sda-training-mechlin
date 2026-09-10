const request = require('supertest');
const app = require('../server');

const runTest = async (
  name,
  testFunction
) => {
  try {
    await testFunction();

    console.log(`${name}: PASSED`);
    return true;
  } catch (error) {
    console.log(`${name}: FAILED`);
    console.log(error.message);
    return false;
  }
};

(async () => {
  let passed = true;

  passed =
    (await runTest(
      'health',
      async () => {
        const response = await request(app)
          .get('/health')
          .expect(200);

        if (!response.body.success) {
          throw new Error(
            'Health check failed'
          );
        }
      }
    )) && passed;

  passed =
    (await runTest(
      'swagger',
      async () => {
        const response = await request(app)
          .get('/api/v1/docs/swagger.json')
          .expect(200);

        if (
          response.body.openapi !==
          '3.0.0'
        ) {
          throw new Error(
            'OpenAPI specification missing'
          );
        }
      }
    )) && passed;

  passed =
    (await runTest(
      'authentication',
      async () => {
        await request(app)
          .get('/api/v1/users')
          .expect(401);
      }
    )) && passed;

  passed =
    (await runTest(
      'users',
      async () => {
        const response = await request(app)
          .get('/api/v1/users')
          .set(
            'Authorization',
            'Bearer demo-token'
          )
          .expect(200);

        if (
          !response.body.data ||
          !Array.isArray(
            response.body.data.users
          )
        ) {
          throw new Error(
            'Users data missing'
          );
        }
      }
    )) && passed;

  passed =
    (await runTest(
      'userById',
      async () => {
        const response = await request(app)
          .get('/api/v1/users/1')
          .set(
            'Authorization',
            'Bearer demo-token'
          )
          .expect(200);

        if (
          response.body.data.id !== '1'
        ) {
          throw new Error(
            'User ID mismatch'
          );
        }
      }
    )) && passed;

  passed =
    (await runTest(
      'userNotFound',
      async () => {
        await request(app)
          .get('/api/v1/users/999')
          .set(
            'Authorization',
            'Bearer demo-token'
          )
          .expect(404);
      }
    )) && passed;

  passed =
    (await runTest(
      'updateUser',
      async () => {
        const response = await request(app)
          .put('/api/v1/users/1')
          .set(
            'Authorization',
            'Bearer demo-token'
          )
          .send({
            name: 'Updated User'
          })
          .expect(200);

        if (
          response.body.data.name !==
          'Updated User'
        ) {
          throw new Error(
            'User update failed'
          );
        }
      }
    )) && passed;

  passed =
    (await runTest(
      'deleteUser',
      async () => {
        const response = await request(app)
          .delete('/api/v1/users/1')
          .set(
            'Authorization',
            'Bearer demo-token'
          )
          .expect(200);

        if (
          response.body.message !==
          'User deleted successfully'
        ) {
          throw new Error(
            'User deletion failed'
          );
        }
      }
    )) && passed;

  console.log('');
  console.log('==========================');
  console.log('DAY 13 RESULT');
  console.log('==========================');
  console.log(
    JSON.stringify(
      {
        overall: passed
          ? 'PASSED'
          : 'FAILED'
      },
      null,
      2
    )
  );

  process.exit(passed ? 0 : 1);
})();