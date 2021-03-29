import React, { useEffect, useRef } from 'react'
import styles from './index.module.scss'

export const VideoComponent = (props) => {

  const domElement = useRef();

  useEffect(() => {

    var rect = domElement.current.getBoundingClientRect();
    var isVisibleH = rect.left < window.innerWidth && rect.right > 0;
    var isVisibleV = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisibleH && isVisibleV) {
      if (domElement.current.paused) {
        domElement.current.play();
      }
    } else {
      if (!domElement.current.paused) {
        domElement.current.pause();
      }
    }

  }, [props.scroll]);

  return (
    <div className={styles.container}>
      <video ref={domElement} className={styles.video} preload="true" muted controls loop src={props.src} />
    </div>
  )
}
