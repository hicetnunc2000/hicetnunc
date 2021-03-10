import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HicetnuncContextProvider from './context/HicetnuncContext'
import Sync from './pages/sync'
import About from './pages/about'
import Display from './pages/display'
import Feed from './pages/feed'
import Mint from './pages/mint'
import ObjktDisplay from './pages/objkt-display'
import Loading from './pages/loading'
import { Header } from './components/header'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <HicetnuncContextProvider>
      <Header />
      <Switch>
        <Route exact path="/" component={Feed} />
        <Route path="/tz/:id" component={Display} />
        <Route path="/feed" component={Feed} />
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
