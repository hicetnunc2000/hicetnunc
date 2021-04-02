/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import classnames from 'classnames'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import styles from './styles.module.scss'

/**
 * Currently fullscreen is disabled on iOS
 * this is mainly because Safari iOS doesn't support fullscreen api.
 */
const iOS = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)

/**
 * This component handles fullscreen mode
 * and inView prop for lazy loading
 */
export const Container = ({
  children = null,
  interactive,
  nofullscreen = false,
}) => {
  const [over, setOver] = useState(false)
  const context = useContext(HicetnuncContext)
  const domElement = useRef()

  const { ref, inView } = useInView({
    threshold: 0,
  })

  const toggleFullScreen = () => {
    const docEl = document.documentElement
    const fullEl = document.fullcreenElement
      || document.mozFullScreenElement
      || document.webkitCurrentFullScreenElement

    if (!fullEl) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen()
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen()
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }

  const fullscreenChange = (e) => {
    if (iOS) {
      return
    }
    const fullEl = document.fullcreenElement
      || document.mozFullScreenElement
      || document.webkitCurrentFullScreenElement
    if (fullEl) {
      context.setFullscreen(true)
    } else {
      context.setFullscreen(false)
    }
  }

  useEffect(() => {
    if (nofullscreen || !iOS) {
      document.addEventListener('fullscreenchange', fullscreenChange)
      document.addEventListener('webkitfullscreenchange', fullscreenChange, false)
    }

    return () => {
      if (nofullscreen || !iOS) {
        document.removeEventListener('fullscreenchange', fullscreenChange)
        document.removeEventListener('webkitfullscreenchange', fullscreenChange, false)
      }
    }
  }, [])

  const classes = classnames({
    [styles.container]: true,
    [styles.hover]: over,
    [styles.fullscreen]: context.fullscreen,
  })

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { inView, interactive })
    }
    return child
  })

  return (
    <div ref={ref}>
      <div
        ref={domElement}
        className={classes}
        onMouseOver={() => setOver(true)}
        onMouseOut={() => setOver(false)}
      >
        {interactive && !iOS && !nofullscreen && (
          <div onClick={toggleFullScreen} className={styles.icon}>
            {context.fullscreen ? (
              <svg viewBox="0 0 14 14">
                <g
                  fill="none"
                  fillRule="evenodd"
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                >
                  <g
                    fill="#000000"
                    transform="translate(-257.000000, -257.000000)"
                  >
                    <g transform="translate(257.000000, 257.000000)">
                      <path d="M0,11 L3,11 L3,14 L5,14 L5,9 L0,9 L0,11 L0,11 Z M3,3 L0,3 L0,5 L5,5 L5,0 L3,0 L3,3 L3,3 Z M9,14 L11,14 L11,11 L14,11 L14,9 L9,9 L9,14 L9,14 Z M11,3 L11,0 L9,0 L9,5 L14,5 L14,3 L11,3 L11,3 Z" />
                    </g>
                  </g>
                </g>
              </svg>
            ) : (
              <svg viewBox="0 0 14 14">
                <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                  <g
                    fill="#000000"
                    transform="translate(-215.000000, -257.000000)"
                  >
                    <g transform="translate(215.000000, 257.000000)">
                      <path d="M2,9 L0,9 L0,14 L5,14 L5,12 L2,12 L2,9 L2,9 Z M0,5 L2,5 L2,2 L5,2 L5,0 L0,0 L0,5 L0,5 Z M12,12 L9,12 L9,14 L14,14 L14,9 L12,9 L12,12 L12,12 Z M9,0 L9,2 L12,2 L12,5 L14,5 L14,0 L9,0 L9,0 Z" />
                    </g>
                  </g>
                </g>
              </svg>
            )}
          </div>
        )}
        {childrenWithProps}
      </div>
    </div>
  )
}
