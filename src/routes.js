import Sync from './pages/sync'
import { About } from './pages/about'
import Display from './pages/display'
import { Latest, Hdao, Random } from './pages/feeds'
import { Mint } from './pages/mint'
import { ObjktDisplay } from './pages/objkt-display'

export const routes = [
  {
    exact: true,
    path: '/',
    component: Latest,
    title: 'Latest Feed',
  },
  {
    exact: false,
    path: '/hdao',
    component: Hdao,
    title: 'hDAO Feed',
  },
  {
    exact: false,
    path: '/random',
    component: Random,
    title: 'Random Feed',
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
