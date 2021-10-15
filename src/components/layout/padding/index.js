import React from 'react'
import classnames from 'classnames'
import styles from './styles.module.scss'

export const Padding = ({ children = null, noSpacing }) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.noSpacing]: noSpacing
  })

  return <div className={classes}>{children}</div>
}
