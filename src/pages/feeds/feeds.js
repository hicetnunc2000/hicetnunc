/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GetLatestFeed, GethDAOFeed, GetRandomFeed, GetFeaturedFeed } from '../../data/api'
import { Page, Container, Padding } from '../../components/layout'
import { FeedItem } from '../../components/feed-item'
import { Loading } from '../../components/loading'

const customFloor = function(value, roundTo) {
  return Math.floor(value / roundTo) * roundTo;
} 

const ONE_MINUTE_MILLIS = 60 * 1000

export const Feeds = ({ type = 0 }) => {
  const [error, setError] = useState(false)
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const startTime = customFloor(Date.now(), ONE_MINUTE_MILLIS)
  const loadMore = () => {
    setCount(count + 1)
  }

  useEffect(() => {
    if (error) {
      console.log('returning on error')
      return
    }

    if (type === 0) {
      GetLatestFeed({ counter: count, max_time: startTime })
        .then((result) => {
          const next = items.concat(result)
          setItems(next)

          // if original returns less than 10, then there's no more data coming from API
          if (result.length < 10) {
            setHasMore(false)
          }
        })
        .catch((e) => {
          setError(true)
        })
    } else if (type === 1) {
      GethDAOFeed({ counter: count })
        .then((result) => {
          const next = items.concat(result)
          setItems(next)

          // if original returns less than 10, then there's no more data coming from API
          if (result.length < 10) {
            setHasMore(false)
          }
        })
        .catch((e) => {
          setError(true)
        })
    } else if (type === 2) {
      GetRandomFeed({ counter: count })
        .then((result) => {
          // filtered isn't guaranteed to always be 10. if we're filtering they might be less.
          const next = items.concat(result)
          setItems(next)

          // if original returns less than 10, then there's no more data coming from API
          if (result.length < 10) {
            setHasMore(false)
          }
        })
        .catch((e) => {
          setError(true)
        })
    } else if (type === 3) {
      GetFeaturedFeed({ counter: count, max_time: startTime })
        .then((result) => {
          // filtered isn't guaranteed to always be 10. if we're filtering they might be less.
          const next = items.concat(result)
          setItems(next)

          // if original returns less than 10, then there's no more data coming from API
          if (result.length < 10) {
            setHasMore(false)
          }
        })
        .catch((e) => {
          setError(true)
        })
    }
  }, [count, type])

  return (
    <Page title="">
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
        <div>
          <Container>
            <Padding>
              {items.map((item, index) => (
                <FeedItem key={`${item.token_id}-${index}`} {...item} />
              ))}
            </Padding>
          </Container>
        </div>
      </InfiniteScroll>
    </Page>
  )
}
