import React, { useContext } from 'react'
import classnames from 'classnames'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import styles from './styles.module.scss'

export const VectorComponent = ({
  artifactUri,
  displayUri,
  previewUri,
  creator,
  objkt,
  onDetailView,
  preview,
}) => {
  const context = useContext(HicetnuncContext)
  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: onDetailView,
  })

  let _creator_ = false
  let _viewer_ = false
  let _objkt_ = false

  if (creator) {
    _creator_ = creator
  }

  if (context.address && context.address.address) {
    _viewer_ = context.address.address
  }

  if (objkt) {
    _objkt_ = objkt
  }

  let path
  if (preview) {
    // can't pass creator/viewer query params to data URI
    path = previewUri
  } else {
    path = `${artifactUri}?creator=${_creator_}&viewer=${_viewer_}&objkt=${_objkt_}`
  }

  return (
    <div className={classes}>
      <iframe
        title="hic et nunc SVG renderer"
        src={path}
        sandbox="allow-scripts"
        scrolling="no"
      />
    </div>
  )
}
// svg version:     src={`${src}?author=${_creator_}&viewer=${_viewer_}`}
// iframe version:  src={`https://hicetnunc2000.github.io/hicetnunc/gh-pages/sandbox-svg.html?src=${src}&creator=${_creator_}&viewer=${_viewer_}`}
