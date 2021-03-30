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
  const { syncTaquito, collect, curate, acc } = useContext(HicetnuncContext)

 /*  let available = 0
  if (owners !== undefined) {
    const kt = `KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9`
    available = owners[kt]
  } */

  let s = _.minBy(swaps, 'xtz_per_objkt')

  console.log(s)
  // var kt = _.values(_.omitBy(owners, (value, key) => !key.startsWith('KT')))[0]
  //owners = _.values(_.omitBy(owners, (value, key) => !key.startsWith(token_info.creators[0])))

  // const soldOutMessage = 'not for sale'
  var message = ''
  console.log(acc)
  console.log(s, swaps)
  //const notForSale = available > 0 || isNaN(editions)
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
                  Editions:{' '}
{/*                   {available > 0 ? ( */}
                    <span>
                      {s.objkt_amount}
                    </span>
{/* /*                   ) : (
                    <span>{total_amount}</span>
                  )} */ }
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
