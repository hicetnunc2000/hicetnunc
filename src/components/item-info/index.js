import React, { useContext } from 'react'
import { PATH } from '../../constants'
import { PrimaryButton, PurchaseButton, CurateButton } from '../button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { walletPreview } from '../../utils/string'
import styles from './index.module.scss'
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
  const { syncTaquito, collect, acc } = useContext(HicetnuncContext)

  /*  let available = 0
  if (owners !== undefined) {
    const kt = `KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9`
    available = owners[kt]
  } */

  let s = _.minBy(swaps, (o) => Number(o.xtz_per_objkt))

  // var kt = _.values(_.omitBy(owners, (value, key) => !key.startsWith('KT')))[0]
  //owners = _.values(_.omitBy(owners, (value, key) => !key.startsWith(token_info.creators[0])))

  // const soldOutMessage = 'not for sale'
  var message = ''
  // console.log(acc)
  // console.log(s, swaps)
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
            <PrimaryButton to={`${PATH.ISSUER}/${token_info.creators[0]}`}>{walletPreview(token_info.creators[0])}</PrimaryButton>
          </div>
          {!feed && (
            <div>
              <p>
                <span>
                  Editions: {/*                   {available > 0 ? ( */}
                  <span>
                    {swaps[0] !== undefined ? s.objkt_amount : undefined}
                  </span>
                  {/* /*                   ) : (
                    <span>{total_amount}</span>
                  )} */}
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
          <PrimaryButton to={`${PATH.OBJKT}/${token_id}`} disabled={isDetailView}>OBJKT#{token_id}</PrimaryButton>
        )}
        {feed ? (
          <div>
            <CurateButton tokenId={token_id} />
          </div>
        ) : (
          <PurchaseButton onClick={() => handleCollect()}>{message}</PurchaseButton>
        )}
      </div>
      <div className={styles.container}>
        {!feed && (
          <div>
            <CurateButton tokenId={token_id} />
          </div>
        )}
        <div>
          {false && (
            <PrimaryButton onClick={() => alert('report')}>Report</PrimaryButton>
          )}
        </div>
      </div>
    </>
  )
}
