const axios = require('axios')

/**
 * Gets Feed for homepage
 */
export const GetFeed = async ({ counter }) => {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.REACT_APP_FEED, { counter: counter })
      .then((res) => {
        resolve(res.data.result)
      })
      .catch((e) => reject(e))
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
