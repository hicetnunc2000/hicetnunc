import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'
import { Loading } from '../../components/loading'
import { Button } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import styles from './index.module.scss'

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
    loading: true,
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
          loading: false,
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

  info = () => ({ info: true, owners: false, curate: false, cancel: false })

  owners = () =>
    this.setState({ info: false, owners: true, curate: false, cancel: false })

  curate = () =>
    this.setState({ info: false, owners: false, curate: true, cancel: false })

  cancel = () => this.context.cancel(this.state.objkt.swaps[0].swap_id)

  render() {
    const { loading, info, objkt, owners, owners_arr, curate } = this.state
    return (
      <div className={styles.container}>
        <Loading loading={loading}>
          {!loading && (
            <div>
              {objkt.token_id &&
              objkt.token_info.formats[0].mimeType === 'video/mp4' ? (
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
                  <div style={{ paddingTop: '5%', border: 0 }}>
                    <div className={styles.menu}>
                      <Button onClick={this.info} selected={info}>
                        info
                      </Button>
                      {/* <Button onClick={this.owners}>owners</Button> */}
                      {/* <Button onClick={this.swap}>+swaps</Button> */}
                      {objkt.token_info.creators[0] ===
                        this.context.address && (
                        <>
                          <Button onClick={this.curate}>+curate</Button>
                          {objkt.swaps.length && (
                            <Button onClick={this.cancel}>
                              -cancel curation
                            </Button>
                          )}
                        </>
                      )}
                    </div>

                    <div style={{ paddingTop: '2.5%', display: 'inline' }}>
                      <span>
                        OBJKT#{objkt.token_id}
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
                            href={`/tz/${objkt.token_info.creators[0]}`}
                          >
                            {objkt.token_info.creators[0].slice(0, 5) +
                              '...' +
                              objkt.token_info.creators[0].slice(
                                objkt.token_info.creators[0].length - 5,
                                objkt.token_info.creators[0].length
                              )}
                          </a>
                        </span>
                      </span>

                      {owners
                        ? owners_arr.map((e) => (
                            <div>
                              {e.balance}x{' '}
                              <a href={`https://tzkt.io/${e.address}`}>
                                {e.address}
                              </a>
                            </div>
                          ))
                        : null}
                      {curate ? (
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
                        {objkt.swaps.length ? (
                          <span style={{ float: 'left', marginTop: '4px' }}>
                            {objkt.swaps[0].objkt_amount} left
                            {objkt.total_amount}
                          </span>
                        ) : (
                          <span style={{ float: 'left', marginTop: '5px' }}>
                            {objkt.total_amount}{' '}
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
                            {objkt.swaps.length ? (
                              <span>
                                collect for{' '}
                                {parseInt(
                                  objkt.swaps[0].xtz_per_objkt / 1000000
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

                    {info && (
                      <div className={styles.info}>
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
                              return <div key={`tag${tag}${index}`}>{tag}</div>
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Loading>
      </div>
    )
  }
}
