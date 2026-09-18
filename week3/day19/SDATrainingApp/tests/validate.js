const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'App.tsx',
  'src/navigation/AppNavigator.tsx',
  'src/screens/LoginScreen.tsx',
  'src/screens/DashboardScreen.tsx',
  'src/screens/AnalyticsScreen.tsx',
  'src/screens/ProfileScreen.tsx',
  'src/screens/SettingsScreen.tsx',
  'src/store/index.ts',
  'src/store/slices/authSlice.ts',
  'src/services/apiService.ts',
  'src/services/offlineService.ts',
  'src/types/index.ts',
  'docs/react-native-guide.md',
];

let passed = 0;
let failed = 0;

for (const file of requiredFiles) {
  const fullPath = path.join(process.cwd(), file);

  if (fs.existsSync(fullPath)) {
    console.log(`PASS: ${file}`);
    passed++;
  } else {
    console.log(`FAIL: ${file}`);
    failed++;
  }
}

console.log('');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
}

console.log('All Day 19 validation checks passed.');