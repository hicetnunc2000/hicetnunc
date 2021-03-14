/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GetFeed } from '../../data/api'
import { Page, Container, Padding } from '../../components/layout'
import { FeedItem } from '../../components/feed-item'
import { Loading } from '../../components/loading'
import styles from './index.module.scss'

export const Feed = () => {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = () => {
    setCount(count + 1)
  }

  useEffect(() => {
    GetFeed({ counter: count }).then(({ filtered, original }) => {
      // filtered isn't guaranteed to always be 10. if we're filtering they might be less.
      const next = items.concat(filtered)
      setItems(next)

      // if original returns less than 10, then there's no more data coming from API
      if (original.length < 10) {
        setHasMore(false)
      }
    })
  }, [count])

  return (
    <Page>
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <Container>
            <Padding>
              <div className={styles.container}>
                <Loading />
              </div>
            </Padding>
          </Container>
        }
        endMessage={
          <Container>
            <Padding>
              <p>
                mint mint mint{' '}
                <span role="img" aria-labelledby={'Sparkles emoji'}>
                  ✨
                </span>
              </p>
            </Padding>
          </Container>
        }
      >
        {items.map((item, index) => (
          <FeedItem key={`${item.token_id}-${index}`} {...item} />
        ))}
      </InfiniteScroll>
    </Page>
  )
}
