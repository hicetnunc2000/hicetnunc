import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import { Redirect } from 'react-router-dom'
import { BabelLoading } from 'react-loadingg'
import Menu from '../components/Menu'
import { HicetnuncContext } from '../context/HicetnuncContext'

export default class Sync extends Component {
  static contextType = HicetnuncContext

  componentWillMount = async () => {
    this.context.dAppClient()
  }

  render() {
    return (
      <div>
        {this.context.address !== '' ? (
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
              className="celLoad"
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
