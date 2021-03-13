import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import { getItem, setItem } from '../../utils/storage'
import styles from './index.module.scss'

export const ButtonTheme = () => {
  const [light, setLight] = useState(true)

  useEffect(() => {
    const theme = getItem('theme') || setItem('theme', 'light')
    setLight(theme === 'light')
  }, [])

  useEffect(() => {
    setItem('theme', light ? 'light' : 'dark')
    let root = document.documentElement
    root.style.setProperty('--background-color', light ? '#ffffff' : '#111111')
    root.style.setProperty('--text-color', light ? '#000000' : '#dedede')
    root.style.setProperty(
      '--border-color',
      light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)'
    )
  })

  const classes = classnames({
    [styles.container]: true,
    // [styles.light]: light,
  })
  return <div className={classes} onClick={() => setLight(!light)} />
}
