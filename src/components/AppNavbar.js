import 'bootstrap/dist/css/bootstrap.css'
import React, { useState, Component } from 'react'
import { Redirect } from 'react-router-dom'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'
import { Card, Col, Row } from 'reactstrap'
import { keyframes } from 'styled-components'
import { HicetnuncContext } from '../context/HicetnuncContext'
import Button from './Button'
import '../App.css'

const axios = require('axios')

export default class AppNavbar extends Component {
  constructor(props) {
    super(props)
  }
  static contextType = HicetnuncContext

  componentWillMount = () => {
    console.log(window.location.pathname)
  }

  render() {
    let drop = {
      fontSize: '25px',
      marginTop: '150%',
      marginRight: '35px',
      textAlign: 'right',
    }

    var grow = keyframes`
        from { transform: scale(0.225); }
        to { transform: scale(1); }
    `

    let left = {
      height: '30px',
      width: '30px',
      //borderRadius: "50%",
      display: 'inline-block',
      marginTop: '13px',
      marginRight: '25px',
      right: '0',
      top: '0',
      position: 'absolute',
      //animation: `${grow} 3.5s infinite`
    }

    let dot = {
      display: 'inline-block',
      position: 'absolute',
      fontSize: '20px',
      top: '0',
      marginTop: '17px',
      color: '#000',
      '&:hover': {
        color: '#000',
      },
      textDecoration: 'none',

      /* animation: `${grow} 6s infinite` */
    }

    let logoLetters = {
      fontSize: '20px',
      top: '0',
      marginLeft: '40px',
      marginTop: '17px',
      position: 'absolute',
      color: '#000',
      fontStyle: 'normal',
      '&:hover': {
        color: '#000',
      },
      textDecoration: 'none',
    }

    let sync = {
      right: '0',
      position: 'absolute',
      top: '0',
      marginTop: '17px',
      marginRight: '70px',
    }

    return (
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100 }}>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Card
              className="nav"
              body
              style={{ border: '0', paddingBottom: '35px' }}
            >
              {' '}
              {/* { border: "none" } */}
              <a href="/" style={dot}>
                〇
              </a>
              {/* {!this.context.collapsed || window.location.pathname != '/' ? <a href="/" style={logoLetters}><i>hic et nunc</i></a> : null} */}
              <a href="/" style={logoLetters}>
                hic et nunc
              </a>
              <Button
                style={sync}
                onClick={this.context.syncTaquito}
                label="sync"
              >
                sync
              </Button>
              <div onClick={this.context.toogleNavbar}>
                <a href="#">
                  <img
                    style={left}
                    src={require('../media/menu-black-18dp.svg')}
                  />
                </a>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
/*
<div>
<Navbar color="faded" light>
    <NavbarBrand href="/" className="mr-auto" id="font">hicetnunc</NavbarBrand>
    <NavbarToggler style={{ border: "none" }} onClick={this.toogle} className="mr-2" />
</Navbar>
</div>   */
