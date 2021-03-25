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
import { setLanguage } from './constants'
import { HDAO } from './pages/hdao'
import { Random } from './pages/random'

const App = () => {
  const [loading, setLoading] = useState(true)
  // 1st time loading the site
  //
  useEffect(() => {
    const language = getItem('language') || setItem('language', 'en')
    fetch(
      `https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/languages/${language}.json`
    )
      .then((e) => e.json())
      .then((data) => {
        setLanguage(data)
        setLoading(false)
      })
      .catch(() => {
        console.log('failed to load language')
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
        <Route exact path="/" component={Feed} />
        <Route exact path="/hdao" component={HDAO} />
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
