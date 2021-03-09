import React from 'react'
import styles from './index.module.scss'

export const VideoComponent = ({ src }) => {
  return (
    <div className={styles.container}>
      <video className={styles.video} autoPlay muted loop src={src} />
    </div>
  )
}
