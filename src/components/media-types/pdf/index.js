import React from 'react'
import styles from './styles.module.scss'

export const PdfComponent = ({ src, pdfscroll = true }) => {
  const iframeClass = pdfscroll?'':styles.noscroll
  return (
  <div className={styles.container}>
    <iframe
      title="hic et nunc PDF renderer"
      src={`${src}#zoom=50`}
      scrolling="no"
      className={iframeClass}
    />
  </div>
  )
}