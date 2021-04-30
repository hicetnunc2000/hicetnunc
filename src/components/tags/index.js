import React from 'react'
import { PATH } from '../../constants'
import { Button } from '../button'
import styles from './styles.module.scss'

export const Tags = ({ tags }) => {
  return (
    <div className={styles.container}>
      {tags.map((tag, index) => {
        return (
          <Button
            key={`tag${tag}${index}`}
            to={`${PATH.TAGS}/${tag.toLowerCase()}`}
          >
            <div className={styles.tag}>{tag}</div>
          </Button>
        )
      })}
    </div>
  )
}
