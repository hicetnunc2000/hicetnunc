import React, { useEffect, useState } from 'react'
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
import { Loading as Preloading } from './components/loading'
import { getItem, setItem } from './utils/storage'

const App = () => {
  const [loading, setLoading] = useState(true)
  // 1 load language file if provided

  // 1st time loading the site
  useEffect(() => {
    const language = getItem('language') || setItem('language', 'en')
    console.log('language')
  }, [])

  if (loading) {
    return <Preloading />
  }
  return (
    <HicetnuncContextProvider>
      <Header />
      <Switch>
        <Route exact path="/" component={Feed} />
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
