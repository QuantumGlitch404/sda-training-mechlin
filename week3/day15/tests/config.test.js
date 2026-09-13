require('dotenv').config();

const assert =
  require('node:assert/strict');

const {
  environments,
  getEnvironment
} = require('../config/environments');

const secrets =
  require('../config/secrets');

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

  passed =
    (await runTest(
      'environment definitions',
      async () => {
        assert.ok(
          environments.development
        );

        assert.ok(
          environments.staging
        );

        assert.ok(
          environments.production
        );
      }
    )) && passed;

  passed =
    (await runTest(
      'development environment',
      async () => {
        process.env.NODE_ENV =
          'development';

        const environment =
          getEnvironment();

        assert.equal(
          environment.name,
          'development'
        );

        assert.ok(
          environment.port
        );

        assert.ok(
          environment.api
        );
      }
    )) && passed;

  passed =
    (await runTest(
      'staging environment',
      async () => {
        process.env.NODE_ENV =
          'staging';

        const environment =
          getEnvironment();

        assert.equal(
          environment.name,
          'staging'
        );

        assert.equal(
          environment.logging.level,
          'info'
        );
      }
    )) && passed;

  passed =
    (await runTest(
      'production environment',
      async () => {
        process.env.NODE_ENV =
          'production';

        const environment =
          getEnvironment();

        assert.equal(
          environment.name,
          'production'
        );

        assert.equal(
          environment.logging.level,
          'warn'
        );
      }
    )) && passed;

  process.env.NODE_ENV =
    'development';

  passed =
    (await runTest(
      'secret encryption and decryption',
      async () => {
        const original =
          'day15-secret-value';

        const encrypted =
          secrets.encrypt(
            original
          );

        const decrypted =
          secrets.decrypt(
            encrypted
          );

        assert.equal(
          decrypted,
          original
        );
      }
    )) && passed;

  passed =
    (await runTest(
      'secret validation',
      async () => {
        const result =
          secrets.validateSecrets();

        assert.ok(
          Array.isArray(
            result.missingSecrets
          )
        );
      }
    )) && passed;

  console.log('');
  console.log(
    '=========================='
  );
  console.log(
    'DAY 15 RESULT'
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