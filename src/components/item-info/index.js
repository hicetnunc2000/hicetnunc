import React, { useContext } from 'react'
import { PATH } from '../../constants'
import { Button, Primary, Purchase } from '../button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'

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
  const { syncTaquito, collect, curate, acc } = useContext(HicetnuncContext)
  const reducer = (accumulator, currentValue) =>
    parseInt(accumulator) + parseInt(currentValue)

  // subtract burned pieces from total
  let total = 0

  try {
    total =
      _.values(owners).length !== 0 ? _.values(owners).reduce(reducer) : 'X'
    total = _.keys(owners).includes('tz1burnburnburnburnburnburnburjAYjjX')
      ? total - owners['tz1burnburnburnburnburnburnburjAYjjX']
      : total
    //total = total - owners['tz1burnburnburnburnburnburnburjAYjjX']
  } catch (e) {
    total =
      _.values(owners).length !== 0 ? _.values(owners).reduce(reducer) : 'X'
  }

  let ed =
    swaps.length !== 0 ? swaps.map((e) => e.objkt_amount).reduce(reducer) : 'X'
  let s = _.minBy(swaps, (o) => Number(o.xtz_per_objkt))

  var message = ''

  try {
    message =
      swaps[0] !== undefined
        ? 'collect for ' + Number(s.xtz_per_objkt) / 1000000 + ' tez'
        : 'not for sale'
  } catch (e) {
    message = 'not for sale'
  }

  const handleCollect = () => {
    if (acc == null) {
      syncTaquito()
    } else {
      collect(1, s.swap_id, s.xtz_per_objkt * 1)
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
                <span>
                  Editions:
                  <span>
                    {ed}/{total}
                  </span>
                </span>
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
