import React, { Component } from 'react'
import { Col, Row, Card } from 'reactstrap'
import { BabelLoading } from 'react-loadingg'
import Menu from '../components/Menu'
import { HicetnuncContext } from '../context/HicetnuncContext'

const axios = require('axios')

export default class ObjktDisplay extends Component {
  static contextType = HicetnuncContext

  state = {
    objkt_id: 0,
    objkt: {},
    balance: 0,
    info: true,
    owners_arr: [],
    owners: false,
    curate: false,
    loaded: false,
    cancel: false,
    test: false,
    value: 0,
    xtz_per_objkt: 0,
    objkt_amount: 0,
    royalties: 0,
  }

  componentWillMount = async () => {
    await axios
      .post(process.env.REACT_APP_OBJKT, {
        objkt_id: window.location.pathname.split('/')[2],
      })
      .then((res) => {
        console.log(res.data)
        this.setState({
          objkt: res.data.result[0],
          loaded: true,
        })
      })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () =>
      console.log(this.state)
    )
  }

  amountChange = (e) => {
    const amount = e.target.value
    console.log(amount)
    if (!amount || amount.match(/^\d{1,}(\.\d{0,6})?$/)) {
      this.setState({ tz_per_objkt: amount })
    }
  }

  submitForm = async () => {
    this.context.swap(
      this.state.objkt_amount,
      window.location.pathname.split('/')[2],
      this.state.xtz_per_objkt
    )
  }

  collect = () => {
    if (this.context.Tezos == null) {
      alert('sync')
    } else {
      this.context.collect(
        1,
        this.state.objkt.swaps[0].swap_id,
        this.state.objkt.swaps[0].xtz_per_objkt * 1
      )
    }
  }

  toggleInfo = () => this.setState({ info: !this.state.info })

  owners = () =>
    this.setState({ info: false, owners: true, curate: false, cancel: false })

  curate = () =>
    this.setState({ info: false, owners: false, curate: true, cancel: false })

  cancel = () => this.context.cancel(this.state.objkt.swaps[0].swap_id)

  render() {
    console.log('render', this.state)
    const { objkt } = this.state
    return (
      <div>
        {this.context.collapsed ? (
          <div>
            {this.state.loaded ? (
              <div className="cel" style={{ backgroundColor: 'white' }}>
                {objkt.token_info.formats[0].mimeType === 'video/mp4' ? (
                  <div
                    style={{
                      paddingTop: '5%',
                      display: 'table',
                      margin: '0 auto',
                    }}
                  >
                    <video
                      className="media"
                      style={{
                        maxHeight: '60vh',
                        height: 'auto',
                        width: 'auto',
                      }}
                      controls
                      autoPlay
                      muted
                      loop
                    >
                      <source
                        src={
                          'https://dweb.link/ipfs/' +
                          objkt.token_info.artifactUri.split('//')[1]
                        }
                        alt="💥"
                        type="video/mp4"
                      ></source>
                    </video>
                  </div>
                ) : (
                  <div
                    style={{
                      paddingTop: '5%',
                      display: 'table',
                      margin: '0 auto',
                    }}
                  >
                    <img
                      className="media"
                      style={{
                        maxHeight: '60vh',
                        height: 'auto',
                        width: 'auto',
                      }}
                      src={
                        'https://cloudflare-ipfs.com/ipfs/' +
                        objkt.token_info.artifactUri.split('//')[1]
                      }
                      alt="💥"
                    />
                  </div>
                )}
                {/*                 <video controls>
                    <source src="https://ipfs.io/ipfs/QmNWTszpFbLRzt5EnaT7SKZz3GvpszvKyDR6Uj5rEL77hu"/>
                </video> */}
                <Row>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <Card style={{ paddingTop: '5%', border: 0 }}>
                      <div style={{ diplay: 'inline' }}>
                        <span>
                          <a
                            style={{
                              paddingLeft: '25px',
                              cursor: 'pointer',
                              paddingLeft: '15px',
                              color: '#000',
                              '&:hover': {
                                color: '#000',
                              },
                            }}
                            onClick={this.toggleInfo}
                          >
                            info
                          </a>
                        </span>
                        {/* <span onClick={this.owners} style={{ paddingLeft: '25px' }}>owners</span> */}
                        {/* <span onClick={this.swap} style={{ paddingLeft: '25px' }}>+swaps</span> */}
                        {objkt.token_info.creators[0] ===
                        this.context.address ? (
                          <div style={{ display: 'inline' }}>
                            <span>
                              <a
                                onClick={this.curate}
                                style={{
                                  paddingLeft: '25px',
                                  cursor: 'pointer',
                                  paddingLeft: '15px',
                                  color: '#000',
                                  '&:hover': {
                                    color: '#000',
                                  },
                                }}
                              >
                                +curate
                              </a>
                            </span>
                            {objkt.swaps.length !== 0 ? (
                              <span>
                                <a
                                  onClick={this.cancel}
                                  style={{
                                    paddingLeft: '25px',
                                    cursor: 'pointer',
                                    paddingLeft: '15px',
                                    color: '#000',
                                    '&:hover': {
                                      color: '#000',
                                    },
                                  }}
                                >
                                  -cancel curation
                                </a>
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>

                      <div style={{ paddingTop: '2.5%', display: 'inline' }}>
                        <span>
                          OBJKT#{this.state.objkt.token_id}
                          <br />
                          issuer{' '}
                          <span>
                            <a
                              style={{
                                color: '#000',
                                '&:hover': {
                                  color: '#000',
                                },
                              }}
                              href={`/tz/${this.state.objkt.token_info.creators[0]}`}
                            >
                              {this.state.objkt.token_info.creators[0].slice(
                                0,
                                5
                              ) +
                                '...' +
                                this.state.objkt.token_info.creators[0].slice(
                                  this.state.objkt.token_info.creators[0]
                                    .length - 5,
                                  this.state.objkt.token_info.creators[0].length
                                )}
                            </a>
                          </span>
                        </span>
                        )
                        {this.state.owners
                          ? this.state.owners_arr.map((e) => (
                              <div>
                                {e.balance}x{' '}
                                <a href={`https://tzkt.io/${e.address}`}>
                                  {e.address}
                                </a>
                              </div>
                            ))
                          : null}
                        {this.state.curate ? (
                          <div style={{ display: 'inline' }}>
                            <input
                              type="text"
                              name="objkt_amount"
                              onChange={this.handleChange}
                              placeholder="OBJKT amount"
                            ></input>
                            <br />
                            <input
                              style={{ width: '100%' }}
                              type="text"
                              name="xtz_per_objkt"
                              placeholder="µtez per OBJKT (1 tez = 1000000 µtez)"
                              onChange={this.handleChange}
                            ></input>
                            <br />
                            <button
                              style={{ width: '100%' }}
                              onClick={this.submitForm}
                            >
                              curate
                            </button>
                          </div>
                        ) : null}
                        <div style={{ display: 'inline', float: 'right' }}>
                          {this.state.objkt.swaps.length != 0 ? (
                            <span style={{ float: 'left', marginTop: '4px' }}>
                              {this.state.objkt.swaps[0].objkt_amount} left
                              {this.state.objkt.total_amount}
                            </span>
                          ) : (
                            <span style={{ float: 'left', marginTop: '5px' }}>
                              {this.state.objkt.total_amount}{' '}
                            </span>
                          )}
                          <span>
                            <button
                              onClick={this.collect}
                              style={{
                                backgroundColor: 'white',
                                float: 'right',
                              }}
                            >
                              {this.state.objkt.swaps.length != 0 ? (
                                <span>
                                  collect for{' '}
                                  {parseInt(
                                    this.state.objkt.swaps[0].xtz_per_objkt /
                                      1000000
                                  )}{' '}
                                  tez
                                </span>
                              ) : (
                                <span>not for sale</span>
                              )}
                            </button>
                          </span>
                        </div>
                      </div>

                      {this.state.info && (
                        <div
                          style={{
                            marginTop: '1em',
                            padding: '1em',
                            border: '1px dashed grey',
                          }}
                        >
                          <div>
                            <strong>title:</strong>
                            {objkt.name}
                          </div>
                          <div>
                            <strong>description:</strong>
                            {objkt.token_info.description}
                          </div>
                          {objkt.token_info.tags.length > 0 && (
                            <div>
                              <strong>tags:</strong>
                              {objkt.token_info.tags.map((tag, index) => {
                                return (
                                  <div key={`tag${tag}${index}`}>{tag}</div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  </Col>
                </Row>
              </div>
            ) : (
              <div style={{ marginTop: '35vh', verticalAlign: 'middle' }}>
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
        ) : (
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <Menu />
            </Col>
          </Row>
        )}
      </div>
    )
  }
}
