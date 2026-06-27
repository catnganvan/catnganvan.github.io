// Minimal service worker: cache core assets so the app shell
// loads offline. Speech recognition still requires network on
// most browsers (it streams audio to a recognition service),
// but the UI itself will load offline once cached.
const CACHE_NAME = "speakvn-v3";
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
  // Activate this new SW as soon as it's installed, instead of waiting for
  // every open tab on the old SW to close — otherwise a fixed/updated
  // deploy can keep getting served from the previous SW's stale cache.
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      // Take control of any already-open tabs immediately so they start
      // getting fresh assets on their very next request, without needing
      // a manual hard-refresh or closing/reopening the tab.
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => cached))
  );
});
