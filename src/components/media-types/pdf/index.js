import React from 'react'
import styles from './styles.module.scss'

export const PdfComponent = ({ src }) => (
  <div className={styles.container}>
    <iframe
      title="hic et nunc PDF renderer"
      src={`${src}#zoom=50`}
      scrolling="no" 
      loading="lazy" 
    />
  </div>
)
