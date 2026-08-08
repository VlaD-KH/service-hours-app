// Версия кеша привязана к хешу сборки — обновляйте при каждом деплое
const CACHE_VERSION = 'zps-hours-v3-' + '20260808';
const CACHE_NAME = CACHE_VERSION;

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico'
];

// Установка: кэшируем критические ресурсы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Немедленная активация нового SW без ожидания закрытия старых вкладок
  self.skipWaiting();
});

// Активация: удаляем ВСЕ старые версии кеша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Удалён устаревший кеш:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Захватываем контроль над всеми вкладками немедленно
  self.clients.claim();
});

// Стратегия: Network First с fallback на кеш (гарантирует свежие данные)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Запросы к Firebase/API никогда не кешируем
  const url = new URL(event.request.url);
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('firebaseapp.com') ||
      url.hostname.includes('gstatic.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Сохраняем свежую копию в кеш для оффлайн-режима
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Оффлайн: возвращаем кешированную копию
        return caches.match(event.request);
      })
  );
});
