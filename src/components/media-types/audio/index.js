import React from 'react'
import styles from './index.module.scss'

export const AudioComponent = ({ src }) => (
  <div className={styles.container}>
    <audio src={src} controls />
  </div>
)
