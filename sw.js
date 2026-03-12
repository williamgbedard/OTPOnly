const CACHE_NAME = 'otponly-v1';
const APP_SHELL = [
  './',
  './index.html',
  './airports.js',
  './pc12perf.js',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap',
];

// ── Install: cache app shell ──────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch strategy ────────────────────────────────────────
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // App shell: cache-first
  if (APP_SHELL.includes(url.pathname) || APP_SHELL.includes(e.request.url)) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  // API calls (Open-Meteo wind data + worker wx): network-first, stale fallback
  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('workers.dev')) {
    e.respondWith(
      fetch(e.request.clone()).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request).then(cached => {
        if (cached) return cached;
        return new Response(JSON.stringify({ error: 'offline', offline: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }))
    );
    return;
  }

  // Google Fonts: cache-first with network fallback
  if (url.hostname.includes('fonts.g')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => cached))
    );
    return;
  }

  // Everything else: network only
  e.respondWith(fetch(e.request));
});
