/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  GetLatestFeed,
  // GethDAOFeed,
  // GetRandomFeed,
  // GetFeaturedFeed,
} from '../../data/api'
import { Page, Container, Padding } from '../../components/layout'
import { FeedItem } from '../../components/feed-item'
import { Loading } from '../../components/loading'

const axios = require('axios')

const customFloor = function (value, roundTo) {
  return Math.floor(value / roundTo) * roundTo
}

const ONE_MINUTE_MILLIS = 60 * 1000

export const Feeds = ({ type }) => {
  const [error, setError] = useState(false)
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [lastId, setId] = useState(999999)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const startTime = customFloor(Date.now(), ONE_MINUTE_MILLIS)

  const loadMore = async () => {
    console.log(type)
    if (type === 1) {
      await getHdaoFeed()
    }
    if (type === 2) await getRandomFeed()
    if (type === 3) getLatest(Math.min.apply(Math, items.map(e => e.id)))
  }

  useEffect(async () => {
    if (error) {
      console.log('returning on error')
      return
    }
    console.log(type)
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
      await getHdaoFeed()
    } else if (type === 2) {
      await getRandomFeed()
    } else if (type === 3) {
      let result = await axios
        .post(process.env.REACT_APP_GRAPHQL_FEED, { lastId: lastId })
        .then((res) => res.data)
      console.log(result)
      setId(Math.min.apply(Math, result.map((e) => e.id)))
      const next = result.concat(result)
      setItems(next)

      /*       GetFeaturedFeed({ counter: count, max_time: startTime })
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
        }) */
    }
  }, [count, type])

  const getLatest = async (id) => {
    console.log(id)
    let result = await axios
      .post(process.env.REACT_APP_GRAPHQL_FEED, { lastId: id })
      .then((res) => res.data)
    const next = items.concat(result)
    setItems(next)
    if (result.length < 10) {
      setHasMore(false)
    }
  }

  const getHdaoFeed = async () => {
    let result = await axios
      .post(process.env.REACT_APP_GRAPHQL_HDAO, { offset: offset })
      .then((res) => res.data)
    setOffset(offset + 50)
    const next = items.concat(result)
    setItems(next)
  }

  const getRandomFeed = async () => {
    let result = await axios
      .post(process.env.REACT_APP_GRAPHQL_RANDOM)
      .then((res) => res.data)
    setOffset(offset + 50)
    const next = items.concat(result)
    setItems(next)
  }

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
        <Container>
          <Padding>
            {items.map((item, index) => (
              <FeedItem key={`${item.id}-${index}`} {...item} />
            ))}
          </Padding>
        </Container>
      </InfiniteScroll>
    </Page>
  )
}
