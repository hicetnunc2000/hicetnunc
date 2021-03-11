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

export const MINT_MAX_LIMIT = 10000
export const MINT_MIN_LIMIT = 1

export const MIMETYPE = {
  BMP: 'image/bmp',
  GIF: 'image/gif',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  SVG: 'image/svg+xml',
  WEBP: 'image/webp',
  MP4: 'video/mp4',
  OGG: 'video/ogg',
  QUICKTIME: 'video/quicktime',
  GLTF: 'model/gltf-binary',
  GLB: 'model/gltf+json',
}
export const ALLOWED_MIMETYPES = Object.keys(MIMETYPE).map((k) => MIMETYPE[k])
