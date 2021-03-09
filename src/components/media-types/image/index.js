import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import styles from './index.module.scss'

export const ImageComponent = ({ src }) => {
  return (
    <div className={styles.container}>
      <LazyLoadImage className={styles.image} src={src} alt="💥" />
    </div>
  )
}
