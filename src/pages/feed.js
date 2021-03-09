import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Col, Row } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
import Menu from '../components/Menu'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import InfiniteScroll from 'react-infinite-scroll-component'
import { BabelLoading } from 'react-loadingg'

const axios = require('axios')

export default class Feed extends Component {
  static contextType = HicetnuncContext

  state = {
    results: [],
    loading: true,
    back: '',
    curations: true,
    curations_arr: [],
    objkts_arr: [],
    mounted: false,
    blob: null,
    items: [],
    hasMore: true,
    counter: 0,
  }

  componentWillMount = async () => {
    await axios
      .post(process.env.REACT_APP_FEED, { counter: this.state.counter })
      .then((res) => {
        this.setState({
          items: res.data.result,
        })
      })
  }

  fetchData = async () => {
    //await axios.get('http://localhost:3000/feed').then(res => console.log(res))

    await axios
      .post(process.env.REACT_APP_FEED, { counter: this.state.counter + 1 })
      .then((res) => {
        const filtered = res.data.result.filter((e) => {
          if (
            e.token_id !== 1130 &&
            e.token_id !== 1131 &&
            e.token_id !== 1417 &&
            e.token_id !== 1418 &&
            e.token_id !== 1419 &&
            e.token_id !== 641 &&
            e.token_id !== 1547
          ) {
            return e
          }
        })

        console.log(res.data)
        this.setState({
          items: this.state.items.concat(filtered),
          counter: this.state.counter + 1,
        })

        if (res.data.result.length < 10) {
          this.setState({ hasMore: false })
          return
        }
      })

    console.log(this.state)
  }

  collect = (event, index) => {
    console.log(index)
    if (this.context.Tezos == null) {
      alert('sync')
    } else {
      this.context.collect(
        1,
        this.state.items[index].swaps[0].swap_id,
        this.state.items[index].swaps[0].xtz_per_objkt * 1
      )
    }
  }

  render() {
    const info = (index) => (
      <div style={{ display: 'inline' }}>
        <a
          style={{
            color: '#000',
            '&:hover': {
              color: '#000',
            },
          }}
          href={`/objkt/${this.state.items[index].token_id}`}
        >
          OBJKT#{this.state.items[index].token_id}
        </a>
      </div>
    )
    const image = (index) => (
      <div>
        <Link href={`/objkt/${this.state.items[index].token_id}`}>
          <LazyLoadImage
            className="media"
            style={{ maxHeight: '50vh', height: 'auto', width: 'auto' }}
            src={`https://ipfs.io/ipfs/${
              this.state.items[index].token_info.artifactUri.split('//')[1]
            }`}
            alt="💥"
          />
        </Link>
      </div>
    )

    const video = (index) => (
      <div style={{ paddingTop: '4%', display: 'table', margin: '0 auto' }}>
        <a href={`/objkt/${this.state.items[index].token_id}`}>
          <video
            className="media"
            style={{ maxHeight: '60vh', height: 'auto', width: 'auto' }}
            controls
            autoPlay
            muted
            loop
          >
            <source
              src={
                'https://dweb.link/ipfs/' +
                this.state.items[index].token_info.artifactUri.split('//')[1]
              }
              alt="💥"
              type="video/mp4"
            ></source>
          </video>
        </a>
      </div>
    )

    return (
      <div>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Card body style={{ border: 0, animation: 'fadeMe 1.2s' }}>
              {this.context.collapsed ? (
                <InfiniteScroll
                  className="cel"
                  style={{ overflow: 'hidden' }}
                  dataLength={this.state.items.length} //This is important field to render the next data
                  next={this.fetchData}
                  hasMore={this.state.hasMore}
                  loader={
                    <BabelLoading
                      style={{
                        backgroundColor: 'black',
                        display: 'inline-block',
                        position: 'absolute',
                        right: '50%',
                        left: '45%',
                        marginTop: '35vh',
                      }}
                    />
                  }
                  endMessage={
                    <p style={{ textAlign: 'center' }}>mint mint mint ✨</p>
                  }
                >
                  {this.state.items.map((i, index) => {
                    return (
                      <Card
                        key={i.token_id}
                        style={{
                          paddingTop: '4%',
                          border: 0,
                          animation: 'fadeMe 1.2s',
                        }}
                      >
                        <div
                          style={{
                            paddingTop: '3%',
                            display: 'table',
                            margin: '0 auto',
                          }}
                          key={index}
                        >
                          {this.state.items[index].token_info != undefined ? (
                            this.state.items[index].token_info.formats[0]
                              .mimeType == 'video/mp4' ? (
                              video(index)
                            ) : (
                              image(index)
                            )
                          ) : (
                            <p>💥</p>
                          )}
                        </div>
                        <div
                          style={{
                            display: 'inline',
                            width: '75%',
                            margin: '0 auto',
                          }}
                        >
                          <span>
                            {info(index)}
                            <div style={{ display: 'inline', float: 'right' }}>
                              {this.state.items[index].swaps.length != 0 ? (
                                <span
                                  style={{ float: 'left', marginTop: '5px' }}
                                >
                                  {
                                    this.state.items[index].swaps[0]
                                      .objkt_amount
                                  }{'/'}
                                  {
                                    this.state.items[index].total_amount
                                  }
                                  {/* this.state.items[index].total_amount */}
                                </span>
                              ) : (
                                <span
                                  style={{ float: 'left', marginTop: '5px' }}
                                >
                                  {/* this.state.items[index].total_amount */}{' '}
                                </span>
                              )}
                              <span>
                                <button
                                  onClick={(event) =>
                                    this.collect(event, index)
                                  }
                                  style={{
                                    backgroundColor: 'white',
                                    float: 'right',
                                  }}
                                >
                                  {this.state.items[index].swaps.length != 0 ? (
                                    <span>
                                      collect for{' '}
                                      {parseInt(
                                        this.state.items[index].swaps[0]
                                          .xtz_per_objkt / 1000000
                                      )}{' '}
                                      tez
                                    </span>
                                  ) : (
                                    <span>not for sale</span>
                                  )}
                                </button>
                              </span>
                            </div>
                          </span>
                        </div>
                      </Card>
                    )
                  })}
                </InfiniteScroll>
              ) : (
                <Menu />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
