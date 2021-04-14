import React from 'react'
import { Tags } from '../tags'
import { MIMETYPE } from '../../constants'
import { renderMediaType } from '../media-types'
import { HTMLWarning } from '../media-types/html/warning'
import styles from './styles.module.scss'

function isHTML(mimeType) {
  return (
    mimeType === MIMETYPE.ZIP ||
    mimeType === MIMETYPE.ZIP1 ||
    mimeType === MIMETYPE.ZIP2
  )
}

export const Preview = ({ title, description, mimeType, uri, tags }) => {
  const t = tags !== '' ? tags.replace(/\s/g, '').split(',') : []
  return (
    <div className={styles.container}>
      {isHTML(mimeType) && <HTMLWarning />}
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
