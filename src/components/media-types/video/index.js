import React, { useEffect, useRef } from 'react'
import styles from './index.module.scss'

export const VideoComponent = ({ src, interactive, inView }) => {
  const domElement = useRef()

  useEffect(() => {
    if (inView) {
      domElement.current.play()
    } else {
      domElement.current.pause()
    }
  }, [inView])

  return (
    <div className={styles.container}>
      <video
        ref={domElement}
        className={styles.video}
        autoPlay={interactive}
        muted
        loop
        controls={interactive}
        src={src}
      />
    </div>
  )
}
