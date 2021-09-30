import React, { useContext } from 'react'
import { PATH } from '../../constants'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Button } from '../button'
import styles from './styles.module.scss'

export const Tags = ({ token_tags, preview }) => {
  const context = useContext(HicetnuncContext)

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
          .filter((e) => e.tag.tag !== '')
          .map((tag, index) => {
            return (
              <a
                key={`tag${tag.tag.tag}${index}`}
                href={`${PATH.TAGS}/${encodeURI(tag.tag.tag)}`}
              >
                <div className={`${styles.tag} ${context.theme === 'light' ? styles.light : styles.dark}`}>{tag.tag.tag}</div>
              </a>
            )
          })}
      </div>
    )
  }
}
