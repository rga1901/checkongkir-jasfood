// Service worker Cek Ongkir Jasfood
// Ganti CACHE_VERSION tiap kali file di-update, biar HP pelanggan/driver
// otomatis ambil versi baru (bukan versi lama yang ke-cache).
const CACHE_VERSION = 'cek-ongkir-v8';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-96.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Strategi: coba jaringan dulu (biar selalu dapet data ongkir terbaru),
// baru jatuh ke cache kalau lagi offline.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
