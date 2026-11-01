const CACHE_NAME = 'v3';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './styles.css',
    './app-logic.js'
];

// 1. Install Event: Saves the files to the browser storage
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting(); // 2. ADDED: Forces the new service worker to activate immediately
});

// 3. ADDED: Activate Event to clean up old caches (v1) and take control of pages
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key); // Deletes old version caches
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 2. Fetch Event: Serves files from cache if offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
