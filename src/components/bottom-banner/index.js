import React from 'react'
import styles from './styles.module.scss'

export const BottomBanner = ({ children = null }) => {
  if (!children) return null
  return <div className={styles.container}>{children}</div>
}