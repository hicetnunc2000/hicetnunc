import React, { Component } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FeedItem } from '../../components/feed-item'
import { Loading } from '../../components/loading'

const axios = require('axios')

export class Tag extends Component {
  static contextType = HicetnuncContext

  state = {
    items: [],
    counter: 0,
    hasMore: true,
  }

  componentWillMount = async () => {
    // url encode
    console.log(window.location.pathname.split('/')[2])

    await axios
      .get(
        'https://vj4pzbqrsa.execute-api.us-east-1.amazonaws.com/dev/tag?tag=' +
          window.location.pathname.split('/')[2]
      )
      .then((res) => {
        this.setState({
          items: res.data.result.slice(
            this.state.counter * 10,
            this.state.counter * 10 + 10
          ),
        })
      })

    console.log(this.state)
  }

  loadMore = () => {}

  render() {
    return (
      <Page>
        {/* 
            feed alike
            */}
        <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.loadMore}
          hasMore={this.state.hasMore}
          loader={
            <Container>
              <Padding>
                <Loading />
              </Padding>
            </Container>
          }
          endMessage={
            <p>
              mint mint mint{' '}
              <span role="img" aria-labelledby={'Sparkles emoji'}>
                ✨
              </span>
            </p>
          }
        >
          <div>
            <Container>
              <Padding>
                {/*                                 {this.state.items.map((item, index) => (
                                    <FeedItem key={`${item.token_id}-${index}`} {...item} />
                                ))} */}
              </Padding>
            </Container>
          </div>
        </InfiniteScroll>
      </Page>
    )
  }
}
