import React from 'react'
import styles from './index.module.scss'

export const VectorComponent = ({ src }) => {
  return (
    <div className={styles.container}>
      <iframe
        title="hic et nunc SVG renderer"
        src={src}
        sandbox="allow-same-origin allow-scripts"
        scrolling="no"
      />
    </div>
  )
}
