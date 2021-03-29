import { HDAO } from './pages/hdao'
import { Random } from './pages/random'
import Sync from './pages/sync' // TODO: andrevenancio
import { About } from './pages/about'
import Display from './pages/display' // TODO: andrevenancio
import { Feed } from './pages/feed'
import { Mint } from './pages/mint'
import { ObjktDisplay } from './pages/objkt-display'
import Loading from './pages/loading' // TODO: andrevenancio

const routes = [
  {
    exact: true,
    path: '/',
    component: Feed,
    title: 'Feed'
  },
  {
    exact: true,
    path: '/hdao',
    component: HDAO,
    title: 'HDAO'
  },
  {
    exact: true,
    path: '/random',
    component: Random,
    title: 'Random'
  },
  {
    path: '/tz/:id',
    component: Display,
    title: 'Display'
  },
  {
    path: '/about',
    component: About,
    title: 'About'
  },
  {
    path: '/sync',
    component: Sync,
    title: 'Sync'
  },
  {
    path: '/mint',
    component: Mint,
    title: 'Mint'
  },
  {
    path: '/objkt/:id',
    component: ObjktDisplay,
    title: 'ObjktDisplay'
  },
  {
    path: '/load',
    component: Loading,
    title: 'Loading'
  }
]

export default routes