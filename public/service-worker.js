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
        caches.match(event.request)
            .then (matchedResponse => {
                if (matchedResponse) {
                    console.log('Cache hit! Fetching response from cache', event.request.url)
                    return matchedResponse
                }

                var fetchRequest = event.request.clone()
                return fetch(fetchRequest).then (response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response
                    }

                    let responseToCache = response.clone()
                    caches.open('pokemon-cache')
                        .then (cache => {
                            cache.put(event.request, responseToCache)
                        })
                    return response
                })
            })
    )
})
