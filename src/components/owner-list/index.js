import React from 'react'
import { Button, Primary } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'

export const OwnerList = ({ owners, creator, acc }) => {

  console.log('owners list', owners)

  owners = owners.filter(e => e.holder_id !== 'tz1burnburnburnburnburnburnburjAYjjX')

  return (


    <div className={styles.container}>
      {owners.map(({ quantity, holder_id, holder }, index) => (
        <div key={`${holder_id}-${index}`} className={styles.owner}>
          {quantity}&nbsp;x&nbsp;
          {
            holder.name ?
              <Button href={`https://hicetnunc.xyz/${holder.name}`}>
                <Primary>{holder.name}</Primary>
              </Button>
              :
              <Button href={`https://hicetnunc.xyz/tz/${holder_id}`}>
                <Primary>{walletPreview(holder_id)}</Primary>
              </Button>
          }
        </div>
      ))}
    </div>
  )
}
