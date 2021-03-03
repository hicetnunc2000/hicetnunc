import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  ContextRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Sync from './components/Sync'
import HicetnuncContextProvider from './context/HicetnuncContext'
import About from './components/About'
import AppNavbar from './components/AppNavbar'
import Home from './components/Home';
import Display from './components/Display';
import Feed from './components/Feed';
import Mint from './components/Mint';
import ObjktDisplay from './components/ObjktDisplay';
import Loading from './components/Loading';
import Disclaimer from './components/Disclaimer';
import { Element } from "react-scroll";


function App() {
  return (
    <HicetnuncContextProvider>
      <AppNavbar />
      <Router>
        <Switch>
          <Route exact path="/">
            <Feed />
          </Route>
          <Route exact path="/tz/:id">
            <Display />
          </Route>
          <Route exact path="/feed">
            <Feed />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/sync">
            <Sync />
          </Route>
          <Route exact path="/mint">
            <Mint />
          </Route>
          <Route exact path="/objkt/:id">
            <ObjktDisplay />
          </Route>
          <Route exact path="/view/:tz">
          </Route>
          <Route exact path="/load">
            <Loading />
          </Route>
        </Switch>
      </Router>
      <Disclaimer />
    </HicetnuncContextProvider>
  );
}

export default App;
