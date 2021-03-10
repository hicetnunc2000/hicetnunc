import React from 'react'
import styles from './index.module.scss'

export const UnknownComponent = ({ mimeType }) => {
  return (
    <div className={styles.container}>
      <div className={styles.square}>{mimeType} NOT SUPPORTED (yet)</div>
    </div>
  )
}
