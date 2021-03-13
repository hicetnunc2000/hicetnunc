import React from 'react'
import styles from './index.module.scss'

export const Menu = ({ children = null }) => {
  return <div className={styles.container}>{children}</div>
}
