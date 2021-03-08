import React from 'react'
import { Button } from '../button'
import styles from './style.module.scss'

export const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Button to="/">
          <div className={styles.logo}>〇 hic et nunc</div>
        </Button>
      </div>
    </div>
  )
}
