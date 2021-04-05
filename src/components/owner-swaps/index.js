import React from 'react'
import { PrimaryButton, PurchaseButton } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './index.module.scss'

export const OwnerSwaps = ({ swaps, handleCollect, acc, cancel }) => (
  <div className={styles.container}>
    {swaps.map((swap, index) => {
      return (
        <div key={`${swap.swap_id}-${index}`} className={styles.swap}>
          <div className={styles.issuer}>
            {swap.objkt_amount} x&nbsp;
            <PrimaryButton to={`/tz/${swap.issuer}`}>{walletPreview(swap.issuer)}</PrimaryButton>
          </div>

          <div className={styles.buttons}>
            <PurchaseButton onClick={() => handleCollect(swap.swap_id, swap.xtz_per_objkt)}>
              collect for {parseFloat(swap.xtz_per_objkt / 1000000)} tez
            </PurchaseButton>
            {swap.issuer === (acc !== undefined ? acc.address : '') && (
              <PurchaseButton onClick={() => cancel(swap.swap_id)}>cancel</PurchaseButton>
            )}
          </div>
        </div>
      )
    })}
  </div>
)
