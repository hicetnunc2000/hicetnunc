import 'bootstrap/dist/css/bootstrap.css'
import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Col, Row } from 'reactstrap'

export default class Header extends Component {
  static contextType = HicetnuncContext

  componentWillMount = () => {
    console.log(window.location.pathname)
  }

  render() {
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

    let logo = {
      right: '0',
      position: 'absolute',
      top: '0',
      marginTop: '17px',
      marginRight: '70px',
      color: '#000',
      '&:hover': {
        color: '#000',
      },
      textDecoration: 'none',
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
              <a href="#" style={logo} onClick={this.context.syncTaquito}>
                sync
              </a>
              <div onClick={this.context.toogleNavbar}>
                <a href="#">
                  <img
                    style={left}
                    src={require('../media/menu-black-18dp.svg')}
                    alt=""
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
