import React from 'react'
import styles from './index.module.scss'

export const VectorComponent = ({ src }) => {
  return (
    <div className={styles.container}>
      <iframe
        title={src}
        src={`https://hicetnunc2000.github.io/hicetnunc/gh-pages/sandbox-svg.html?src=${src}`}
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  )
}
