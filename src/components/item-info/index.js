import React, { useContext } from 'react'
import { PATH } from '../../constants'
import { Button, Primary, Purchase } from '../button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { walletPreview } from '../../utils/string'
import styles from './index.module.scss'
// import { lowestPrice } from '../../utils/lowestPrice'
// import { getTotalSales } from '../../utils/sanitise'

const _ = require('lodash')

export const ItemInfo = ({
  token_id,
  token_info,
  owners,
  swaps,
  transfered,
  feed,
  total_amount,
  isDetailView,
}) => {
  const { Tezos, syncTaquito, collect, curate } = useContext(HicetnuncContext)
  // console.log(swaps, owners, total_amount)
  // const reducer = (accumulator, currentValue) => accumulator + currentValue

  let available = 0
  let editions = 0
  // var kt = _.values(_.omitBy(owners, (value, key) => !key.startsWith('KT')))[0]
  //owners = _.values(_.omitBy(owners, (value, key) => !key.startsWith(token_info.creators[0])))

  let max = _.values(owners)
  // filtering negative values?
  max = max.filter((e) => parseInt(e) < 0)

  available = parseInt(
    _.values(_.omitBy(owners, (value, key) => !key.startsWith('KT')))[0] || 0
  )
  editions = parseInt(max[0]) * -1

  owners = _.values(_.omitBy(owners, (value, key) => key.startsWith('KT')))
  const soldOutMessage = 'not for sale'
  const notForSale = available > 0 || isNaN(editions)
  const message =
    available > 0
      ? 'collect for ' + Number(swaps[0].xtz_per_objkt) / 1000000 + ' tez'
      : 'not for sale'

  const handleCollect = () => {
    if (Tezos == null) {
      syncTaquito()
    } else {
      collect(1, swaps[0].swap_id, swaps[0].xtz_per_objkt * 1)
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
          {!feed && (
            <div>
              <p>
                {notForSale
                  ? soldOutMessage
                  : `Edition: ${available}/${editions}`}
              </p>
            </div>
          )}
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
        {feed ? (
          <div>
            <Button onClick={() => curate(token_id)}>
              <Primary>〇</Primary>
            </Button>
          </div>
        ) : (
          <Button onClick={() => handleCollect()}>
            <Purchase>{message}</Purchase>
          </Button>
        )}
      </div>
      <div className={styles.container}>
        {!feed && (
          <div>
            <Button onClick={() => curate(token_id)}>
              <Primary>〇</Primary>
            </Button>
          </div>
        )}
        <div>
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
