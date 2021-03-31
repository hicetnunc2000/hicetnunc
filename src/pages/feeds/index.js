/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GetLatestFeed, GethDAOFeed, GetRandomFeed } from '../../data/api'
import { Page, Container, Padding } from '../../components/layout'
import { FeedItem } from '../../components/feed-item'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'
import { getItem, setItem } from '../../utils/storage'
import styles from './index.module.scss'

export const Feeds = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [feedType, setFeedType] = useState(
    getItem('feed') || setItem('feed', 0)
  )
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
      console.log('latest feed')

      setLoading(true)

      GetLatestFeed({ counter: count })
        .then((result) => {
          const next = items.concat(result)
          setItems(next)

          setLoading(false)

          if (result.length < 10) {
            setHasMore(false)
          }
        })
        .catch((e) => {
          setError(true)
          setLoading(false)
        })
    } else if (feedType === 1) {
      console.log('hDAO feed')

      setLoading(true)

      GethDAOFeed({ counter: count })
        .then((result) => {
          const next = items.concat(result)
          setItems(next)

          setLoading(false)

          if (result.length < 10) {
            setHasMore(false)
          }
        })
        .catch((e) => {
          setError(true)
          setLoading(false)
        })
    } else if (feedType === 2) {
      console.log('random feed')

      setLoading(true)

      GetRandomFeed({ counter: count })
        .then((result) => {
          // filtered isn't guaranteed to always be 10. if we're filtering they might be less.
          console.log(result)
          const next = items.concat(result)
          setItems(next)
          setLoading(false)
          // if original returns less than 30, then there's no more data coming from API
          if (result.length < 30) {
            setHasMore(false)
          }
        })
        .catch((e) => {
          setError(true)
          setLoading(false)
        })
    }
  }, [count, feedType])

  const toggleFeed = (index) => {
    setItem('feed', index)
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
