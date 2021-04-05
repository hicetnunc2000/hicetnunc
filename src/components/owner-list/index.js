import React from 'react'
import { PrimaryButton } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './index.module.scss'

export const OwnerList = ({ owners }) => (
  <div className={styles.container}>
    {owners.map(({ amount, wallet }, index) => (
      <div key={`${wallet}-${index}`} className={styles.owner}>
        {amount}x&nbsp;
        <PrimaryButton href={`https://hicetnunc.xyz/tz/${wallet}`}>{walletPreview(wallet)}</PrimaryButton>
      </div>
    ))}
  </div>
)
