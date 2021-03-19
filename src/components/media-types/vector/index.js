import React, { useContext } from 'react'
import classnames from 'classnames'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import styles from './index.module.scss'

export const VectorComponent = ({ src, interactive }) => {
  const context = useContext(HicetnuncContext)
  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: interactive,
  })

  console.log(context)
  let author = 'no-author-logged'
  let viewer = 'no-viewer-logged'

  return (
    <div className={classes}>
      <iframe
        title="hic et nunc SVG renderer"
        src={`${src}?author=${author}&viewer=${viewer}`}
        sandbox="allow-scripts"
        scrolling="no"
      />
    </div>
  )
}
