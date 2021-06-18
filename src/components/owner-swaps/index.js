import React from 'react'
import { Button, Primary, Purchase } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'

const sortByPrice = (a, b) => {
  return Number(a.xtz_per_objkt) - Number(b.xtz_per_objkt)
}

export const OwnerSwaps = ({ swaps, handleCollect, acc, cancel }) => {
  return (
    <div className={styles.container}>
      {swaps.sort(sortByPrice).map((swap, index) => {
        return (
          <div key={`${swap.id}-${index}`} className={styles.swap}>
            <div className={styles.issuer}>
              {swap.amount_left} x&nbsp;
              {swap.creator.name ? (
                <Button to={`/tz/${swap.creator.address}`}>
                  <Primary>{swap.creator.name}</Primary>
                </Button>
              ) : (
                <Button to={`/tz/${swap.creator.address}`}>
                  <Primary>{walletPreview(swap.creator.address)}</Primary>
                </Button>
              )}
            </div>

            <div className={styles.buttons}>
              <Button onClick={() => handleCollect(swap.id, swap.price)}>
                <Purchase>
                  collect for {parseFloat(swap.price / 1000000)} tez
                </Purchase>
              </Button>
              {swap.creator.address ===
                (acc !== undefined ? acc.address : '') && (
                <Button onClick={() => cancel(swap.id)}>
                  <Purchase>cancel</Purchase>
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
