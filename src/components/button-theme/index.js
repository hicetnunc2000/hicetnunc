import React, { useContext } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import styles from './index.module.scss'

export const ButtonTheme = () => {
  const context = useContext(HicetnuncContext)
  return (
    <div
      className={styles.container}
      onClick={() =>
        context.setTheme(context.theme === 'light' ? 'dark' : 'light')
      }
    />
  )
}
