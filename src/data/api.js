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
  setLogoList,
} from '../constants'

const axios = require('axios')

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
    axios.get(process.env.REACT_APP_LOGOS), // list of logos we rotate through
  ]).then((results) => {
    setLanguage(results[0].data)
    setObjktBlockList(results[1].data)
    setWalletBlockList(results[2].data)
    setBanBlockList(results[3].data)
    setLogoList(results[4].data)

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

/**
 * Get User claims from their tzprofile
 */
const GetUserClaims = async (walletAddr) => {
  return await axios.post('https://indexer.tzprofiles.com/v1/graphql', {
    query: `query MyQuery { tzprofiles_by_pk(account: "${walletAddr}") { valid_claims } }`,
    variables: null,
    operationName: 'MyQuery',
  })
}

/**
 * Get User Metadata
 */
export const GetUserMetadata = async (walletAddr) => {
  let tzktData = {}

  let tzpData = {}
  try {
    let claims = await GetUserClaims(walletAddr)
    if (claims.data.data.tzprofiles_by_pk !== null)
      for (const claim of claims.data.data.tzprofiles_by_pk.valid_claims) {
        let claimJSON = JSON.parse(claim[1])
        if (claimJSON.type.includes('TwitterVerification')) {
          if (!tzktData.data || !tzktData.data.twitter ) {
            tzpData['twitter'] = claimJSON.evidence.handle
          }
        } else if (claimJSON.type.includes('BasicProfile')) {
          if (claimJSON.credentialSubject.alias !== "" && !(tzktData.data && tzktData.data.alias))
            tzpData['alias'] = claimJSON.credentialSubject.alias
          tzpData['tzprofile'] = walletAddr
        } else if (claimJSON.type.includes('DiscordVerification')) {
          if (!tzktData.data) {
            tzpData['discord'] = claimJSON.evidence.handle
          }
        } else if (claimJSON.type.includes('GitHubVerification')) {
          if (!tzktData.data) {
            tzpData['github'] = claimJSON.evidence.handle
          }
        } else if (claimJSON.type.includes('DnsVerification')) {
          if (!tzktData.data) {
            tzpData['dns'] = claimJSON.credentialSubject.sameAs.slice(4)
          }
        }
      }
  } catch (e) {
    console.error(e, e.stack);
  }

  if (tzpData) {
    tzktData.data = tzpData
  }

  return tzktData
}
