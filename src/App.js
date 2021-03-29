import React, { useEffect, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import HicetnuncContextProvider from './context/HicetnuncContext'
import { Header } from './components/header'
import { Page } from './components/layout'
import { Footer } from './components/footer'
import { Loading as Preloading } from './components/loading'
import { getItem, setItem } from './utils/storage'
import { setLanguage } from './constants'
import routes from './routes'

const App = () => {
  const [loading, setLoading] = useState(true)
  // 1st time loading the site
  //
  useEffect(() => {
    const language = getItem('language') || setItem('language', 'en')
    const langRoot =
      process.env.NODE_ENV === 'development'
        ? '/languages'
        : 'https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/languages'
    fetch(`${langRoot}/${language}.json`)
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
        {routes.map(({ exact = false, path, component: Comp, title}) => (
          <Route path={path} exact={exact} key={path} render={() => (
            <Page title={title}>
              <Comp />
            </Page>
          )} />
        ))}
      </Switch>
      <Footer />
    </HicetnuncContextProvider>
  )
}

export default App
