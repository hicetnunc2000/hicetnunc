import React from 'react'
import styles from './styles.module.scss'

export const AudioComponent = ({ src, token_info }) => (
  <>
    <div className={styles.container}>
      <audio title={token_info.name} src={src} controls />
    </div>
  </>
)
