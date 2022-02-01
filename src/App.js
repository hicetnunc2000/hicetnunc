import React, { useEffect, useState } from 'react'
import { Switch, Route, BrowserRouter, HashRouter } from 'react-router-dom'
import HicetnuncContextProvider from './context/HicetnuncContext'
import { getInitialData } from './data/api'
import { Header } from './components/header'
import { Loading as Preloading } from './components/loading'
import { FeedbackComponent } from './components/feedback'
import { routes } from './routes'
import { Galleries } from './pages/galleries'
import { Config } from './pages/config'
import { Search } from './pages/search'
import { Latest, Hdao, Random, Featured } from './pages/feeds'
import Display from './pages/display'
import { About } from './pages/about'
import { FAQ } from './pages/faq'
import { CollabDisplay, Collaborate } from './pages/collaborate'
import { ObjktDisplay } from './pages/objkt-display'
import { GalleryDetail } from './pages/gallery-detail'

const App = () => {
  const [loading, setLoading] = useState(true)

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
      <FeedbackComponent />
      <HashRouter>
        <Switch>
          {routes.map(({ exact, path, component: Comp }) => (
            <Route path={path} exact={exact} key={path} component={Comp} />
          ))}
        </Switch>
      </HashRouter>
    </HicetnuncContextProvider>
  )
}

export default App
