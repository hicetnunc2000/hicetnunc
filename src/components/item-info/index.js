import React, { useContext } from 'react'
import { PATH } from '../../constants'
import { Button, Primary, Purchase } from '../button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { walletPreview } from '../../utils/string'
import styles from './index.module.scss'
import { lowestPrice } from '../../utils/lowestPrice'
import { getTotalSales } from '../../utils/sanitise'

export const ItemInfo = ({
  token_id,
  token_info,
  owners,
  swaps,
  transfered,
  total_amount,
  isDetailView,
}) => {
  const { Tezos, syncTaquito, collect } = useContext(HicetnuncContext)
  const swap = swaps
  const price = swaps[0] != undefined ? Number(swaps[0].xtz_per_objkt) / 1000000 : 'x'

  const edition = swap.amount !== undefined ? swap.amount : 'x' 
  //const message = `collect for ${price} tez`
  const message = 'x'
  const handleCollect = () => {
    if (Tezos == null) {
      syncTaquito()
    } else {
      collect(1, swap.swap_id, swap.xtz_per_objkt * 1)
        .then((e) => {
          alert(e.message)
          console.log('response from taquito', e)
        })
        .catch((e) => {
          alert('an error occurred')
          console.log('ko', e)
        })
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
          <p>Edition: {edition}</p>
        </div>
      </div>

      <div className={styles.container}>
        {isDetailView ? (
          <p>OBJKT#{token_id}</p>
        ) : (
          <Button to={`${PATH.OBJKT}/${token_id}`} disabled={isDetailView}>
            <Primary>OBJKT#{token_id}</Primary>
          </Button>
        )}

        <Button onClick={() => handleCollect()} >
          <Purchase>{message}</Purchase>
        </Button>
      </div>
      <div className={styles.container}>
        <div>
          <Button onClick={() => alert('upvote')}>
            <Primary>〇</Primary>
          </Button>

          {false && (
            <Button onClick={() => alert('report')}>
              <Primary>Report</Primary>
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
