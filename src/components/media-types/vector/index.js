import React from 'react'
import classnames from 'classnames'
import styles from './index.module.scss'

export const VectorComponent = ({ src, interactive }) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: interactive,
  })
  return (
    <div className={classes}>
      <iframe
        title="hic et nunc SVG renderer"
        src={src}
        sandbox="allow-scripts"
        scrolling="no"
      />
    </div>
  )
}
