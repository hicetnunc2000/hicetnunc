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
    title: 'Feeds',
  },
  {
    exact: false,
    path: '/tz/:id',
    component: Display,
    title: 'Display',
  },
  {
    exact: false,
    path: '/about',
    component: About,
    title: 'About',
  },
  {
    exact: false,
    path: '/sync',
    component: Sync,
    title: 'Sync',
  },
  {
    exact: false,
    path: '/mint',
    component: Mint,
    title: 'Mint',
  },
  {
    exact: false,
    path: '/objkt/:id',
    component: ObjktDisplay,
    title: 'ObjktDisplay',
  },
]

export default routes
