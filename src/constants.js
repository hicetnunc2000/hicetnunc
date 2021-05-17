let LANGUAGE = {}
export const setLanguage = (data) => (LANGUAGE = data)
export const getLanguage = () => LANGUAGE

let objktBlockList = []
export const setObjktBlockList = (data) => (objktBlockList = data)
export const getObjktBlockList = () => objktBlockList

let walletBlockList = []
export const setWalletBlockList = (data) => (walletBlockList = data)
export const getWalletBlockList = () => walletBlockList

let banBlockList = []
export const setBanBlockList = (data) => (banBlockList = data)
export const getBanBlockList = () => banBlockList

export const PATH = {
  FEED: '/',
  ISSUER: '/tz',
  ABOUT: '/about',
  SYNC: '/sync',
  MINT: '/mint',
  OBJKT: '/objkt',
  GALLERY: '/gallery',
  TAGS: '/tags',
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
  WEBM: 'video/webm',
  GLB: 'model/gltf-binary',
  GLTF: 'model/gltf+json',
  MP3: 'audio/mpeg',
  OGA: 'audio/ogg',
  WAV: 'audio/wav',
  FLAC: 'audio/flac',
  PDF: 'application/pdf',
  ZIP: 'application/zip',
  ZIP1: 'application/x-zip-compressed',
  ZIP2: 'multipart/x-zip',
}

export const IPFS_DIRECTORY_MIMETYPE = 'application/x-directory'

export const ALLOWED_MIMETYPES = Object.keys(MIMETYPE)
  .map((k) => MIMETYPE[k])
  .filter((e) => e !== MIMETYPE.GLTF) // disabling GLTF from new updates

export const ALLOWED_FILETYPES_LABEL = Object.entries(MIMETYPE)
  .filter((e) => ALLOWED_MIMETYPES.includes(e[1]))
  .filter((e) => !['ZIP1', 'ZIP2'].includes(e[0]))
  .map((e) => (e[0] === 'ZIP' ? 'HTML (ZIP ARCHIVE)' : e[0]))
  .join(', ')

export const ALLOWED_COVER_MIMETYPES = [
  MIMETYPE.JPEG,
  MIMETYPE.PNG,
  MIMETYPE.GIF,
]

export const ALLOWED_COVER_FILETYPES_LABEL = ['jpeg, png, gif']

export const MAX_EDITIONS = 10000  // Limited by contract

export const MIN_ROYALTIES = 10    // Limited by contract

export const MAX_ROYALTIES = 25    // Limited by contract

export const IPFS_DISPLAY_URI_BLACKCIRCLE =
  'ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc'
