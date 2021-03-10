import React from 'react'
import classnames from 'classnames'
import styles from './index.module.scss'

export const Container = ({ children = null, large }) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.large]: large,
  })
  return <div className={classes}>{children}</div>
}
