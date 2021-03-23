import React, { useContext } from 'react'
import classnames from 'classnames'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import styles from './index.module.scss'

export const VectorComponent = ({ src, interactive, token_info }) => {
  const context = useContext(HicetnuncContext)
  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: interactive,
  })

  let _creator_ = false
  let _viewer_ = false

  if (token_info && token_info.creators[0]) {
    _creator_ = token_info.creators[0]
  }

  if (context.address !== '') {
    _viewer_ = context.address
  }

  return (
    <div className={classes}>
      <iframe
        title="hic et nunc SVG renderer"
        src={`${src}?author=${_creator_}&viewer=${_viewer_}`}
        sandbox="allow-scripts"
        scrolling="no"
      />
    </div>
  )
}
// svg version: src={`${src}?author=${_creator_}&viewer=${_viewer_}`}
// iframe version:         src={`https://hicetnunc2000.github.io/hicetnunc/gh-pages/sandbox-svg.html?src=${src}&creator=${_creator_}&viewer=${_viewer_}`}
