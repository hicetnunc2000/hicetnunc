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

/**
 * This loads the initial data (language.json, o.json, w.json, b.json)
 */
export const getInitialData = () => {
  const language = getItem('language') || setItem('language', 'en')
  const langRoot =
    process.env.NODE_ENV === 'development'
      ? '/languages'
      : 'https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/languages'

  return Promise.all([
    axios.get(`${langRoot}/${language}.json`), // loads language file
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
export const GetLatestFeed = async ({ counter }) => {
  return new Promise((resolve, reject) => {
    axios.post(process.env.REACT_APP_FEED, { counter: counter }).then((res) => {
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
      .post(process.env.REACT_APP_FEED_HDAO, { counter: counter })
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
      .post(process.env.REACT_APP_RANDOM, { counter: counter })
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
      .post(process.env.REACT_APP_OBJKT, {
        objkt_id: id,
      })
      .then((res) => {
        resolve(res.data.result)
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get User Metaata from tzkt.io
 */
export const GetUserMetadata = async (walletAddr) => {
  return await axios.get(
    `https://api.tzkt.io/v1/accounts/${walletAddr}/metadata`
  )
}
