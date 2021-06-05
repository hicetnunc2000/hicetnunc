import React from 'react'
import styles from './styles.module.scss'

export const UnknownComponent = ({ mimeType }) => {
  return (
    <div className={styles.container}>
      <div className={styles.square}>{mimeType} Updating metadata info</div>
    </div>
  )
}
