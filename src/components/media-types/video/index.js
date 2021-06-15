import React, { useEffect, useRef } from 'react'
import { iOS } from '../../../utils/os'
import styles from './styles.module.scss'

export const VideoComponent = ({ src, interactive, inView }) => {
  const domElement = useRef()

  useEffect(() => {
    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    // let promise
    // if (inView) {
    //   promise = domElement.current.play()
    // } else {
    //   if (promise !== undefined) {
    //     promise
    //       .then(() => {
    //         // Automatic playback started!
    //         // Show playing UI.
    //         // We can now safely pause video...
    //         domElement.current.pause()
    //       })
    //       .catch((error) => {
    //         // Auto-play was prevented
    //         // Show paused UI.
    //       })
    //   }
    // }

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
        src={src}
        loading="lazy"
      />
    </div>
  )
}
