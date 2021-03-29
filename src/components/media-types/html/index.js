import React, { useContext, useState } from 'react'
import classnames from 'classnames'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Button } from '../../button'
import { VisuallyHidden } from '../../visually-hidden'
import styles from './index.module.scss'

export const HTMLComponent = ({
  src,
  interactive,
  preview,
  token_info,
  displayUri,
}) => {
  const context = useContext(HicetnuncContext)
  const [viewing, setViewing] = useState(interactive)

  let _creator_ = false
  let _viewer_ = false

  if (token_info && token_info.creators[0]) {
    _creator_ = token_info.creators[0]
  }

  if (context.address !== '') {
    _viewer_ = context.address
  }

  const coverMeta = '<meta property="og:image" content="path/to/image.jpg" />'

  if (preview) {
    return (
      <div>
        <div>
          Previews are not available for HTML ZIP files.
          <br />
          <br />
          <div style={{ color: 'red' }}>
            IMPORTANT:
            <br />
            <br />
            Your zip file must contain an index.html file.
            <br />
            <br />
            Please also include an image file and reference it in a meta tag
            like this:
            <br />
            {coverMeta}
            <br />
            <br />
            Links to external resources in your code will not work. Please
            include everything in your zip file.
          </div>
          <br />
          <br />
          Click 'mint' below to proceed.
        </div>
      </div>
    )
  }

  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: interactive,
  })

  if (!viewing) {
    return (
      <div className={classes}>
        <div className={styles.preview}>
          <img src={displayUri} alt="thumbnail" />
          <div className={styles.button}>
            <Button onClick={() => setViewing(true)}>
              <VisuallyHidden>View</VisuallyHidden>
              <div className={styles.dark} />
              <svg
                version="1.1"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <path d="M405.2,232.9L126.8,67.2c-3.4-2-6.9-3.2-10.9-3.2c-10.9,0-19.8,9-19.8,20H96v344h0.1c0,11,8.9,20,19.8,20  c4.1,0,7.5-1.4,11.2-3.4l278.1-165.5c6.6-5.5,10.8-13.8,10.8-23.1C416,246.7,411.8,238.5,405.2,232.9z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
