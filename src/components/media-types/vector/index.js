import React, { useContext } from 'react'
import classnames from 'classnames'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import styles from './index.module.scss'

export const VectorComponent = ({ src, interactive, author }) => {
  const context = useContext(HicetnuncContext)
  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: interactive,
  })

  let _author_ = 'no-author-logged'
  let _viewer_ = 'no-viewer-logged'

  if (author) {
    _author_ = author
  }

  if (context.address !== '') {
    _viewer_ = context.address
  }
  console.log('SVG', _author_, _viewer_)

  return (
    <div className={classes}>
      <iframe
        title="hic et nunc SVG renderer"
        src={`${src}?author=${_author_}&viewer=${_viewer_}`}
        sandbox="allow-scripts"
        scrolling="no"
      />
    </div>
  )
}
