let cache = {}

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'resources') {
    cache = event.data.payload
  }
})

self.addEventListener('fetch', event => {
  const url = event.request.url
  const ref = event.request.referrer.split('?')[0]
  const path = url.replace(ref, '')

  if (cache[path]) {
    const res = new Response(cache[path])
    event.respondWith(Promise.resolve(res))
  } else {
    event.respondWith(
      fetch(event.request)
    )
  }
})
