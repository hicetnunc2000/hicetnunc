import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.scss'

export const GLBComponent = ({ artifactUri, displayUri, onDetailView }) => {
  const ref = useRef()
  const [width, setWidth] = useState('100px')
  const [height, setHeight] = useState('100px')

  const props = {
    className: styles.glb,
    src: artifactUri,
    autoplay: true,
    'auto-rotate': true,
    'data-js-focus-visible': true,
    'interaction-prompt': 'none',
  }

  if (onDetailView) {
    props['ar'] = true
    props['ar-modes'] = 'webxr scene-viewer quick-look'
    props['camera-controls'] = true
  }

  const handleResize = () => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect()
      setWidth(width)
      setHeight(height)
    }
  }

  useEffect(() => {
    handleResize()
    global.addEventListener('resize', handleResize)

    return () => {
      global.removeEventListener('resize', handleResize)
    }
  }, [width, height])

  return (
    <div className={styles.container} ref={ref}>
      <model-viewer {...props} style={{ width, height }}>
        <button slot="ar-button" className={styles.arButton}>
          AR
        </button>
      </model-viewer>
    </div>
  )
}
