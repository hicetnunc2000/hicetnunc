import React, { Component } from 'react'
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
import Menu from './Menu'

export default class About extends Component {
  constructor(props) {
    super(props)

    this.state = {
      reveal: false,
    }
  }

  static contextType = HicetnuncContext

  reveal = () => {
    this.setState({
      reveal: !this.state.reveal,
    })
  }

  render() {
    let subList = {
      listStyle: 'none',
      fontSize: '26px',
    }

    let style = {
      position: 'absolute',
      listStyle: 'none',
      right: '0',
      top: '0',
      marginTop: '15%',
      marginRight: '25px',
      fontFamiliy: 'roboto',
      textAlign: 'right',
      fontSize: '40px',
      animation: 'fadeMe 1.2s',
    }

    return (
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          {!this.context.collapsed ? (
            <Menu />
          ) : (
            <div style={{ animation: 'fadeMe 1.2s' }}>
              <div
                style={{ padding: '15% 0', border: 0, textAlign: 'justify' }}
              >
                <p style={{ fontWeight: 'bold' }}></p>
                <p style={{ fontWeight: 'bold' }}>
                  <a
                    style={{
                      color: '#000',
                      '&:hover': {
                        color: '#000',
                      },
                    }}
                    href="https://github.com/hicetnunc2000"
                  >
                    <i>hic et nunc</i> stack
                  </a>
                </p>
                <p>
                  the present decentralized application allows it's users to
                  manage decentralized digital assets, serving as a public smart
                  contract infrastructure on Tezos Blockchain.
                </p>
                <p>
                  IPFS NFTs can be minted and traded by permissionless means.
                  such experiment was designed intending to imagine alternative
                  crypto economies.
                </p>
                <p>
                  we're concerned about your security and autonomy. please
                  verify informations while making transactions.
                </p>
                <p>for consulting, networking or questions:</p>
                <a
                  style={{
                    color: '#000',
                    '&:hover': {
                      color: '#000',
                    },
                  }}
                  href="https://discord.gg/jKNy6PynPK"
                >
                  discord
                </a>
                <br />
                <a
                  style={{
                    color: '#000',
                    '&:hover': {
                      color: '#000',
                    },
                  }}
                  href="mailto:hicetnunc2000@protonmail.com"
                >
                  hicetnunc2000@protonmail.com
                </a>
                <br />
              </div>
            </div>
          )}
        </Col>
      </Row>
    )
  }
}
