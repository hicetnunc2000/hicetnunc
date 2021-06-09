// import { WalletPostMessageTransport } from '@airgap/beacon-sdk'
import { SanitiseOBJKT } from '../utils/sanitise'
import { getItem, setItem } from '../utils/storage'
import {
  setLanguage,
  setObjktBlockList,
  getObjktBlockList,
  setWalletBlockList,
  getWalletBlockList,
  setBanBlockList,
} from '../constants'

const axios = require('axios')
const fetch = require('node-fetch')

/**
 * This loads the initial data (language.json, o.json, w.json, b.json)
 */
export const getInitialData = () => {
  const language = getItem('language') || setItem('language', 'en')

  return Promise.all([
    axios.get(`/languages/${language}.json`), // loads language file
    axios.get(process.env.REACT_APP_BLOCKLIST_OBJKT), // loads blocked objkt
    axios.get(process.env.REACT_APP_BLOCKLIST_WALLET), // loads blocked wallets
    axios.get(process.env.REACT_APP_BLOCKLIST_BAN), // blocked wallets (dont allow to visualise in /tz/walletid)
  ]).then((results) => {
    setLanguage(results[0].data)
    setObjktBlockList(results[1].data)
    setWalletBlockList(results[2].data)
    setBanBlockList(results[3].data)

    return true
  })
}

// filter all feeds to remove objkt and wallets that are blocked.
// DO NOT CHANGE! (Andre)
const filterFeeds = (original) => {
  const oblock = getObjktBlockList()
  const wblock = getWalletBlockList()

  const filtered = SanitiseOBJKT(original)
    // filters objkt's out if they are flagged
    .filter((i) => !oblock.includes(i.token_id))
    // filter objkt's out if they're from flagged wallets
    .filter((i) => !wblock.includes(i.token_info.creators[0]))
  return filtered
}

/**
 * Gets Feed for homepage
 * filters it against a blocklist json
 */
export const GetLatestFeed = async ({ counter, max_time }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_FEED, {
        params: { counter: counter, max_time: max_time },
      })
      .then((res) => {
        resolve(filterFeeds(res.data.result))
      })
  })
}

/**
 * Gets Feed for homepage hDAO
 */
export const GethDAOFeed = async ({ counter }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_FEED_HDAO, {
        params: { counter: counter },
      })
      .then((res) => {
        resolve(filterFeeds(res.data.result))
      })
  })
}

/**
 * Gets Feed for Featured
 */
export const GetFeaturedFeed = async ({ counter, max_time }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_FEATURED, {
        params: { counter: counter, max_time: max_time },
      })
      .then((res) => {
        resolve(filterFeeds(res.data.result))
      })
  })
}

/**
 * Get Random Feed
 */
export const GetRandomFeed = async ({ counter }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_RANDOM, {
        params: { counter: counter },
      })
      .then((res) => {
        resolve(filterFeeds(res.data.result))
      })
  })
}

/**
 * Get OBJKT detail page
 */
export const GetOBJKT = async ({ id }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_OBJKT, {
        params: { id: id },
      })
      .then((res) => {
        // console.log(res.data)
        resolve(res.data.result)
      })
      .catch((e) => reject(e))
  })
}

/**
 * Get OBJKT detail page
 */
export const GetTags = async ({ tag, counter }) => {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.REACT_APP_TAGS, { tag: tag, counter: counter })
      .then((res) => {
        // console.log(res.data)
        resolve(res.data.result)
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

const tagQuery = `query ObjktsByTag($tag: String = "3d", $lastId: bigint = 99999999) {
  hic_et_nunc_token(where: {token_tags: {tag: {tag: {_eq: $tag}}}, id: {_lt: $lastId}, supply: {_gt: "0"}}, limit: 250, order_by: {id: desc}) {
    id
    title
    artifact_uri
    display_uri
    creator_id
  }
}`

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "https://api.hicdex.com/v1/graphql",
    {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}
export const GetTagsGraphQL = async (tag) => {
  const { errors, data } = await fetchGraphQL(tagQuery, "ObjktsByTag", { "tag": tag });
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
  console.log({ result })
  return result
}

/**
 * Get User Metadata from tzkt.io
 */
export const GetUserMetadata = async (walletAddr) => {
  return await axios.get(
    `https://api.tzkt.io/v1/accounts/${walletAddr}/metadata`
  )
}
