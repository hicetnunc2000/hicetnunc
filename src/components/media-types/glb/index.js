import React from 'react'
import styles from './index.module.scss'

/* DOCS: https://modelviewer.dev/ */
export const GLBComponent = ({ src }) => {
  return (
    <div className={styles.container}>
      <model-viewer
        className={styles.glb}
        src={src}
        auto-rotate
        camera-controls
      ></model-viewer>
    </div>
  )
}
