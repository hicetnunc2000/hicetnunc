import React, { useContext } from 'react'
import classnames from 'classnames'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import styles from './index.module.scss'

export const HTMLComponent = ({ src, interactive, preview, token_info }) => {
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

  console.log('creator', _creator_)
  console.log('viewer', _viewer_)

  if (preview) {
    return (
      <div>
        <div>
          Previews are not available for HTML ZIP files.
          <br /><br />
          <div style={{color: 'red'}}>
            IMPORTANT:
            <br/><br/>
            Your zip file must contain an index.html file.
            <br/><br/>
            Links to external resources in your code will not work. Please include everything in your zip file.
          </div>
          <br /><br />
          Click 'mint' below to proceed.
        </div>
      </div>
    )
  } else {
    return (
      <div className={classes}>
        <iframe
          title="hic et nunc HTML renderer"
          src={`${src}?creator=${_creator_}&viewer=${_viewer_}`}
          sandbox="allow-scripts"
          scrolling="no"
        />
      </div>
    )
  }
}
