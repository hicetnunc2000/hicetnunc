import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HicetnuncContextProvider from './context/HicetnuncContext'
import Sync from './pages/sync' // TODO: andrevenancio
import { About } from './pages/about'
import Display from './pages/display' // TODO: andrevenancio
import { Feed } from './pages/feed'
import { Mint } from './pages/mint'
import { ObjktDisplay } from './pages/objkt-display'
import Loading from './pages/loading' // TODO: andrevenancio
import { Header } from './components/header'
import { Footer } from './components/footer'
import { HDAO } from './pages/hdao'
import { Random  } from './pages/random'

const App = () => {
  return (
    <HicetnuncContextProvider>
      <Header />
      <Switch>
        <Route exact path="/latest" component={Feed} />
        <Route exact path="/" component={HDAO} />
        <Route exact path="/random" component={Random} />
        <Route path="/tz/:id" component={Display} />
        <Route path="/about" component={About} />
        <Route path="/sync" component={Sync} />
        <Route path="/mint" component={Mint} />
        <Route path="/objkt/:id" component={ObjktDisplay} />
        <Route path="/load" component={Loading} />
      </Switch>
      <Footer />
    </HicetnuncContextProvider>
  )
}

export default App
