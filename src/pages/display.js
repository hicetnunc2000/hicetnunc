import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Row, Col } from 'reactstrap'
import { CardGroup, CardBody } from 'reactstrap'
import Grid from '@material-ui/core/Grid'
import { BabelLoading } from 'react-loadingg'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Menu from '../components/Menu'
import x from '../media/xt.png'

const axios = require('axios')

export default class Display extends Component {
  static contextType = HicetnuncContext

  state = {
    render: false,
    balance: 0,
    loading: true,
    results: [],
    objkts: [],
    creations: [],
    collection: [],
    collectionState: false,
    creationsState: true,
  }

  componentWillMount = async () => {
    this.context.setPath(window.location.pathname)
    console.log(this.context.getAuth())
    await axios
      .post(process.env.REACT_APP_TZ, {
        tz: window.location.pathname.split('/')[2],
      })
      .then(async (res) => {
        console.log(res.data.result)

        this.setState({
          objkts: res.data.result,
          creations: res.data.result.filter(
            (e) => e.tz === e.token_info.creators[0]
          ),
          collection: res.data.result.filter(
            (e) =>
              e.tz !== e.token_info.creators[0] &&
              e.tz !== 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9' &&
              e.amount !== 0
          ),
          loading: false,
        })
      })
  }

  creations = () =>
    this.setState({ collectionState: false, creationsState: true })
  collection = () =>
    this.setState({ collectionState: true, creationsState: false })

  render() {
    const addr = window.location.pathname.split('/')[2]
    const imageCreations = (i) => (
      <div>
        <LazyLoadImage
          style={{ maxHeight: '240px', maxWidth: '240px' }}
          src={`https://cloudflare-ipfs.com/ipfs/${
            this.state.creations[i].token_info.formats[0].uri.split('//')[1]
          }`}
          alt="💥"
        />
      </div>
    )

    const videoCreations = (i) => {
      console.log(this.state.creations[i])
      return (
        <div style={{ paddingTop: '4%', display: 'table', margin: '0 auto' }}>
          <video
            className="media"
            style={{ maxHeight: '240px', maxWidth: '240px', display: 'block' }}
            controls
            autoPlay
            muted
            loop
          >
            <source
              src={`https://ipfs.io/ipfs/${
                this.state.creations[i].token_info.formats[0].uri.split('//')[1]
              }`}
              alt="💥"
              type="video/mp4"
            ></source>
          </video>
        </div>
      )
    }

    const imageCollection = (i) => (
      <div>
        <LazyLoadImage
          style={{ maxHeight: '240px', maxWidth: '240px' }}
          src={`https://cloudflare-ipfs.com/ipfs/${
            this.state.collection[i].token_info.formats[0].uri.split('//')[1]
          }`}
          alt="💥"
        />
      </div>
    )

    const videoCollection = (i) => {
      console.log(this.state.collection[i])
      return (
        <div style={{ paddingTop: '4%', display: 'table', margin: '0 auto' }}>
          <video
            className="media"
            style={{ maxHeight: '240px', maxWidth: '240px', display: 'block' }}
            controls
            autoPlay
            muted
            loop
          >
            <source
              src={`https://ipfs.io/ipfs/${
                this.state.collection[i].token_info.formats[0].uri.split(
                  '//'
                )[1]
              }`}
              alt="💥"
              type="video/mp4"
            ></source>
          </video>
        </div>
      )
    }

    return (
      <div>
        {/*this.state.render ? <h3>{this.context.address}</h3> : null*/}
        {/*<button onClick={this.handleSubmit}>Teste</button>*/}
        {!this.context.collapsed ? (
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <Menu />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <Card style={{ paddingTop: '10vh', border: 0 }}>
                <div>
                  <Card style={{ border: 0, margin: 'auto' }}>
                    <div>
                      <div
                        style={{
                          display: 'inline-block',
                          top: '50%',
                        }}
                      >
                        <img
                          style={{
                            borderStyle: 'solid',
                            borderRadius: '50%',
                            borderColor: 'black',
                            height: '150px',
                            width: '150px',
                          }}
                          src={x}
                          alt=""
                        />
                      </div>
                      {/* this.context.getBalance(addr) */}
                      <div
                        style={{
                          display: 'inline-block',
                          top: '30%',
                          left: '25%',
                          position: 'absolute',
                        }}
                      >
                        <a
                          style={{
                            color: '#000',
                            '&:hover': {
                              color: '#000',
                            },
                          }}
                          href={`https://tzkt.io/${addr}`}
                        >
                          {addr.slice(0, 5) +
                            '...' +
                            addr.slice(addr.length - 5, addr.length)}
                        </a>
                        <p style={{ marginBottom: 0 }}>
                          {/* {Math.round(this.state.balance / 1000000)} */}-
                          TEZ
                        </p>
                        <p style={{ paddingTop: 0, margin: 0 }}>- ○</p>
                      </div>
                    </div>
                  </Card>
                  <Card style={{ border: 0, marginTop: '3%' }}>
                    <p style={{ fontWeight: 'bold' }}>OBJKTs</p>
                    <div style={{ display: 'inline' }}>
                      <span onClick={this.creations}>
                        <a
                          style={{
                            cursor: 'pointer',
                            color: '#000',
                            '&:hover': {
                              color: '#000',
                            },
                          }}
                        >
                          creations
                        </a>
                      </span>
                      <span onClick={this.collection}>
                        <a
                          style={{
                            cursor: 'pointer',
                            paddingLeft: '15px',
                            color: '#000',
                            '&:hover': {
                              color: '#000',
                            },
                          }}
                        >
                          collection
                        </a>
                      </span>
                    </div>
                  </Card>
                  {!this.state.loading ? (
                    <CardGroup>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Grid container justify="center">
                            {this.state.creationsState
                              ? this.state.creations.map((e, i) => {
                                  return (
                                    <Grid key={i} item>
                                      <Card
                                        style={{
                                          maxHeight: '240px',
                                          maxWidth: '240px',
                                          display: 'flex',
                                          overflow: 'hidden',
                                          border: 0,
                                        }}
                                      >
                                        <CardBody>
                                          <a href={'/objkt/' + e.tk_id}>
                                            {/*<img style={{ maxHeight: '240px', maxWidth: '240px', display: 'block' }} src={`https://ipfs.io/ipfs/${(this.state.creations[i].token_info.formats[0].uri).split('//')[1]}`} />*/}{' '}
                                            {this.state.creations[i].token_info
                                              .formats[0].mimeType ===
                                            'video/mp4'
                                              ? videoCreations(i)
                                              : imageCreations(i)}
                                          </a>
                                          <a
                                            style={{
                                              bottom: '8px',
                                              right: '4px',
                                              backgroundColor: 'black',
                                              position: 'absolute',
                                              color: 'white',
                                              '&:hover': {
                                                color: 'white',
                                              },
                                            }}
                                            href={'/objkt/' + e.tk_id}
                                          >
                                            OBJKT#{e.tk_id}
                                          </a>
                                        </CardBody>
                                      </Card>
                                    </Grid>
                                  )
                                })
                              : null}
                            {this.state.collectionState
                              ? this.state.collection.map((e, i) => {
                                  return (
                                    <Grid key={i} item>
                                      <Card
                                        style={{
                                          maxHeight: '240px',
                                          maxWidth: '240px',
                                          display: 'flex',
                                          overflow: 'hidden',
                                          border: 0,
                                        }}
                                      >
                                        <CardBody>
                                          <a href={'/objkt/' + e.tk_id}>
                                            {/*                                                                                     <img style={{ maxHeight: '240px', maxWidth: '240px', display: 'block' }} src={`https://ipfs.io/ipfs/${(this.state.collection[i].token_info.formats[0].uri).split('//')[1]}`} />
                                             */}{' '}
                                            {this.state.collection[i].token_info
                                              .formats[0].mimeType ===
                                            'video/mp4'
                                              ? videoCollection(i)
                                              : imageCollection(i)}
                                          </a>
                                          <a
                                            style={{
                                              bottom: '8px',
                                              right: '4px',
                                              backgroundColor: 'black',
                                              position: 'absolute',
                                              color: 'white',
                                              '&:hover': {
                                                color: 'white',
                                              },
                                            }}
                                            href={'/objkt/' + e.tk_id}
                                          >
                                            OBJKT#{e.tk_id}
                                          </a>
                                        </CardBody>
                                      </Card>
                                    </Grid>
                                  )
                                })
                              : null}
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardGroup>
                  ) : (
                    <BabelLoading
                      style={{
                        backgroundColor: 'black',
                        position: 'absolute',
                        left: '49%',
                      }}
                    />
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}
