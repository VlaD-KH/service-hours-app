// =========================================================================
// СКТИПТ АВТОСБОРКИ NETLIFY: ГЕНЕРАЦИЯ ENV.JS ПРИ ДЕПЛОЕ
// Считывает process.env в панелях Netlify или использует фоллбэк проекта vhs-zps.
// =========================================================================
const fs = require('fs');

const env = process.env;

const apiKey = env.FIREBASE_API_KEY || "AIzaSyBUKLLdkXmASmoq0b2YCbrmp-3U5FvVZ70";
const authDomain = env.FIREBASE_AUTH_DOMAIN || "vhs-zps.firebaseapp.com";
const projectId = env.FIREBASE_PROJECT_ID || "vhs-zps";
const storageBucket = env.FIREBASE_STORAGE_BUCKET || "vhs-zps.firebasestorage.app";
const messagingSenderId = env.FIREBASE_MESSAGING_SENDER_ID || "122824920296";
const appId = env.FIREBASE_APP_ID || "1:122824920296:web:36d289606cdc2018b28d5d";
const measurementId = env.FIREBASE_MEASUREMENT_ID || "G-FVZ569X8ZZ";

const allowedMastersRaw = env.ALLOWED_MASTERS || "vladhrapko@gmail.com";
const allowedMasters = allowedMastersRaw
  ? allowedMastersRaw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  : ["vladhrapko@gmail.com"];

const content = `// Сгенерировано автоматически через build-env.js
window.ENV = {
  FIREBASE_API_KEY: ${JSON.stringify(apiKey)},
  FIREBASE_AUTH_DOMAIN: ${JSON.stringify(authDomain)},
  FIREBASE_PROJECT_ID: ${JSON.stringify(projectId)},
  FIREBASE_STORAGE_BUCKET: ${JSON.stringify(storageBucket)},
  FIREBASE_MESSAGING_SENDER_ID: ${JSON.stringify(messagingSenderId)},
  FIREBASE_APP_ID: ${JSON.stringify(appId)},
  FIREBASE_MEASUREMENT_ID: ${JSON.stringify(measurementId)},
  ALLOWED_MASTERS: ${JSON.stringify(allowedMasters)}
};
`;

fs.writeFileSync('./env.js', content);
console.log('✅ Файл env.js успешно сгенерирован для деплоя на Netlify.');
