import React from 'react'
import styles from './styles.module.scss'

export const Menu = ({ children = null }) => {
  return <nav className={styles.container}>{children}</nav>
}
