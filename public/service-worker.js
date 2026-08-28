const CACHE_NAME = "student-stage-shell-v1";
const SHELL_ASSETS = ["/", "/index.html", "/manifest.webmanifest"];

function isCacheableShellRequest(request) {
  const requestUrl = new URL(request.url);
  const hasAuthorization = request.headers.has("Authorization");
  const isApiRequest =
    requestUrl.pathname === "/api" || requestUrl.pathname.startsWith("/api/");
  const isStaticAsset = requestUrl.pathname.startsWith("/assets/");
  const isListedShellAsset = SHELL_ASSETS.includes(requestUrl.pathname);

  return (
    requestUrl.origin === self.location.origin &&
    request.method === "GET" &&
    !hasAuthorization &&
    !isApiRequest &&
    (isListedShellAsset || isStaticAsset)
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (!isCacheableShellRequest(event.request)) return;

  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((response) => {
            if (response.ok && response.type === "basic") {
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(event.request, response.clone()));
            }
            return response;
          })
          .catch(() => Response.error()),
    ),
  );
});
