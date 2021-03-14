import React from 'react'
import { Tags } from '../tags'
import { renderMediaType } from '../media-types'
import styles from './index.module.scss'

export const Preview = ({ mimeType, uri, tags }) => {
  const t = tags !== '' ? tags.replace(/\s/g, '').split(',') : []

  return (
    <div className={styles.container}>
      <div className={styles.media}>
        {renderMediaType({
          mimeType,
          uri,
          interactive: true,
          preview: true,
        })}
      </div>
      <div className={styles.info}>
        <Tags tags={t} />
      </div>
    </div>
  )
}
