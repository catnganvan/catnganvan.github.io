// Minimal service worker: cache core assets so the app shell
// loads offline. Speech recognition still requires network on
// most browsers (it streams audio to a recognition service),
// but the UI itself will load offline once cached.
const CACHE_NAME = "speakvn-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./icon.svg",
  "./data/drill-categories.js",
  "./data/shadowing-beginner.js",
  "./data/shadowing-intermediate.js",
  "./data/shadowing-advanced.js",
  "./data/shadowing-sets.js",
  "./data/skill-tree.js",
  "./app/storage.js",
  "./app/design-tokens.js",
  "./app/toast.js",
  "./app/i18n.js",
  "./app/azure-config.js",
  "./app/tts-cache.js",
  "./app/tts.js",
  "./app/pronunciation-assessment.js",
  "./app/recognition.js",
  "./app/scoring.js",
  "./app/drills-ui.js",
  "./app/shadowing-ui.js",
  "./app/skill-tree.js",
  "./app/daily-challenge.js",
  "./app/settings-ui.js",
  "./app/progress-ui.js",
  "./app/main.js"
];

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
