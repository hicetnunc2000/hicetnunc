import React from 'react'
import { Button, Primary, Purchase } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'

export const OwnerSwaps = ({ swaps, handleCollect, acc, cancel, creator }) => (
  <div className={styles.container}>
    {swaps.map((swap, index) => {
      return (
        <div key={`${swap.swap_id}-${index}`} className={styles.swap}>
          <div className={styles.issuer}>
            {swap.objkt_amount} x&nbsp;
            <Button to={`/tz/${swap.issuer}`}>
              <Primary>{walletPreview(swap.issuer)}</Primary>
            </Button>
            {(swap.issuer===creator) ? '\u00A0(creator)' : '' }
            {(swap.issuer===acc?.address) ? '\u00A0(you)' : '' }
          </div>

          <div className={styles.buttons}>
            <Button
              onClick={() => handleCollect(swap.swap_id, swap.xtz_per_objkt)}
            >
              <Purchase>
                collect for {parseFloat(swap.xtz_per_objkt / 1000000)} tez
              </Purchase>
            </Button>
            {swap.issuer === (acc !== undefined ? acc.address : '') && (
              <Button onClick={() => cancel(swap.swap_id)}>
                <Purchase>cancel</Purchase>
              </Button>
            )}
          </div>
        </div>
      )
    })}
  </div>
)
