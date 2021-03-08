import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap'
import { Redirect } from 'react-router-dom'
import Menu from './Menu'
import { BabelLoading } from 'react-loadingg'

const axios = require('axios')

export default class Sync extends Component {
  constructor(props) {
    super(props)
  }

  static contextType = HicetnuncContext

  /* 
    initializes session
    */

  componentWillMount = async () => {
    this.context.dAppClient()
  }

  refresh = async () => {
    window.location.reload()
  }

  render() {
    let load = {
      border: 'black',
    }

    let style = {
      position: 'absolute',
      listStyle: 'none',
      top: '0',
      marginTop: '20%',
      border: '0',
    }

    return (
      <div>
        {this.context.address != '' ? (
          <Redirect to={`/tz/${this.context.address}`} />
        ) : !this.context.collapsed ? (
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <Menu />
            </Col>
          </Row>
        ) : (
          <div style={{ marginTop: '35vh', verticalAlign: 'middle' }}>
            <Row>
              <Col sm="12" md={{ position: 'fixed', size: 6, offset: 3 }}>
                <span style={{ margin: 'auto', display: 'table' }}>
                  requesting permissions{' '}
                  <a
                    style={{
                      color: '#000',
                      '&:hover': {
                        color: '#000',
                      },
                    }}
                    href="/sync"
                  >
                    try again?
                  </a>
                </span>
                <br />
              </Col>
            </Row>
            <BabelLoading
            className='celLoad'
              style={{
                backgroundColor: 'black',
                display: 'inline-block',
                position: 'absolute',
                right: '50%',
                left: '50%',
              }}
            />
          </div>
        )}
      </div>
    )
  }
}
