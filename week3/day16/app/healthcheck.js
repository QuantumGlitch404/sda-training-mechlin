const http = require('http');

const port = Number(
  process.env.PORT || 3000
);

const options = {
  hostname: '127.0.0.1',
  port,
  path: '/health',
  method: 'GET',
  timeout: 3000
};

const request =
  http.request(
    options,
    (response) => {
      if (
        response.statusCode === 200
      ) {
        process.exit(0);
      }

      process.exit(1);
    }
  );

request.on(
  'error',
  () => {
    process.exit(1);
  }
);

request.on(
  'timeout',
  () => {
    request.destroy();
    process.exit(1);
  }
);

request.end();