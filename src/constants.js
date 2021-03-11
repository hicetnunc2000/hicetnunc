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
