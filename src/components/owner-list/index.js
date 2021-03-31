import React from 'react'
import { Button, Primary } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './index.module.scss'

export const OwnerList = ({ owners }) => (
  <div className={styles.container}>
    {owners.map(({ amount, wallet }, index) => (
      <div key={`${wallet}-${index}`} className={styles.owner}>
        {amount}x&nbsp;
        <Button href={`https://hicetnunc.xyz/tz/${wallet}`}>
          <Primary>{walletPreview(wallet)}</Primary>
        </Button>
      </div>
    ))}
  </div>
)
