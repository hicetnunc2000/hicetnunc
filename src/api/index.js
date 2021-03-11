const axios = require('axios')

/**
 * Gets Feed for homepage
 * filters it against a blacklist json
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
  ])
    .then((results) => {
      const feed = results[0].data.result
      const blacklist = results[1].data
      return feed.filter((i) => !blacklist.includes(i.token_id))
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
      })
      .catch((e) => reject(e))
  })
}
