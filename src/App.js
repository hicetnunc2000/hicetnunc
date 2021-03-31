import React, { useEffect, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import HicetnuncContextProvider from './context/HicetnuncContext'
import Sync from './pages/sync' // TODO: andrevenancio
import { About } from './pages/about'
import Display from './pages/display' // TODO: andrevenancio
import { Feeds } from './pages/feeds'
import { Mint } from './pages/mint'
import { ObjktDisplay } from './pages/objkt-display'
import { Header } from './components/header'
import { Loading as Preloading } from './components/loading'
import { getInitialData } from './data/api'

const App = () => {
  const [loading, setLoading] = useState(true)

  // 1st time loading the site
  useEffect(() => {
    getInitialData().then(() => {
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Preloading />
  }

  return (
    <HicetnuncContextProvider>
      <Header />
      <Switch>
        <Route exact path="/" component={Feeds} />
        <Route path="/tz/:id" component={Display} />
        <Route path="/about" component={About} />
        <Route path="/sync" component={Sync} />
        <Route path="/mint" component={Mint} />
        <Route path="/objkt/:id" component={ObjktDisplay} />
      </Switch>
    </HicetnuncContextProvider>
  )
}

export default App
