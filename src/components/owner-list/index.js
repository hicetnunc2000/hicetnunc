import React from 'react'
import { Button, Primary } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'

export const OwnerList = ({ owners, creator_id, acc, swaps }) => {

  owners = owners.filter(e => e.holder_id !== 'tz1burnburnburnburnburnburnburjAYjjX' && e.holder_id !== 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn' && e.holder_id !== 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9')

  return (


    <div className={styles.container}>
      {owners.map(({ quantity, holder_id, holder, creator_id }, index) => (


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
                undefined
          }
        </div>
      ))}
      {
        swaps.map((e, index) => {
          if (acc) {
            if (acc && !acc.address == e.creator_id) {
              return (
                <div>
                  <div key={`${e.id}-${index}`} className={styles.swap}>
                    <div className={styles.issuer}>
                      {e.amount_left} ed.&nbsp;
                      <Button to={'/tz/KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9'}>
                        <Primary>OBJKTSWAP V1</Primary>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            } else {
              return undefined
            }
          } else {
            return undefined
          }
        })
      }
    </div>
  )
}
