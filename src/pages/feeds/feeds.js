/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Page, Container, Padding } from '../../components/layout'
import { FeedItem } from '../../components/feed-item'
import { Loading } from '../../components/loading'

const axios = require('axios')
const _ = require('lodash')

const customFloor = function (value, roundTo) {
  return Math.floor(value / roundTo) * roundTo
}

const tz_profiles = `
query profiles {
  tzprofiles(where: {account: {_in: $arr }}) {
    account
    contract
  }
}
`

const latest_feed = `
query LatestFeed($lastId: bigint = 99999999) {
  hic_et_nunc_token(order_by: {id: desc}, limit: 10, where: {id: {_lt: $lastId}, artifact_uri: {_neq: ""}}) {
    artifact_uri
    display_uri
    creator_id
    id
    mime
    thumbnail_uri
    timestamp
    title
    creator {
      name
      address
    }
  }
}`

const query_hdao = `query hDAOFeed($offset: Int = 0) {
  hic_et_nunc_token(order_by: {hdao_balance: desc}, limit: 50, where: {hdao_balance: {_gt: 100}}, offset: $offset) {
    artifact_uri
    display_uri
    creator_id
    id
    mime
    thumbnail_uri
    timestamp
    title
    hdao_balance
    creator {
      name
      address
    }
  }
}`

async function fetchProfiles(arr) {
  const { errors, data } = await fetchGraphQLProfiles(tz_profiles, "profiles", { "arr": arr })
  if (errors) console.error(errors)
  return data.tzprofiles
}

async function fetchHdao(offset) {
  const { errors, data } = await fetchGraphQL(query_hdao, "hDAOFeed", { "offset": offset })
  if (errors) console.error(errors)
  const result = data.hic_et_nunc_token
  return result
}

async function fetchFeed(lastId) {
  const { errors, data } = await fetchGraphQL(latest_feed, "LatestFeed", { "lastId": lastId });
  if (errors) console.error(errors)
  const result = data.hic_et_nunc_token
  return result
}

async function fetchGraphQLProfiles(operationsDoc, operationName, variables) {
  let result = await fetch('https://indexer.tzprofiles.com/v1/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName
    })
  })
  return await result.json()
}

async function fetchGraphQL(operationsDoc, operationName, variables) {
  let result = await fetch(process.env.REACT_APP_GRAPHQL_API, {
    method: 'POST',
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  })
  return await result.json()
}

async function fetchObjkts(ids) {
  const { errors, data } = await fetchGraphQL(`
    query Objkts($ids: [bigint!] = "") {
      hic_et_nunc_token(where: {id: {_in: $ids}}) {
        artifact_uri
        display_uri
        creator_id
        id
        mime
        thumbnail_uri
        timestamp
        title
        creator {
          name
          address
        }
      }
    }`, "Objkts", { "ids": ids });
  if (errors) console.error(errors)
  return data
}

async function getLastId() {
  const { errors, data } = await fetchGraphQL(`
    query LastId {
      hic_et_nunc_token(limit: 1, order_by: {id: desc}) {
        id
      }
    }`, "LastId");
  if (errors) console.error(errors)
  return data.hic_et_nunc_token[0].id
}

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function fetchRandomObjkts() {
  const firstId = 196
  const lastId = await getLastId()

  const uniqueIds = new Set()
  while (uniqueIds.size < 10) {
    uniqueIds.add(rnd(firstId, lastId))
  }

  const { errors, data } = await fetchObjkts(Array.from(uniqueIds));
  if (errors) console.error(errors)
  
  return shuffle(data.hic_et_nunc_token)
}

const getRestrictedAddresses = async () =>
  await axios
    .get(
      'https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json'
    )
    .then((res) => res.data)

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
    await getLatest(Math.min.apply(Math, items.map(e => e.id)))
  }

  useEffect(async () => {
    if (error) console.error(error)
    console.log(type)
    await getLatest(lastId)
  }, [count, type])

  const getLatest = async (id) => {
    console.log(id)
    let result = await fetchFeed(id)
    
    setCreators([...creators, result.map(e => e.creator_id)])

    result = _.uniqBy(result, 'creator_id')
    setCreators(creators.concat(result.map(e => e.creator_id)))
    result = result.filter(e => !creators.includes(e.creator_id))

    let restricted = await getRestrictedAddresses()
    result = result.filter(e => !restricted.includes(e.creator_id))
    const next = items.concat(result)
    setItems(next)
  }

  const getHdaoFeed = async () => {
    let result = await fetchHdao(offset)
    setOffset(offset + 15)
    const next = items.concat(result)
    setItems(next)
  }

  const getRandomFeed = async () => {
    let result = await fetchRandomObjkts()
    setCreators([...creators, result.map(e => e.creator_id)])

    result = _.uniqBy(result, 'creator_id')
    setCreators(creators.concat(result.map(e => e.creator_id)))
    result = result.filter(e => !creators.includes(e.creator_id))

    let restricted = await getRestrictedAddresses()
    result = result.filter(e => !restricted.includes(e.creator_id))
    const next = items.concat(result)
    setItems(next)
  }

  return (
    <Page title="">
      {items.length > 0 ?
        <InfiniteScroll
          dataLength={items.length}
          next={loadMore}
          hasMore={hasMore}
          loader={undefined}
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
        :
        <Container>
          <Padding>
            <Loading />
          </Padding>
        </Container>
      }
    </Page>
  )
}