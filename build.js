const fs = require('fs');
const path = require('path');

// 1. Создаем папку dist
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

// 2. Копируем все необходимые файлы в dist (кроме node_modules, dist и скрытых файлов)
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // Игнорируем определенные папки и файлы
    if (['node_modules', 'dist', '.git'].includes(entry.name) || entry.name.startsWith('.')) {
      continue;
    }

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      copyDir(srcPath, destPath);
    } else {
      // Исключаем скрипт сборки и примеры
      if (!['build.js', 'config.example.js', 'package.json'].includes(entry.name)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

console.log('Copying static files to /dist...');
copyDir(__dirname, distPath);

// 3. Генерируем config.js на основе переменных окружения Netlify
const ALLOWED_MASTERS = process.env.ALLOWED_MASTERS 
  ? process.env.ALLOWED_MASTERS.split(',').map(e => e.trim()) 
  : [];

const configJsContent = `
window.ENV = {
  firebaseConfig: {
    apiKey: "${process.env.FIREBASE_API_KEY || ''}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN || ''}",
    projectId: "${process.env.FIREBASE_PROJECT_ID || ''}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET || ''}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID || ''}",
    appId: "${process.env.FIREBASE_APP_ID || ''}",
    measurementId: "${process.env.FIREBASE_MEASUREMENT_ID || ''}"
  },
  ALLOWED_MASTERS: ${JSON.stringify(ALLOWED_MASTERS)}
};
`;

console.log('Generating config.js...');
fs.writeFileSync(path.join(distPath, 'config.js'), configJsContent.trim());

console.log('Build completed successfully.');
