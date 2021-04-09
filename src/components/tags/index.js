import React from 'react'
import styles from './styles.module.scss'

export const Tags = ({ tags }) => (
  <div className={styles.container}>
    {tags.map((tag, index) => (
      <div key={`tag${tag}${index}`} className={styles.tag}>
        {tag}
      </div>
    ))}
  </div>
)
