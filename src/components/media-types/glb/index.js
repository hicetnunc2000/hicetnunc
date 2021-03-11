import React from 'react'
import styles from './index.module.scss'

/* DOCS: https://modelviewer.dev/ */
export const GLBComponent = ({ src, interactive = false }) => {
  const props = {
    className: styles.glb,
    src,
    'auto-rotate': true,
    'data-js-focus-visible': true,
  }

  if (interactive) {
    props['camera-controls'] = true
  }

  console.log(props)
  return (
    <div className={styles.container}>
      <model-viewer {...props} />
    </div>
  )
}
