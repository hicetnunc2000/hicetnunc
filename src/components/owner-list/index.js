import React from 'react'
import { Button, Primary } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './index.module.scss'

export const OwnerList = ({ owners }) => (
  <div className={styles.container}>
    {owners.map(({ amount, wallet }) => {
      return (
        <div key={wallet} className={styles.owner}>
          {amount}x&nbsp;
          <Button href={`https://tzkt.io/${wallet}`}>
            <Primary>{walletPreview(wallet)}</Primary>
          </Button>
        </div>
      )
    })}
  </div>
)
