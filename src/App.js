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
import OpenSource from './components/OpenSource';
import Feed from './components/Feed';
import KTDisplay from './components/KTDisplay';
import Contribution from './components/Contribution';
import Withdraw from './components/Withdraw';
import Mint from './components/Mint';
import ObjktDisplay from './components/ObjktDisplay';
import UpdateMetadata from './components/microfunding/UpdateMetadata';
import Curate from './components/Curate'

function App() {
  return (
    <HicetnuncContextProvider>
      <AppNavbar />
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/tz/:id">
            <Display />
          </Route>
          <Route exact path="/kt/:id">
            <KTDisplay />
          </Route>
          <Route exact path="/feed">
            <Feed />
          </Route>
          <Route exact path="/opensource">
            <OpenSource />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/sync">
            <Sync />
          </Route>
          <Route exact path="/contribute/:id">
            <Contribution />
          </Route>
          <Route exact path="/withdraw/:id">
            <Withdraw />
          </Route>
          <Route exact path="/mint">
            <Mint />
          </Route>
          <Route exact path="/objkt/:id">
            <ObjktDisplay />
          </Route>
          <Route exact path="/view/:tz">
          </Route>
          <Route exact path="/update_metadata/:id">
            <UpdateMetadata />
          </Route>
          <Route exact path="/swap/:kt">
            <Curate />
          </Route>
        </Switch>
      </Router>
    </HicetnuncContextProvider>
  );
}

export default App;
