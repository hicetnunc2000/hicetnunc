import Sync from './pages/sync'
import { About } from './pages/about'
import Display from './pages/display'
import { Latest, Hdao, Random, Featured } from './pages/feeds'
import { Mint } from './pages/mint'
import { ObjktDisplay } from './pages/objkt-display'
import { ProxyContract } from './pages/proxy-contract'
import { Galleries } from './pages/galleries'
import { GalleryDetail } from './pages/gallery-detail'

export const routes = [
  {
    exact: true,
    path: '/',
    component: Featured,
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
    path: '/tz/:id',
    component: Display,
  },
  {
    exact: false,
    path: '/about',
    component: About,
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
    path: '/objkt/:id',
    component: ObjktDisplay,
  },
  {
    exact: false,
    path: '/proxy',
    component: ProxyContract,
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
]
