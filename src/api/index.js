import { SanitiseOBJKT } from '../utils/sanitise'

const axios = require('axios')

/**
 * Gets Feed for homepage
 * filters it against a blocklist json
 */
export const GetFeed = async ({ counter }) => {
  return Promise.all([
    axios
      .post(process.env.REACT_APP_FEED, {
        counter: counter,
      })
      .catch(() => {
        return { data: { result: [] } }
      }),
    axios.get(process.env.REACT_APP_BLOCKLIST_OBJKT).catch(() => {
      return { data: [] }
    }),
    axios.get(process.env.REACT_APP_BLOCKLIST_WALLET).catch(() => {
      return { data: [] }
    }),
  ])
    .then((results) => {
      const feed = results[0].data.result
      const oblock = results[1].data
      const wblock = results[2].data

      const objkts = feed
        // filters objkt's out if they are flagges
        .filter((i) => !oblock.includes(i.token_id))
        // filter objkt's out if they're from flagged wallets
        .filter((i) => !wblock.includes(i.token_info.creators[0]))

      // filters objkt's out if they dont have the token_info prop
      return SanitiseOBJKT(objkts)
    })
    .catch((e) => {
      console.error(e)
      return []
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
        resolve(res.data.result)
      })
      .catch((e) => reject(e))
  })
}

/**
 * Get OBJKT detail page
 */
export const GetOBJKT = async ({ objkt_id }) => {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.REACT_APP_OBJKT, {
        objkt_id,
      })
      .then((res) => {
        resolve(res.data)
        console.log(res.data)
      })
      .catch((e) => reject(e))
  })
}
