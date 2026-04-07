const CACHE = 'ebt-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/state.js',
  '/js/nav.js',
  '/js/practice.js',
  '/js/exam.js',
  '/js/overview.js',
  '/js/data/questions.js',
  '/manifest.json',
  '/images/questions/general_21_question.png',
  '/images/questions/general_55_question.jpg',
  '/images/questions/general_70_question.png',
  '/images/questions/general_130_question.png',
  '/images/questions/general_176_question.png',
  '/images/questions/general_181_question.jpg',
  '/images/questions/general_187_question.png',
  '/images/questions/general_209_question.png',
  '/images/questions/general_216_question.jpg',
  '/images/questions/general_226_question.png',
  '/images/questions/general_235_question.jpg',
  '/images/questions/berlin_1_question.png',
  '/images/questions/berlin_8_question.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
      .catch(() => new Response('Offline – bitte später erneut versuchen.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      }))
  );
});
