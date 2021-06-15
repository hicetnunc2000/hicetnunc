import React from 'react'
import { PATH } from '../../constants'
import { Button } from '../button'
import styles from './styles.module.scss'

export const Tags = ({ token_tags, preview }) => {
  console.log(token_tags)
  if (preview) {
    return (
      <div className={styles.container}>
        {token_tags
          .filter((e) => e !== '')
          .map((tag, index) => {
            return (
              <Button
                key={`tag${tag}${index}`}
                to={`${PATH.TAGS}/${encodeURI(tag)}`}
              >
                <div className={styles.tag}>{tag}</div>
              </Button>
            )
          })}
      </div>
    )
  } else {
    return (
      <div className={styles.container}>
        {token_tags
          .filter((e) => e !== '')
          .map((tag, index) => {
            return (
              <Button
                key={`tag${tag.tag.tag}${index}`}
                to={`${PATH.TAGS}/${encodeURI(tag.tag.tag)}`}
              >
                <div className={styles.tag}>{tag.tag.tag}</div>
              </Button>
            )
          })}
      </div>
    )
  }
}
