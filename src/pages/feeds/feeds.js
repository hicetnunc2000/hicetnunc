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
  return data.tzprofiles
}

async function fetchHdao(offset) {
  const { errors, data } = await fetchGraphQL(query_hdao, "hDAOFeed", { "offset": offset })
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
  /* console.log({ result }) */
  return result
}

async function fetchFeed(lastId) {
  const { errors, data } = await fetchGraphQL(latest_feed, "LatestFeed", { "lastId": lastId });
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
  /* console.log({ result }) */
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
  if (errors) {
    console.log(errors)
  }
  return data
}

async function getLastId() {
  const { errors, data } = await fetchGraphQL(`
    query LastId {
      hic_et_nunc_token(limit: 1, order_by: {id: desc}) {
        id
      }
    }`, "LastId");
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

  let objkts = await fetchObjkts(Array.from(uniqueIds));

  if (errors) {
    console.error(errors);
  }

  const result = data
  return shuffle(objkts.hic_et_nunc_token)
}

const getRestrictedAddresses = async () =>
  await axios
    .get(
      'https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json'
    )
    .then((res) => res.data)

const GetUserClaims = async (arr) => {
  return await axios.post('https://indexer.tzprofiles.com/v1/graphql', {
    query: `query MyQuery { tzprofiles_by_pk(account: \"${walletAddr}\") { valid_claims } }`,
    variables: null,
    operationName: 'MyQuery',
  })
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
    /*     if (type === 1) {
          await getHdaoFeed()
        } */
    //await getRandomFeed()
    await getLatest(Math.min.apply(Math, items.map(e => e.id)))
  }

  useEffect(async () => {
    if (error) {
      console.log('returning on error')
      return
    }
    /*     if (type === 0) {
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
        } else if (type === 2) { */
    //await getRandomFeed()
    //} else if (type === 3) {
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
    //}
  }, [count, type])

  const getLatest = async (id) => {
    let result = await fetchFeed(id)
    //console.log('feed', await fetchProfiles(result.map(e => e.creator_id)))
    setCreators([...creators, result.map(e => e.creator_id)])

    result = _.uniqBy(result, 'creator_id')
    setCreators(creators.concat(result.map(e => e.creator_id)))
    result = result.filter(e => !creators.includes(e.creator_id))

    let restricted = await getRestrictedAddresses()
    result = result.filter(e => !restricted.includes(e.creator_id))

    //fetchProfiles(addrs)
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
        <Container xlarge>
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
        </Container>
        :
        <Container>
          <Padding>
            <Loading />
          </Padding>
        </Container>
      }
      {/*       <BottomBanner>
        API is down due to heavy server load — We're working to fix the issue — please be patient with us. <a href="https://discord.gg/mNNSpxpDce" target="_blank">Join the discord</a> for updates.
      </BottomBanner> */}
    </Page>
  )
}
