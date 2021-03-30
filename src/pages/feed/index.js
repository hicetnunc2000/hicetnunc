/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { GetFeed, GethDAOFeed } from '../../data/api'
import { Container, Padding } from '../../components/layout'
import { FeedItem } from '../../components/feed-item'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'
import styles from './index.module.scss'

export const Feed = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [feedType, setFeedType] = useState(1)
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
      console.log('hDAO feed')

      setLoading(true)
      // api
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
    } else {
      console.log('latest feed')

      setLoading(true)
      // api
      GetFeed({ counter: count })
        .then(({ filtered, original }) => {
          // filtered isn't guaranteed to always be 10. if we're filtering they might be less.
          const next = items.concat(filtered)
          setItems(next)
          setLoading(false)
          // if original returns less than 30, then there's no more data coming from API
          if (original.length < 30) {
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
    setFeedType(index)
    setCount(0)
    setItems([])
    setHasMore(true)
  }

  return (
    <>
      {false && (
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
      )}

      {items.length > 0 && (
        <ul>
          {items.map((item, index) => (
            <li key={`${item.token_id}-${index}`}>
              <FeedItem {...item} />
            </li>
          ))}
        </ul>
      )}

      {loading ? (
        <Container>
          <Padding>
            <Loading />
          </Padding>
        </Container>
      ) : (
        <Container>
          <Padding>
            {hasMore ? (
              <Button onClick={loadMore}>
                <Primary>
                  <strong>Load More</strong>
                </Primary>
              </Button>
            ) : (
              <p>
                mint mint mint{' '}
                <span role="img" aria-labelledby={'Sparkles emoji'}>
                  ✨
                </span>
              </p>
            )}
          </Padding>
        </Container>
      )}
    </>
  )
}
