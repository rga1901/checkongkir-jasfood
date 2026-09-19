// Service worker Cek Ongkir Jasfood
// Ganti CACHE_VERSION tiap kali file di-update, biar HP pelanggan/driver
// otomatis ambil versi baru (bukan versi lama yang ke-cache).
//
// KONVENSI VERSI (baca ini kalau kamu AI lain yang lanjutin project ini):
// Versi gak lagi dinamain v1, v2, v3, dst. Tiap ada update, ganti nama versi
// pakai nama gunung yang ada di Indonesia, bebas gunung mana aja, TAPI harus
// beda dari nama gunung yang dipakai di versi sebelumnya. Format bebas asal
// jelas, contoh: 'cek-ongkir-lawu', 'cek-ongkir-semeru', dst.
const CACHE_VERSION = 'cek-ongkir-lawu';
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
