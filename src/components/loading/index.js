import React from 'react'
import styles from './index.module.scss'

export const Loading = ({ message }) => {
  return (
    <div className={styles.container}>
      {message && <p>{message}</p>}
      <div className={styles.circle} />
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
