import React from 'react'
import { Padding } from '../../layout/padding'
import styles from './index.module.scss'

export const AudioComponent = ({ src, token_info }) => (
  <>
    <div className={styles.container}>
      <audio title={token_info.name} src={src} controls />
    </div>
  </>
)
