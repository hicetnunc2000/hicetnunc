import React from 'react'
import styles from './index.module.scss'

export const Loading = ({ loading, children = null }) => {
  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.circle} />
      </div>
    )
  }
  return children
}
