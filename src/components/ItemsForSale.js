import React, { Component } from 'react'
import { Card, Col, Row } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
import Menu from '../components/Menu'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import InfiniteScroll from 'react-infinite-scroll-component'
import { BabelLoading } from 'react-loadingg'

export default class ItemsForSale extends Component {
  static contextType = HicetnuncContext

  collect = (event, index) => {
    if (this.context.Tezos == null) {
      alert('sync')
    } else {
      this.context.collect(
        1,
        this.props.items[this.props.index].swaps[0].swap_id,
        this.props.items[this.props.index].swaps[0].xtz_per_objkt * 1
      )
    }
  }

  render() {
    const { index } = this.props
    const info = (index) => (
      <div style={{ display: 'inline' }}>
        <a
          style={{
            color: '#000',
            '&:hover': {
              color: '#000',
            },
          }}
          href={`/objkt/${this.props.items[index].token_id}`}
        >
          OBJKT#{this.props.items[index].token_id}
        </a>
      </div>
    )
    const image = (index) => (
      <div>
        <LazyLoadImage
          className="media"
          style={{ maxHeight: '50vh', height: 'auto', width: 'auto' }}
          src={`https://ipfs.io/ipfs/${
            this.props.items[index].token_info.artifactUri.split('//')[1]
          }`}
          alt="💥"
        />
      </div>
    )

    const video = (index) => (
      <div style={{ paddingTop: '4%', display: 'table', margin: '0 auto' }}>
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
              this.props.items[index].token_info.artifactUri.split('//')[1]
            }
            alt="💥"
            type="video/mp4"
          ></source>
        </video>
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
                  dataLength={this.props.items.length} //This is important field to render the next data
                  next={this.fetchData}
                  hasMore={this.props.hasMore}
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
                  <Card
                    key={this.props.item.token_id}
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
                      {this.props.items[index]?.token_info ? (
                        this.props.items[index].token_info.formats[0]
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
                          <span style={{ float: 'left', marginTop: '5px' }}>
                            {this.props.items[index].swaps[0]?.objkt_amount}{' '}
                            left
                            {/* this.props.items[index].total_amount */}
                          </span>

                          <span>
                            <button
                              onClick={(event) => this.collect(event, index)}
                              style={{
                                backgroundColor: 'white',
                                float: 'right',
                              }}
                            >
                              <span>
                                collect for{' '}
                                {parseInt(
                                  this.props.items[index].swaps[0]
                                    ?.xtz_per_objkt / 1000000
                                )}{' '}
                                tez
                              </span>
                            </button>
                          </span>
                        </div>
                      </span>
                    </div>
                  </Card>
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
