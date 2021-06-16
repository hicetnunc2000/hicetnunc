import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import styles from './styles.module.scss'

export const ImageComponent = ({
  artifactUri,
  displayUri,
  previewUri,
  onDetailView,
  preview,
}) => {
  let src = onDetailView ? artifactUri : displayUri || artifactUri
  if (preview) {
    src = previewUri
  }
  return (
    <div className={styles.container}>
      <LazyLoadImage className={styles.image} src={src} alt="💥" />
    </div>
  )
}
