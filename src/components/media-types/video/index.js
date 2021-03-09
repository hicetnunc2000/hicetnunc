import React from 'react'
import styles from './index.module.scss'

export const VideoComponent = ({ src }) => {
  return <video className={styles.container} autoPlay muted loop src={src} />
}
