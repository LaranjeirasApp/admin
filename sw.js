try {
  importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
  importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

  firebase.initializeApp({
    apiKey: "AIzaSyBKDqCKiV2OzqDUMYTU1BJLNG9oFAGpMeU",
    authDomain: "controlequadras-95e02.firebaseapp.com",
    databaseURL: "https://controlequadras-95e02-default-rtdb.firebaseio.com",
    projectId: "controlequadras-95e02",
    storageBucket: "controlequadras-95e02.firebasestorage.app",
    messagingSenderId: "548582626548",
    appId: "1:548582626548:web:0858affd903b39c6743aa1"
  });

  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || "Laranjeiras Admin";
    const options = { body: payload.notification?.body || "", icon: "icons/icon-192.png" };
    self.registration.showNotification(title, options);
  });
} catch (e) {
  console.warn("[SW] Firebase messaging não inicializado:", e);
}

const CACHE = "laranjeiras-admin-v13";
const ASSETS = ["./index.html", "./admin.css", "./admin.js", "./firebase-config.js", "./manifest.json", "./icon-admin.png", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first: sempre busca a versão mais nova online; só usa o cache como
// fallback quando o dispositivo está offline. Evita servir telas desatualizadas
// depois de um deploy novo.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
