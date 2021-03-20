let LANGUAGE = {
  header: {
    sync: 'sync',
    menu: [
      { primary: 'OBJKTs', secondary: '(mint NFTs)', route: '/mint' },
      { primary: 'manage asseets', route: '/sync' },
      { primary: 'about', route: '/about' },
    ],
  },
  footer: {
    mint: 'sync -> collect // sync -> mint // sync -> swap',
  },
  home: {
    latest: 'latest',
    hDAO: 'hDAO',
    more: 'Load More',
  },
  mint: {
    title: 'title',
    description: 'description',
    tags: 'tags (separated by commas)',
    amount: "amount of OBJKT's to mint",
    upload: 'Upload OBJKT',
    supports: 'supports',
    preview: 'preview',
    mint: 'mint',
    warning: 'this operation costs 0.08~ tez. 10% royalties are set by default',
  },
  manage: {
    creations: 'creations',
    collection: 'collection',
  },
  about: {
    title: 'hic et nunc',
    paragraphs: [
      'The present decentralized application allows its users to manage decentralized digital assets, serving as a public smart contract infrastructure on Tezos Blockchain.',
      'IPFS NFTs can be minted and traded by permissionless means. such experiment was designed intending to imagine alternative crypto economies.',
      "We're concerned about your security and autonomy. please verify informations while making transactions.",
      'For consulting, networking or questions get in touch by %EMAIL%, %DISCORD%, or on %REDDIT%.',
      'Please read through our %FAQS%.',
      "If you're having trouble with the website, please report an %ISSUE%",
    ],
  },
  detail: {
    issuer: 'Issuer',
    notForSale: 'Not for sale',
    soldOut: 'Sold out',
    collect: 'Collect for %PRICE%',
    menuInfo: 'info',
    menuOwners: 'owners',
    menuSwap: 'swap',
    menuCancel: 'cancel',
    menuBurn: 'burn',
    info: {
      title: 'TITLE',
      description: 'DESCRIPTION',
      tags: 'TAGS',
    },
    owners: {
      title: 'no owners',
    },
    swap: {
      amount: 'OBJKT amount',
      price: 'price per OBJKT (in tez)',
      cta: 'swap it',
      warning:
        'swaps which carry value are charged with a 2.5% fee for platform maintenance',
    },
    cancel: {
      title: "you're about to cancel your swap",
      cta: 'cancel it',
    },
    burn: {
      title: 'Burning your NFT will permanently delete it from the network',
      cta: 'burn it',
    },
    confirm: 'Are you sure?',
  },
}
export const setLanguage = (data) => (LANGUAGE = data)
export const getLanguage = () => LANGUAGE

export const PATH = {
  FEED: '/',
  ISSUER: '/tz',
  ABOUT: '/about',
  SYNC: '/sync',
  MINT: '/mint',
  OBJKT: '/objkt',
}

export const ROUTES = {
  FEED: { exact: true, path: '/', component: null },
  ISSUER: { exact: false, path: '/tz/:id', component: null },
  ABOUT: { exact: false, path: '/about', component: null },
  SYNC: { exact: false, path: '/sync', component: null },
  MINT: { exact: false, path: '/mint', component: null },
  OBJKT: { exact: false, path: '/objkt/:id', component: null },
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
  // HTML: 'text/html', // temp disable
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
}

export const ALLOWED_MIMETYPES = Object.keys(MIMETYPE).map((k) => MIMETYPE[k])
export const ALLOWED_FILETYPES = Object.keys(MIMETYPE)
