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
      }),
    axios.get(process.env.REACT_APP_BLOCKLIST_OBJKT).catch(() => {
      return { data: [] }
    }),
    axios.get(process.env.REACT_APP_BLOCKLIST_WALLET).catch(() => {
      return { data: [] }
    }),
  ])
    .then((results) => {
      const original = results[0].data.result
      const oblock = results[1].data
      const wblock = results[2].data

      const filtered = SanitiseOBJKT(original)
        // filters objkt's out if they are flagges
        .filter((i) => !oblock.includes(i.token_id))
        // filter objkt's out if they're from flagged wallets
        .filter((i) => !wblock.includes(i.token_info.creators[0]))

      // filters objkt's out if they dont have the token_info prop
      return {
        filtered,
        original,
      }
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
