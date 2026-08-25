const CACHE = "alta-frequenza-v8";
const SHELL = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if (
    url.hostname.includes("infomaniak") ||
    url.hostname.includes("workers.dev") ||
    url.hostname.includes("alta-frequenza.corsica")
  ) return;

  if (event.request.method !== "GET") return;

  // Keep the icon out of the cache so the current logo is always used.
  if (url.pathname.endsWith("/alta-icon-v8.png")) return;

  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).catch(() => caches.match("./index.html"))
    )
  );
});