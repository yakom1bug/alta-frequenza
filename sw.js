const CACHE = "alta-frequenza-v6";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon1-180.png"];

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

  // Never cache radio audio or live metadata.
  if (
    url.hostname.includes("infomaniak") ||
    url.hostname.includes("workers.dev") ||
    url.hostname.includes("alta-frequenza.corsica")
  ) return;

  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).catch(() => caches.match("./index.html"))
    )
  );
});
