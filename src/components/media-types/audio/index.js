import React, { useEffect, useState } from 'react'
import { PauseIcon, PlayIcon } from './icons'
import { Visualiser } from './visualiser'
import styles from './styles.module.scss'

export const AudioComponent = ({ src, token_info }) => {
  const [userTouched, setUserTouched] = useState(false)
  const [play, setPlay] = useState(false)

  const togglePlay = () => {
    console.log('toggle play')
    userTouched(true)
    setPlay(!play)
  }

  useEffect(() => {
    // const audio = new Audio()
    // audio.src = src
    // audio.controls = false
    // audio.loop = true
    // audio.autoplay = true
    // audio.crossOrigin = 'anonymous'
  }, [userTouched])

  return (
    <>
      <div className={styles.container}>
        {false && <img src="/test.png" alt="album cover" />}
        {true && <audio title={token_info.name} src={src} controls />}
        {false && <Visualiser />}
        {false && (
          <div className={styles.icons} onClick={togglePlay}>
            {play ? <PauseIcon /> : <PlayIcon />}
          </div>
        )}
      </div>
    </>
  )
}
