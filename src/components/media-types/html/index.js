import React from 'react'
import { injectCSPMetaTagIntoDataURI } from '../../../utils/html'
import classnames from 'classnames'
import styles from './index.module.scss'

export const HTMLComponent = ({ src, interactive, preview }) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: interactive,
  })

  const safeSrc = preview ? injectCSPMetaTagIntoDataURI(src) : src

  return (
    <div className={classes}>
      <iframe
        title="hic et nunc HTML renderer"
        src={safeSrc}
        sandbox="allow-scripts"
        scrolling="no"
      />
    </div>
  )
}
