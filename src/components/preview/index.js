import React from 'react'
import { Tags } from '../tags'
import { renderMediaType } from '../media-types'
import styles from './index.module.scss'

export const Preview = ({ title, description, mimeType, uri, tags }) => {
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
        <div>TITLE</div>
        <div className={styles.title}>{title}</div>
        <div>DESCRIPTION</div>
        <div className={styles.description}>{description}</div>
        <Tags tags={t} />
      </div>
    </div>
  )
}
