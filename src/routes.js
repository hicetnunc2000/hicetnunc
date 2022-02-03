import Sync from './pages/sync'
import { About } from './pages/about'
import { FAQ } from './pages/faq'
import Display from './pages/display'
import { Latest, Hdao, Random } from './pages/feeds'
import { Mint } from './pages/mint'
import { ObjktDisplay } from './pages/objkt-display'
import { Collaborate, CollabDisplay } from './pages/collaborate'
import { Galleries } from './pages/galleries'
import { GalleryDetail } from './pages/gallery-detail'
import { Config } from './pages/config'
import { Search } from './pages/search'
import { Tags } from './pages/tags'

export const routes = [
  {
    exact: true,
    path: '/',
    component: Search,
  },
  {
    exact: false,
    path: '/hdao',
    component: Hdao,
  },
  {
    exact: false,
    path: '/random',
    component: Random,
  },
  {
    exact: false,
    path: '/latest',
    component: Latest,
  },
  {
    exact: false,
    path: '/tz/:id/:collection?',
    component: Display,
  },
  {
    exact: false,
    path: '/kt/:id',
    component: CollabDisplay,
  },
  {
    exact: false,
    path: '/collab/:name',
    component: CollabDisplay,
  },
  {
    exact: false,
    path: '/about',
    component: About,
  },
  {
    exact: false,
    path: '/faq',
    component: FAQ,
  },
  {
    exact: false,
    path: '/sync',
    component: Sync,
  },
  {
    exact: false,
    path: '/mint',
    component: Mint,
  },
  {
    exact: false,
    path: '/collaborate/:action?',
    component: Collaborate,
  },
  {
    exact: false,
    path: '/objkt/:id',
    component: ObjktDisplay,
  },
  {
    exact: false,
    path: '/galleries',
    component: Galleries,
  },
  {
    exact: false,
    path: '/gallery/:id',
    component: GalleryDetail,
  },

  //
  //add condition for verifying if user is synced
  ///////////////
  {
    exact: false,
    path: '/config',
    component: Config,
  },
  {
    exact: false,
    path: '/search',
    component: Search,
  },
  {
    exact: false,
    path: '/tags/:id',
    component: Tags,
  },
  {
    exact: false,
    path: '/:id/:collection?',
    component: Display,
  },
]
