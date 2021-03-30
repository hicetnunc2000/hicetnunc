import React from 'react'
import styles from './index.module.scss'

export const ImageComponent = ({ src }) => {
  return (
    <div className={styles.container}>
      <img className={styles.image} src={src} alt="💥" loading="lazy" />
    </div>
  )
}
