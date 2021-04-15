import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import styles from './styles.module.scss'

export const ImageComponent = ({ src }) => (
  <div className={styles.container}>
    <LazyLoadImage className={styles.image} src={src} alt="💥" />
  </div>
)
