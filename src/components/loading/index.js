import React from 'react'
import styles from './index.module.scss'

export const Loading = () => {
  return <div className={styles.circle} />
}

export const LoadingContainer = ({ loading, children = null }) => {
  if (loading) {
    return (
      <div className={styles.loader}>
        <Loading />
      </div>
    )
  }
  return children
}
