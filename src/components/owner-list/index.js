import React from 'react'
import { Button, Primary } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'

export const OwnerList = ({ owners, creator, acc }) => (
  <div className={styles.container}>
    {owners.map(({ amount, wallet }, index) => (
      <div key={`${wallet}-${index}`} className={styles.owner}>
        {amount}&nbsp;x&nbsp;
        <Button href={`https://hicetnunc.xyz/tz/${wallet}`}>
          <Primary>{walletPreview(wallet)}</Primary>
        </Button>
        {(wallet===creator) ? '\u00A0(creator)' : '' }
        {(wallet===acc?.address) ? '\u00A0(you)' : '' }
      </div>
    ))}
  </div>
)
