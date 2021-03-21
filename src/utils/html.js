import * as zip from '@zip.js/zip.js/dist/zip-full'
import mime from 'mime-types'

export async function prepareFilesFromZIP (uri) {
  // unzip
  const files = await unzipDataURI(uri)

  // inject CSP meta tag
  const indexBlob = files['index.html'].blob
  const indexBuffer = await indexBlob.arrayBuffer()
  const safeIndexBuffer = injectCSPMetaTagIntoBuffer(indexBuffer)
  files['index.html'].blob = new Blob([safeIndexBuffer], {
    type: indexBlob.type
  })

  return files
}

export async function unzipDataURI (uri) {
  const zipReader = new zip.ZipReader(new zip.Data64URIReader(uri))
  let entries = await zipReader.getEntries()

  // Find root dir
  let rootDir = null
  for (let i = 0; i < entries.length; i++) {
    const parts = entries[i].filename.split('/')
    const filename = parts[parts.length - 1]
    if (filename === 'index.html') {
      const parts = entries[i].filename.split('/')
      parts.pop()
      rootDir = parts.join('/')
      break
    }
  }

  if (rootDir === null) {
    const msg = 'No index.html file found!'
    window.alert(msg)
    throw new Error(msg)
  }

  // Truncate paths
  entries = entries.map(entry => {
    entry.relativePath = entry.filename.replace(`${rootDir}/`, '')
    return entry
  })

  // get file blobs
  const promises = []
  entries.forEach(entry => {
    const mimeType = mime.lookup(entry.filename)
    promises.push(entry.getData(new zip.BlobWriter(mimeType)))
  })
  const results = await Promise.all(promises)
  await zipReader.close()

  // create files map
  const files = {}
  entries.forEach((entry, index) => {
    files[entry.relativePath] = {
      blob: results[index],
      directory: entry.directory
    }
  })

  return files
}

export function injectCSPMetaTagIntoDataURI(dataURI) {
  // data URI -> HTML
  const prefix = 'data:text/html;base64,'
  const base64 = dataURI.replace(prefix, '')
  const html = atob(base64)

  // inject CSP meta tag
  const safeHTML = injectCSPMetaTagIntoHTML(html)

  // HTML -> data URI
  return `${prefix}${btoa(safeHTML)}`
}

export function injectCSPMetaTagIntoBuffer(buffer) {
  // buffer -> HTML
  const html = new TextDecoder().decode(buffer)

  // inject CSP meta tag
  const safeHTML = injectCSPMetaTagIntoHTML(html)

  // HTML -> buffer
  return new TextEncoder().encode(safeHTML)
}

export function injectCSPMetaTagIntoHTML(html) {
  // HTML -> doc
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // remove any existing CSP meta tags
  const existing = doc.head.querySelectorAll('meta[http-equiv="Content-Security-Policy"]')
  if (existing.length) {
    for (let i = 0; i < existing.length; i++) {
      existing[i].remove()
    }
  }

  // inject CSP meta tag
  doc.head.insertAdjacentHTML('afterbegin', `
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'">
  `)

  // doc -> HTML
  return doc.documentElement.innerHTML
}