import React from 'react'
import styles from './index.module.scss'

export const VectorComponent = ({ src }) => {
  return (
    <div className={styles.container}>
      <object className={styles.object} data={src} type="image/svg+xml"><p>error: use a more modern browser</p></object>
    </div>
  )
}