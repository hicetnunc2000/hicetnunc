let cache = {}

self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'resources') {
    cache = {}
    for (let relPath in event.data.payload) {
      const basePath = event.data.basePath.replace('index.html', '')
      const absPath = basePath + relPath
      cache[absPath] = event.data.payload[relPath]
    }
  }
})

self.addEventListener('fetch', (event) => {
  const path = getURLPath(event.request.url)
  // console.log(path)
  if (cache[path]) {
    const res = new Response(cache[path])
    event.respondWith(Promise.resolve(res))
  } else {
    event.respondWith(fetch(event.request))
  }
})

function getURLPath(url, defaults) {
  var reUrlPath = /(?:\w+:)?\/\/[^\/]+([^?#]+)/
  var urlParts = url.match(reUrlPath) || [url, defaults]
  return urlParts.pop()
}
