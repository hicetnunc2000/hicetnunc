import React from 'react'
import styles from './index.module.scss'

export const Page = ({ children = null }) => {
  return <div className={styles.container}>{children}</div>
}
