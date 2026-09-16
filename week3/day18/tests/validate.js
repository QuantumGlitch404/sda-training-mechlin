const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..", "..");

const requiredFiles = [
  ".github/workflows/ci-cd.yml",
  ".github/workflows/deploy-staging.yml",
  ".github/workflows/security.yml",
  ".github/workflows/performance.yml",
  ".github/workflows/monitoring.yml",

  "week3/day18/package.json",
  "week3/day18/docs/cicd-guide.md",
  "week3/day18/lighthouse.config.js",
  "week3/day18/artillery.config.yml",
  "week3/day18/k6-load-test.js",
  "week3/day18/.zap/rules.tsv",
  "week3/day18/scripts/health-check.sh",

  "week3/day17/k8s/namespace.yaml",
  "week3/day17/k8s/configmap.yaml",
  "week3/day17/k8s/secret.yaml",
  "week3/day17/k8s/deployment.yaml",
  "week3/day17/k8s/service.yaml",
  "week3/day17/k8s/ingress.yaml"
];

let passed = 0;
let failed = 0;

console.log("======================================");
console.log(" DAY 18 CI/CD VALIDATION");
console.log("======================================");

for (const file of requiredFiles) {
  const fullPath = path.join(root, file);

  if (fs.existsSync(fullPath)) {
    console.log(`PASS  ${file}`);
    passed++;
  } else {
    console.log(`FAIL  ${file}`);
    failed++;
  }
}

const packageJsonPath = path.join(root, "week3/day18/package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

const requiredScripts = [
  "test",
  "test:unit",
  "test:integration",
  "lint",
  "type-check",
  "security",
  "health"
];

for (const script of requiredScripts) {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`PASS  npm script: ${script}`);
    passed++;
  } else {
    console.log(`FAIL  npm script: ${script}`);
    failed++;
  }
}

console.log("--------------------------------------");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log("--------------------------------------");

if (failed > 0) {
  process.exit(1);
}

console.log("DAY 18 VALIDATION PASSED");