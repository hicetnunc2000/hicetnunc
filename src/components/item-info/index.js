import React, { useContext } from 'react'
import { PATH } from '../../constants'
import { Padding } from '../layout'
import { Button, Primary, Purchase } from '../button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import styles from './index.module.scss'

export const ItemInfo = ({ token_id, swaps, total_amount }) => {
  const context = useContext(HicetnuncContext)

  const notForSale = swaps.length === 0
  const price = swaps.length > 0 && Number(swaps[0].xtz_per_objkt) / 1000000
  const edition = swaps.length && `${swaps[0].objkt_amount}/${total_amount}`
  const message = notForSale ? 'not for sale' : `collect for ${price} tez`

  const handleCollect = () => {
    if (context.Tezos == null) {
      context.syncTaquito()
    } else {
      context.collect(1, swaps[0].swap_id, swaps[0].xtz_per_objkt * 1)
    }
  }

  return (
    <>
      <Padding>
        <div className={styles.container}>
          <Button to={`${PATH.OBJKT}/${token_id}`}>
            <Primary>OBJKT#{token_id}</Primary>
          </Button>

          <Button onClick={() => handleCollect()} disabled={notForSale}>
            <Purchase>{message}</Purchase>
          </Button>
        </div>

        {!notForSale && <p className={styles.edition}>Edition: {edition}</p>}
      </Padding>
    </>
  )
}
