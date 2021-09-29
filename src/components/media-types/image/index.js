import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import styles from './styles.module.scss'

export const ImageComponent = ({
  artifactUri,
  displayUri,
  previewUri,
  onDetailView,
  preview,
  displayView
}) => {
  let src = onDetailView ? artifactUri : displayUri || artifactUri
  console.log('src', src)
  console.log('artifact', artifactUri, 'display', displayUri)
  if (preview) {
    src = previewUri
  }

  if (displayView) {
    return (
      <div className={styles.container}>
        <LazyLoadImage className={styles.image} src={src} alt="💥" />
      </div>
    )
  } else {
    return (
      <div>
        <div>
          <LazyLoadImage className={styles.style} src={src} alt="💥" />
        </div>
      </div>
    )
  }
}
