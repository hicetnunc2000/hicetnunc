import * as fflate from 'fflate'
import mime from 'mime-types'

export async function prepareFilesFromZIP (buffer) {
  // unzip files
  const files = await unzipBuffer(buffer)

  // inject CSP meta tag
  const indexBlob = files['index.html']
  const indexBuffer = await indexBlob.arrayBuffer()
  const safeIndexBuffer = injectCSPMetaTagIntoBuffer(indexBuffer)
  files['index.html'] = new Blob([safeIndexBuffer], {
    type: indexBlob.type
  })

  return files
}

export async function unzipBuffer (buffer) {
  let entries = fflate.unzipSync(buffer)
  entries = Object.entries(entries)
    .filter(entry => entry[1].length !== 0)
    .map(entry => {
      return {
        path: entry[0],
        data: entry[1]
      }
    })

  // Find root dir
  let rootDir = null
  for (let i = 0; i < entries.length; i++) {
    const parts = entries[i].path.split('/')
    const filename = parts[parts.length - 1]
    if (filename === 'index.html') {
      const parts = entries[i].path.split('/')
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

  // Create files map
  const files = {}
  entries.forEach((entry, index) => {
    const relPath = entry.path.replace(`${rootDir}/`, '')
    files[relPath] = new Blob([entry.data], {
      type: mime.lookup(entry.path)
    })
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
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline';">
  `)

  // doc -> HTML
  return doc.documentElement.innerHTML
}