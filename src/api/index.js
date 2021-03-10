const axios = require('axios')

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
