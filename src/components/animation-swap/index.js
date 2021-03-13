import React from 'react'
import styles from './index.module.scss'

export const AnimationSwap = ({ label }) => {
  return (
    <div className={styles.container}>
      <div data-label={label} className={styles.text}>
        {label}
      </div>
    </div>
  )
}
