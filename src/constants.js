export const PATH = {
  FEED: '/',
  ISSUER: '/tz',
  ABOUT: '/about',
  SYNC: '/sync',
  MINT: '/mint',
  OBJKT: '/objkt',
  LOAD: '/load', // TODO: check if this is being used?
}

export const ROUTES = {
  FEED: { exact: true, path: '/', component: null },
  ISSUER: { exact: false, path: '/tz/:id', component: null },
  ABOUT: { exact: false, path: '/about', component: null },
  SYNC: { exact: false, path: '/sync', component: null },
  MINT: { exact: false, path: '/mint', component: null },
  OBJKT: { exact: false, path: '/objkt/:id', component: null },
  LOAD: { exact: false, path: '/load', component: null }, // TODO: check if this is being used?
}

export const MINT_MIN_LIMIT = 1
export const MINT_MAX_LIMIT = 10000
export const MINT_FILESIZE = 40

export const MIMETYPE = {
  BMP: 'image/bmp',
  GIF: 'image/gif',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  SVG: 'image/svg+xml',
  TIFF: 'image/tiff',
  WEBP: 'image/webp',
  MP4: 'video/mp4',
  OGV: 'video/ogg',
  QUICKTIME: 'video/quicktime',
  GLB: 'model/gltf-binary',
  GLTF: 'model/gltf+json',
  MP3: 'audio/mpeg',
  OGA: 'audio/ogg',
}

export const ALLOWED_MIMETYPES = Object.keys(MIMETYPE).map((k) => MIMETYPE[k])
export const ALLOWED_FILETYPES = Object.keys(MIMETYPE)
