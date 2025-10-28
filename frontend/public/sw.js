const CACHE_NAME = 'copycomtlax-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico'
];


//Instalación del SW y cacheo inicial
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Archivos cacheados');
      return cache.addAll(urlsToCache);
    })
  );
});

//Activación del SW y limpieza de versiones antiguas
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activado');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
             .map((key) => {
               console.log('[Service Worker] Borrando caché vieja:', key);
               return caches.delete(key);
             })
      );
    })
  );
});

//Interceptar peticiones y responder desde caché o red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match('/Offline.html'))
      );
    })
  );
});

//Notificaciones push (opcional)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.text() : 'Notificación sin texto';
  event.waitUntil(
    self.registration.showNotification('Copycomtlax', {
      body: data,
      icon: '/logo192.png'
    })
  );
});
