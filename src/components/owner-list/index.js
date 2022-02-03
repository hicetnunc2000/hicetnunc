import React from 'react'
import { Button, Primary } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'

export const OwnerList = ({ owners }) => {
  owners = owners.filter(e => e.holder_id !== 'tz1burnburnburnburnburnburnburjAYjjX' && e.holder_id !== 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn')
  return (

    <div className={styles.container}>
      {owners.map(({ quantity, holder_id, holder }, index) => (


        <div key={`${holder_id}-${index}`} className={styles.owner}>
          {quantity}&nbsp;ed.&nbsp;
          {
            holder.name ?
              <Button to={`/tz/${holder_id}`}>
                <Primary>{encodeURI(holder.name)}</Primary>
              </Button>
              :
              holder_id !== 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9'
                ?
                <Button to={`/tz/${holder_id}`}>
                  <Primary>{walletPreview(holder_id)}</Primary>
                </Button>
                :
                <Button to={`/tz/${holder_id}`}>
                  <Primary>OBJKTSWAP V1</Primary>
                </Button>
          }
        </div>
      ))}
    </div>
  )
}
