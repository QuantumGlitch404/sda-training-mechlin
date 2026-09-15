const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');

const root =
  path.join(__dirname, '..');

const requiredFiles = [
  'k8s/namespace.yaml',
  'k8s/configmap.yaml',
  'k8s/secret.yaml',
  'k8s/deployment.yaml',
  'k8s/service.yaml',
  'k8s/ingress.yaml',
  'k8s/persistent-volume.yaml',
  'k8s/persistent-volume-claim.yaml',
  'k8s/mongodb-deployment.yaml',
  'k8s/postgresql-deployment.yaml',
  'k8s/redis-deployment.yaml',
  'k8s/monitoring-configmap.yaml',
  'k8s/monitoring.yaml',
  'k8s/network-policy.yaml',
  'docs/kubernetes-guide.md'
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
            path.join(root, file)
          ),
          true,
          `Missing file: ${file}`
        );
      }
    );
  }
);

test(
  'deployment configuration',
  () => {
    const content =
      fs.readFileSync(
        path.join(
          root,
          'k8s',
          'deployment.yaml'
        ),
        'utf8'
      );

    assert.match(
      content,
      /replicas:\s*3/
    );

    assert.match(
      content,
      /livenessProbe/
    );

    assert.match(
      content,
      /readinessProbe/
    );

    assert.match(
      content,
      /sda-training-day16:latest/
    );
  }
);

test(
  'service configuration',
  () => {
    const content =
      fs.readFileSync(
        path.join(
          root,
          'k8s',
          'service.yaml'
        ),
        'utf8'
      );

    assert.match(
      content,
      /ClusterIP/
    );

    assert.match(
      content,
      /port:\s*3000/
    );
  }
);

test(
  'ingress configuration',
  () => {
    const content =
      fs.readFileSync(
        path.join(
          root,
          'k8s',
          'ingress.yaml'
        ),
        'utf8'
      );

    assert.match(
      content,
      /kind:\s*Ingress/
    );

    assert.match(
      content,
      /sda-training-service/
    );
  }
);

test(
  'storage configuration',
  () => {
    const pv =
      fs.readFileSync(
        path.join(
          root,
          'k8s',
          'persistent-volume.yaml'
        ),
        'utf8'
      );

    const pvc =
      fs.readFileSync(
        path.join(
          root,
          'k8s',
          'persistent-volume-claim.yaml'
        ),
        'utf8'
      );

    assert.match(
      pv,
      /kind:\s*PersistentVolume/
    );

    assert.match(
      pvc,
      /kind:\s*PersistentVolumeClaim/
    );
  }
);

test(
  'monitoring configuration',
  () => {
    const content =
      fs.readFileSync(
        path.join(
          root,
          'k8s',
          'monitoring.yaml'
        ),
        'utf8'
      );

    assert.match(
      content,
      /prometheus/
    );

    assert.match(
      content,
      /kind:\s*Deployment/
    );

    assert.match(
      content,
      /kind:\s*Service/
    );
  }
);

console.log('');

console.log(
  '=========================='
);

console.log(
  'DAY 17 VALIDATION RESULT'
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