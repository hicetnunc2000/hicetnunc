import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import HicetnuncContextProvider from './context/HicetnuncContext'
import Sync from './pages/sync'
import About from './pages/about'
import Display from './pages/display'
import Feed from './pages/feed'
import Mint from './pages/mint'
import ObjktDisplay from './pages/objkt-display'
import Loading from './pages/loading'
import AppNavbar from './components/AppNavbar'
import Disclaimer from './components/Disclaimer'
import './App.css'

function App() {
  return (
    <HicetnuncContextProvider>
      <AppNavbar />
      <Router>
        <Switch>
          <Route exact path="/" component={Feed} />
          <Route exact path="/tz/:id" component={Display} />
          <Route exact path="/feed" component={Feed} />
          <Route exact path="/about" component={About} />
          <Route exact path="/sync" component={Sync} />
          <Route exact path="/mint" component={Mint} />
          <Route exact path="/objkt/:id" component={ObjktDisplay} />
          <Route exact path="/load" component={Loading} />
        </Switch>
      </Router>
      <Disclaimer />
    </HicetnuncContextProvider>
  )
}

export default App
