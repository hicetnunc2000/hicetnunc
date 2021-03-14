/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GetFeed, GethDAOFeed } from '../../data/api'
import { Page, Container, Padding } from '../../components/layout'
import { FeedItem } from '../../components/feed-item'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'
import styles from './index.module.scss'

export const Feed = () => {
  const [feedType, setFeedType] = useState(0)
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = () => {
    setCount(count + 1)
  }

  useEffect(() => {
    if (feedType === 0) {
      console.log('hDAO feed')

      // api
      GethDAOFeed({ counter: count }).then((result) => {
        const next = items.concat(result)
        setItems(next)

        if (result.length < 10) {
          setHasMore(false)
        }
      })
    } else {
      console.log('latest feed')

      // api
      GetFeed({ counter: count }).then(({ filtered, original }) => {
        // filtered isn't guaranteed to always be 10. if we're filtering they might be less.
        const next = items.concat(filtered)
        setItems(next)

        // if original returns less than 10, then there's no more data coming from API
        if (original.length < 10) {
          setHasMore(false)
        }
      })
    }
  }, [count])

  const toggleFeed = (index) => {
    setFeedType(index)
    setCount(0)
    setItems([])
    setHasMore(true)
  }

  return (
    <Page>
      <div className={styles.sticky}>
        <div className={styles.content}>
          <Button onClick={() => toggleFeed(0)}>
            <Primary selected={feedType === 0}>hDAO</Primary>
          </Button>
          <Button onClick={() => toggleFeed(1)}>
            <Primary selected={feedType === 1}>latest</Primary>
          </Button>
        </div>
      </div>

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
