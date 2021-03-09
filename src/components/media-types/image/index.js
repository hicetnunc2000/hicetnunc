import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import styles from './index.module.scss'

export const ImageComponent = ({ src }) => {
  return <LazyLoadImage className={styles.container} src={src} alt="💥" />
}
