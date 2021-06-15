/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import { PauseIcon, PlayIcon } from './icons'
import { Visualiser } from './visualiser'
import styles from './styles.module.scss'

export const AudioComponent = ({ artifactUri, displayUri }) => {
  const visualiser = useRef()
  const [userTouched, setUserTouched] = useState(false)
  const [play, setPlay] = useState(false)

  const togglePlay = () => {
    setUserTouched(true)
    setPlay(!play)
  }

  // user interaction
  useEffect(() => {
    if (userTouched) {
      visualiser.current.init()
    }
  }, [userTouched])

  useEffect(() => {
    if (userTouched) {
      if (play) {
        visualiser.current.play()
      } else {
        visualiser.current.pause()
      }
    }
  }, [play])

  const classes = classnames({
    [styles.container]: true,
    [styles.userTouch]: userTouched,
  })

  console.log(displayUri)
  return (
    <>
      <div className={classes}>
        {true && <audio src={artifactUri} controls />}
        {false && <img src={displayUri} alt="album cover" />}
        {false && <Visualiser ref={visualiser} src={artifactUri} />}
        {false && (
          <div className={styles.icons} onClick={togglePlay}>
            {play ? <PauseIcon /> : <PlayIcon />}
          </div>
        )}
      </div>
    </>
  )
}
