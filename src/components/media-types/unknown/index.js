import React, { useState } from 'react'
import styles from './styles.module.scss'
const axios = require('axios')

export const UnknownComponent = ({ mimeType }) => {
/*   const [queue, updateQueue] = useState()
  updateQueue(await axios.post(process.env.REACT_APP_GRAPHQL_STATUS).then(res => res.data))
 */
  return (
    <div className={styles.container}>
      <div className={styles.square}>Metadata on queue</div>
    </div>
  )
}
