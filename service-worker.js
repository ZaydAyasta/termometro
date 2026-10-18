/**
 * service-worker.js — PWA Service Worker
 *
 * Estrategia: Cache-First para assets estáticos.
 * Permite uso OFFLINE completo después de la primera carga.
 *
 * NOTA: Requiere servirse desde HTTPS (o localhost para pruebas).
 */

'use strict';

const CACHE_NAME = 'termometro-v1.2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/main.css',
  './js/sounds.js',
  './js/state.js',
  './js/thermometer.js',
  './js/tools.js',
  './js/adult.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// ── Install: pre-cache all assets ─────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ─────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first strategy ────────────────────────────────
self.addEventListener('fetch', event => {
  // Only handle GET requests to same origin
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // Offline fallback: return index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
