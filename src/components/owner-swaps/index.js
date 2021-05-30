import React from 'react'
import { Button, Primary, Purchase } from '../button'
import { walletPreview } from '../../utils/string'
import { getWalletBlockList } from "../../constants";
import styles from './styles.module.scss'

const sortByPrice = (a, b) => {
  return Number(a.xtz_per_objkt) - Number(b.xtz_per_objkt)
}
export const OwnerSwaps = ({ swaps, handleCollect, acc, cancel }) => {
  const wblock = getWalletBlockList();
  return (
    <div className={styles.container}>
      {swaps.sort(sortByPrice).map((swap, index) => {
        const banned = wblock.includes(swap.issuer);
        return (
          <div key={`${swap.swap_id}-${index}`} className={styles.swap}>
            <div className={styles.issuer}>
              {swap.objkt_amount} x&nbsp;
              <Button to={`/tz/${swap.issuer}`}>
                <Primary>{walletPreview(swap.issuer)}{banned ? ' (banned)' : ''}</Primary>
              </Button>
            </div>

            {!banned && (
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
            )}
          </div>
        )
      })}
    </div>
  )
}
