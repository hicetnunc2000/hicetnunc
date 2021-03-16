import React from 'react'
import styles from './index.module.scss'

export const VectorComponent = ({ src }) => {
  console.log('vector', src)
  return (
    <div className={styles.container}>
      <iframe
        title={src}
        src={`https://hicetnunc.tiiny.site?src=${src}`}
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  )
}
