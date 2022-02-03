import React, { useContext } from 'react'
import classnames from 'classnames'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import styles from './styles.module.scss'
import './index.css'

export const VectorComponent = ({
  artifactUri,
  previewUri,
  creator,
  objkt,
  onDetailView,
  preview,
  displayView
}) => {
  const context = useContext(HicetnuncContext)
  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: onDetailView,
  })


  let _creator_ = false
  let _viewer_ = false
  let _objkt_ = false

  if (creator && creator.address) {
    _creator_ = creator.address
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

  if (displayView) {
    return (
      <div className={classes}>
        <iframe
          title="teia SVG renderer"
          src={path}
          sandbox="allow-scripts"
          scrolling="no"
        />
      </div>
    )
  } else {
    return (
      <div className={styles.container + ' vector-container'}>
        <iframe
          className={styles.vector + ' vector'}
          title="teia SVG renderer"
          src={path}
          sandbox="allow-scripts"
          scrolling="no"
          onLoad={'javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));'} // eslint-disable-line no-script-url
        />
      </div>
    )
  }
}
// svg version:     src={`${src}?author=${_creator_}&viewer=${_viewer_}`}
// iframe version:  src={`https://hicetnunc2000.github.io/hicetnunc/gh-pages/sandbox-svg.html?src=${src}&creator=${_creator_}&viewer=${_viewer_}`}
