/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GetLatestFeed, GethDAOFeed, GetRandomFeed } from '../../data/api'
import { Page, Container, Padding } from '../../components/layout'
import { FeedItem } from '../../components/feed-item'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'
import styles from './index.module.scss'

export const Feeds = ({ type = 0 }) => {
  const [error, setError] = useState(false)
  const [feedType, setFeedType] = useState(type)
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = () => {
    setCount(count + 1)
  }

  useEffect(() => {
    if (error) {
      console.log('returning on error')
      return
    }

    if (feedType === 0) {
      GetLatestFeed({ counter: count })
        .then((result) => {
          const next = items.concat(result)
          setItems(next)

          if (result.length < 10) {
            setHasMore(false)
          }
        })
        .catch((e) => {
          setError(true)
        })
    } else if (feedType === 1) {
      GethDAOFeed({ counter: count })
        .then((result) => {
          const next = items.concat(result)
          setItems(next)

          if (result.length < 10) {
            setHasMore(false)
          }
        })
        .catch((e) => {
          setError(true)
        })
    } else if (feedType === 2) {
      GetRandomFeed({ counter: count })
        .then((result) => {
          // filtered isn't guaranteed to always be 10. if we're filtering they might be less.
          const next = items.concat(result)
          setItems(next)
          // if original returns less than 30, then there's no more data coming from API
          if (result.length < 30) {
            setHasMore(false)
          }
        })
        .catch((e) => {
          setError(true)
        })
    }
  }, [count, feedType])

  const toggleFeed = (index) => {
    setFeedType(index)
    setCount(0)
    setItems([])
    setHasMore(true)
  }

  return (
    <Page>
      {false && (
        <div className={styles.sticky}>
          <div className={styles.content}>
            <Button onClick={() => toggleFeed(0)}>
              <Primary selected={feedType === 0}>latest</Primary>
            </Button>
            <Button onClick={() => toggleFeed(1)}>
              <Primary selected={feedType === 1}>hDAO</Primary>
            </Button>
            <Button onClick={() => toggleFeed(2)}>
              <Primary selected={feedType === 2}>random</Primary>
            </Button>
          </div>
        </div>
      )}

      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
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
        {items.map((item, index) => (
          <FeedItem key={`${item.token_id}-${index}`} {...item} />
        ))}
      </InfiniteScroll>
    </Page>
  )
}
