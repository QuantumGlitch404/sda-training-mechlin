const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');

const day16 =
  path.join(__dirname, '..');

const requiredFiles = [
  'package.json',
  'Dockerfile',
  '.dockerignore',
  'app/index.js',
  'app/healthcheck.js',
  'infrastructure/docker-compose.yml',
  'nginx/nginx.conf',
  'monitoring/prometheus.yml',
  'scripts/docker-optimize.sh',
  'scripts/mongo-init.js',
  'scripts/postgres-init.sql',
  'docs/docker-guide.md'
];

let passed = true;

function test(name, callback) {
  try {
    callback();

    console.log(
      `${name}: PASSED`
    );
  } catch (error) {
    passed = false;

    console.log(
      `${name}: FAILED`
    );

    console.log(
      error.message
    );
  }
}

test(
  'required files',
  () => {
    requiredFiles.forEach(
      (file) => {
        assert.equal(
          fs.existsSync(
            path.join(day16, file)
          ),
          true,
          `Missing file: ${file}`
        );
      }
    );
  }
);

test(
  'dockerfile has healthcheck',
  () => {
    const content =
      fs.readFileSync(
        path.join(
          day16,
          'Dockerfile'
        ),
        'utf8'
      );

    assert.match(
      content,
      /HEALTHCHECK/
    );

    assert.match(
      content,
      /USER nodejs/
    );
  }
);

test(
  'compose has required services',
  () => {
    const content =
      fs.readFileSync(
        path.join(
          day16,
          'infrastructure',
          'docker-compose.yml'
        ),
        'utf8'
      );

    [
      'app:',
      'mongodb:',
      'postgresql:',
      'redis:',
      'nginx:',
      'prometheus:',
      'grafana:',
      'volumes:',
      'networks:'
    ].forEach(
      (service) => {
        assert.match(
          content,
          new RegExp(
            service.replace(
              ':',
              '\\:'
            )
          )
        );
      }
    );
  }
);

test(
  'nginx proxy is configured',
  () => {
    const content =
      fs.readFileSync(
        path.join(
          day16,
          'nginx',
          'nginx.conf'
        ),
        'utf8'
      );

    assert.match(
      content,
      /upstream app_servers/
    );

    assert.match(
      content,
      /proxy_pass/
    );

    assert.match(
      content,
      /limit_req_zone/
    );
  }
);

test(
  'prometheus is configured',
  () => {
    const content =
      fs.readFileSync(
        path.join(
          day16,
          'monitoring',
          'prometheus.yml'
        ),
        'utf8'
      );

    assert.match(
      content,
      /scrape_configs/
    );

    assert.match(
      content,
      /app:3000/
    );
  }
);

console.log('');
console.log(
  '=========================='
);
console.log(
  'DAY 16 VALIDATION RESULT'
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