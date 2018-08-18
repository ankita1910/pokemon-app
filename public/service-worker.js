self.addEventListener('install', (event) => {
    console.log('Installing service worker...')
    const CACHE_NAME = 'pokemon-cache'
    const urlsToCache = [
        '/',
        './javascripts/list.js'
    ]
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then (cache => {
                cache.addAll(urlsToCache)
            })
    )

})

self.addEventListener('activate', (event) => {
    console.log('Activating service worker...')
    const cacheWhitelist = ['pokemon-cache']
    event.waitUntil(
        caches.keys()
            .then (cacheNames => {
                return Promise.all(
                    cacheNames.map (cacheName => {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open('pokemon-cache')
            .then (cache => {
                return cache.match(event.request).then (response => {
                    if (response) {
                        console.log('Cache hit! Fetching response from cache', event.request.url)
                        return response
                    }
                    fetch(event.request).then (response => {
                        cache.put(event.request, response.clone())
                        return response
                    })
                })
            })
    )
})
