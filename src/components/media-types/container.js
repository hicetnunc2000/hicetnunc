/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef } from 'react'
import screenfull from 'screenfull'
import { useInView } from 'react-intersection-observer'
import classnames from 'classnames'
import { iOS } from '../../utils/os'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import styles from './styles.module.scss'

/**
 * Currently fullscreen is disabled on iOS
 * this is mainly because Safari iOS doesn't support fullscreen api.
 */

/**
 * This component handles fullscreen mode
 * and inView prop for lazy loading
 */
export const Container = ({
  children = null,
  interactive,
  nofullscreen = false,
}) => {
  const context = useContext(HicetnuncContext)
  const domElement = useRef()

  const { ref, inView } = useInView({
    threshold: 0,
  })

  const toggleFullScreen = () => {
    if (!screenfull.isFullscreen) {
      screenfull.request(domElement.current, { navigationUI: 'hide' })
    } else {
      screenfull.exit()
    }
  }

  const fullscreenChange = (e) => {
    if (iOS) {
      return
    }

    if (screenfull.isFullscreen) {
      context.setFullscreen(true)
    } else {
      context.setFullscreen(false)
    }
    // simulates resize to fix GLB player
    window.dispatchEvent(new Event('resize'))
  }

  useEffect(() => {
    if (nofullscreen || !iOS) {
      document.addEventListener('fullscreenchange', fullscreenChange)
      document.addEventListener(
        'webkitfullscreenchange',
        fullscreenChange,
        false
      )
    }

    return () => {
      if (nofullscreen || !iOS) {
        document.removeEventListener('fullscreenchange', fullscreenChange)
        document.removeEventListener(
          'webkitfullscreenchange',
          fullscreenChange,
          false
        )
      }
    }
  }, [])

  const classes = classnames({
    [styles.container]: true,
    [styles.fullscreen]: context.fullscreen,
  })

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { inView, interactive })
    }
    return child
  })

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
      }}
    >
      <div ref={domElement} className={classes}>
        {interactive && !iOS && !nofullscreen && (
          <div onClick={toggleFullScreen} className={styles.icon}>
            
          </div>
        )}
        {childrenWithProps}
      </div>
    </div>
  )
}
