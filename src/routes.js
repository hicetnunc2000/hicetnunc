import Sync from './pages/sync' // TODO: andrevenancio
import { About } from './pages/about'
import Display from './pages/display' // TODO: andrevenancio
import { Feeds } from './pages/feeds'
import { Mint } from './pages/mint'
import { ObjktDisplay } from './pages/objkt-display'

const routes = [
  {
    exact: true,
    path: '/',
    component: Feeds,
    title: 'Feeds'
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
  }
]

export default routes