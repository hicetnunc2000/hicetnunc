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