import React from 'react'
import { PATH } from '../../constants'
import { Button } from '../button'
import styles from './styles.module.scss'

export const Tags = ({ tags }) => (
  <div className={styles.container}>
    {tags.map((tag, index) => (
      <Button key={`tag${tag}${index}`} to={`${PATH.TAGS}/${tag}`}>
        <div className={styles.tag}>{tag}</div>
      </Button>
    ))}
  </div>
)
