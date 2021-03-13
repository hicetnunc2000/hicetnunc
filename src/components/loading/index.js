import React from 'react'
import styles from './index.module.scss'

export const Loading = ({ message }) => {
  return (
    <div className={styles.container}>
      <div className={styles.circle} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
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
