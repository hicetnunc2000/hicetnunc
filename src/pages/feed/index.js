import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GetFeed } from '../../api'
import { FeedItem } from '../../components/feed-item'
import { Page, Container, Padding } from '../../components/layout'

export const Feed = () => {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = () => {
    setCount(count + 1)
  }

  useEffect(() => {
    GetFeed({ counter: count }).then((data) => {
      setItems(data)

      if (data.length < 10) {
        setHasMore(false)
      }
    })
  }, [count])

  return (
    <Page>
      <Container>
        <Padding>
          <InfiniteScroll
            dataLength={items.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p>
                mint mint mint{' '}
                <span role="img" aria-labelledby={'Sparkles emoji'}>
                  ✨
                </span>
              </p>
            }
          >
            {items.map((item, index) => (
              <FeedItem key={`${item.token_id}-${index}`} {...item} />
            ))}
          </InfiniteScroll>
        </Padding>
      </Container>
    </Page>
  )
}
