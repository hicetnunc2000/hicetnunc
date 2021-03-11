import React, { useContext } from 'react'
import { PATH } from '../../constants'
import { Button, Primary, Purchase } from '../button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { walletPreview } from '../../utils/string'
import styles from './index.module.scss'
import { lowestPrice } from '../../utils/lowestPrice'

export const ItemInfo = ({
  token_id,
  token_info,
  swaps,
  total_amount,
  isDetailView,
}) => {
  const context = useContext(HicetnuncContext)

  const notForSale = swaps.length === 0
  // least expensive
  const swap = lowestPrice(swaps)
  const price = swaps.length > 0 && Number(swap.xtz_per_objkt) / 1000000
  const edition = swaps.length && `${swap.objkt_amount}/${total_amount}`
  const message = notForSale ? 'not for sale' : `collect for ${price} tez`

  const handleCollect = () => {
    if (context.Tezos == null) {
      context.syncTaquito()
    } else {
      context.collect(1, swap.swap_id, swap.xtz_per_objkt * 1)
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.edition}>
          <div className={styles.inline}>
            <p>Issuer:&nbsp;</p>
            <Button to={`${PATH.ISSUER}/${token_info.creators[0]}`}>
              <Primary>{walletPreview(token_info.creators[0])}</Primary>
            </Button>
          </div>
          {!notForSale && <p>Edition: {edition}</p>}
        </div>
      </div>

      <div className={styles.container}>
        <Button to={`${PATH.OBJKT}/${token_id}`} disabled={isDetailView}>
          <Primary>OBJKT#{token_id}</Primary>
        </Button>

        <Button onClick={() => handleCollect()} disabled={notForSale}>
          <Purchase>{message}</Purchase>
        </Button>
      </div>
    </>
  )
}
