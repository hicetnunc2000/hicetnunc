import React, { useEffect, useRef } from 'react'
import { iOS } from '../../../utils/os'
import styles from './styles.module.scss'

export const VideoComponent = ({
  artifactUri,
  displayUri,
  previewUri,
  preview,
  interactive,
  inView,
  displayView
}) => {
  const domElement = useRef()

  useEffect(() => {
    const isVideoAvailable = (video) => iOS || video.readyState > 2

    const isVideoPlaying = (video) =>
      !!(
        video.currentTime > 0 &&
        !video.paused &&
        !video.ended &&
        video.readyState > 2
      )

    if (inView) {
      // play
      if (isVideoAvailable(domElement.current)) {
        try {
          domElement.current.play()
        } catch (err) {
          console.error(err)
        }
      }
    } else {
      // pause
      if (
        isVideoAvailable(domElement.current) &&
        isVideoPlaying(domElement.current)
      ) {
        try {
          domElement.current.pause()
        } catch (err) {
          console.error(err)
        }
      }
    }
  }, [inView])

  if (displayView) {
    return (
      <div className={styles.container}>
        <video
          ref={domElement}
          className={styles.video}
          autoPlay={inView}
          playsInline
          muted
          loop
          controls={interactive}
          src={preview ? previewUri : artifactUri}
          poster={displayUri}
        />
      </div>
    )
  } else {
    return (
      <>
        <video
          ref={domElement}
          className={styles.video}
          autoPlay={inView}
          playsInline
          muted
          loop
          controls={interactive}
          src={preview ? previewUri : artifactUri}
          poster={displayUri}
        />
      </>
    )
  }
}
