// =========================================================================
// ШАБЛОН КОНФИГУРАЦИИ: СОХРАНИТЕ ЭТОТ ФАЙЛ КАК config.js
// И ЗАПОЛНИТЕ РЕАЛЬНЫМИ ЗНАЧЕНИЯМИ (config.js ИГНОРИРУЕТСЯ GIT)
// =========================================================================

window.ENV = {
  // Настройки Firebase
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  },
  
  // Белый список адресов мастеров. 
  // Если пустой [], доступ получают все вошедшие пользователи.
  ALLOWED_MASTERS: ['your_email@example.com']
};
