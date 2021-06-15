import React, { useContext } from 'react'
import classnames from 'classnames'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import styles from './styles.module.scss'

export const VectorComponent = ({ src, interactive, preview, token_info }) => {
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

  if (context.address && context.address.address) {
    _viewer_ = context.address.address
  }

  let iframeSrc
  if (preview) {
    // can't pass creator/viewer query params to data URI
    iframeSrc = src
  } else {
    iframeSrc = `${src}?creator=${_creator_}&viewer=${_viewer_}`
  }

  return (
    <div className={classes}>
      <iframe
        title="hic et nunc SVG renderer"
        src={iframeSrc}
        sandbox="allow-scripts"
        scrolling="no" 
        loading="lazy"
      />
    </div>
  )
}
// svg version:     src={`${src}?author=${_creator_}&viewer=${_viewer_}`}
// iframe version:  src={`https://hicetnunc2000.github.io/hicetnunc/gh-pages/sandbox-svg.html?src=${src}&creator=${_creator_}&viewer=${_viewer_}`}
