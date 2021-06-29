/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { BottomBanner } from '../../components/bottom-banner'
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
const _ = require('lodash')

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
  const [creators, setCreators] = useState([])
  const startTime = customFloor(Date.now(), ONE_MINUTE_MILLIS)

  const loadMore = async () => {

    if (type === 1) {
      await getHdaoFeed()
    }
    if (type === 2) await getRandomFeed()
    if (type === 3) await getLatest(Math.min.apply(Math, items.map(e => e.id)))
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
      await getLatest(lastId)

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
    let result = await axios
      .post(process.env.REACT_APP_GRAPHQL_FEED, { lastId: id })
      .then((res) => res.data)

    setCreators([...creators, result.map(e => e.creator_id)])

    result = _.uniqBy(result, 'creator_id')
    setCreators(creators.concat(result.map(e => e.creator_id)))
    result = result.filter(e => !creators.includes(e.creator_id))
    const next = items.concat(result)
    setItems(next)

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
      <BottomBanner>
        The dApp has been temporarily disabled for a contract migration. Follow <a href="https://twitter.com/hicetnunc2000" target="_blank">@hicetnunc2000</a> or <a href="https://discord.gg/jKNy6PynPK" target="_blank">join the discord</a> for updates.
      </BottomBanner>
    </Page>
  )
}
