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
  const reducer = (accumulator, currentValue) => accumulator + currentValue

  var available = 0
  var editions = 0
  var kt = _.values(_.omitBy(owners, (value, key) => !key.startsWith('KT')))[0]
  console.log(kt)
  //owners = _.values(_.omitBy(owners, (value, key) => !key.startsWith(token_info.creators[0])))

  console.log(owners)
  var max = _.values(owners)
  max = max.filter((e) => parseInt(e) < 0)

  //  var max = values_arr.filter(e => e < 0)
  var available = parseInt(
    _.values(_.omitBy(owners, (value, key) => !key.startsWith('KT')))[0]
  )
  var editions = parseInt(max[0]) * -1

  owners = _.values(_.omitBy(owners, (value, key) => key.startsWith('KT')))
  console.log((available + editions) * -1)
  console.log(editions)
  console.log(swaps)
  const soldOutMessage = 'not for sale'
  const message =
    available > 0
      ? 'collect for ' + Number(swaps[0].xtz_per_objkt) / 1000000 + ' tez'
      : 'not for sale'

  const handleCollect = () => {
    if (Tezos == null) {
      syncTaquito()
    } else {
      collect(1, swaps[0].swap_id, swaps[0].xtz_per_objkt * 1)
        .then((e) => {
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
          {!feed ? (
            <div>
              <p>
                Edition: {available}/{editions}
              </p>
            </div>
          ) : undefined}
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
        {!feed ? (
          <div>
            <Button onClick={() => curate(token_id)}>
              <Primary>〇</Primary>
            </Button>
          </div>
        ) : undefined}
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
