/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { PauseIcon, PlayIcon } from './icons'
import { Visualiser } from './visualiser'
import styles from './styles.module.scss'

export const AudioComponent = ({
  artifactUri,
  displayUri,
  previewUri,
  preview,
  displayView
}) => {
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

  /*   console.log(displayUri)
   */

  if (!displayView) {
    return (
      <div>
        <div>
          <img style={{ height: '50vh', display : 'block', margin: '0 auto' }} alt="" src={displayUri} /><br />
          <audio style={{ display: 'block', margin: '0 auto' }} src={preview ? previewUri : artifactUri} controls />
        </div>
        {/*         {true && <audio src={preview ? previewUri : artifactUri} controls />}
    <img src={displayUri} alt="album cover" /> */}
        {false && <Visualiser ref={visualiser} src={artifactUri} />}
        {false && (
          <div className={styles.icons} onClick={togglePlay}>
            {play ? <PauseIcon /> : <PlayIcon />}
          </div>
        )}
      </div>
    )
  } else {
    return (
      <>
        <div >
          <span>
            <img style={{ width: '100%' }} src={displayUri} alt="" /><br />
            <audio style={{ width: '100%' }} src={preview ? previewUri : artifactUri} controls />
          </span>
          {/*         {true && <audio src={preview ? previewUri : artifactUri} controls />}
        <img src={displayUri} alt="album cover" /> */}
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
}
