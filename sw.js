// Minimal service worker: cache core assets so the app shell
// loads offline. Speech recognition still requires network on
// most browsers (it streams audio to a recognition service),
// but the UI itself will load offline once cached.
const CACHE_NAME = "speakvn-v1";
const ASSETS = ["./", "./index.html", "./style.css", "./app.js", "./data.js", "./manifest.json", "./icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => cached))
  );
});
