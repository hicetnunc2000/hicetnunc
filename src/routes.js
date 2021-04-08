import Sync from './pages/sync'
import { About } from './pages/about'
import Display from './pages/display'
import { Latest, Hdao, Random } from './pages/feeds'
import { Mint } from './pages/mint'
import { ObjktDisplay } from './pages/objkt-display'
// import { Collections } from './pages/collections'

export const routes = [
  {
    exact: true,
    path: '/',
    component: Latest,
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
  // {
  //   exact: false,
  //   path: '/collections/:id',
  //   component: Collections,
  // },
]
