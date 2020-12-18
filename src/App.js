import React from 'react';
import './App.css';
import Sync from './components/Sync'
import HicetnuncContextProvider from './context/HicetnuncContext'
import About from './components/About'
import AppNavbar from './components/AppNavbar'
import Home from './components/Home';
import {
  BrowserRouter as Router,
  ContextRouter,
  Switch,
  Route,
  Link
} from "react-router-dom"
import Display from './components/Display';
import OpenSource from './components/OpenSource';
import Feed from './components/Feed';
import KTDisplay from './components/KTDisplay';
import Contribution from './components/Contribution';
import Withdraw from './components/Withdraw';
import IPFS from './components/IPFS';
import IPFSimg from './components/IPFSimg';

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
          <Route exact path="/ipfs">
            <IPFS />
          </Route>
          <Route exact path="/cid">
            <IPFSimg />
          </Route>
        </Switch>
      </Router>
    </HicetnuncContextProvider>
  );
}

export default App;
