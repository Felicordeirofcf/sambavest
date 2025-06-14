// Service Worker para cache e estratégia de rede

const CACHE_NAME = 'sambavest-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/base.css',
    '/css/header.css',
    '/css/hero.css',
    '/css/carousel.css',
    '/css/featured-products.css',
    '/css/instagram-section.css',
    '/css/products.css',
    '/css/about.css',
    '/css/contact.css',
    '/css/footer.css',
    '/css/main.css',
    '/js/main.js',
    '/js/carousel.js',
    '/js/featured-products.js',
    '/js/responsive-images.js',
    '/js/header.js',
    '/js/contact.js',
    '/js/products.js',
    '/js/marketing-tracker.js',
    '/js/image-optimization-config.js',
    '/images/logos/logo.jpg',
    '/images/banners/banner-desktop-1.webp',
    '/images/products/promo.jpg',
    '/images/products/camisa-salgueiro-frente.jpg',
    '/images/products/salgueiro-verso.jpg',
    '/images/products/camisa-viradouro-frente.jpg',
    '/images/products/viradouro-verso.jpg',
    '/images/products/camisa-beija-flor-frente.jpg',
    '/images/products/beija-flor-verso.jpg',
    '/images/products/camisa-mangueira-frente.jpg',
    '/images/products/mangueira-verso.jpg',
    '/images/instagram/insta-placeholder-1.jpg',
    '/images/instagram/insta-placeholder-2.jpg',
    '/images/instagram/insta-placeholder-3.jpg',
    '/images/instagram/insta-placeholder-4.jpg',
    '/images/instagram/insta-placeholder-5.jpg',
    '/images/instagram/insta-placeholder-6.jpg',
    '/images/about-us.jpg',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

