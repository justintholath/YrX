const CACHE_NAME = 'v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

// 1. Install Event: Saves the files to the browser storage
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 2. Fetch Event: Serves files from cache if offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
