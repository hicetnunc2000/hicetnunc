import React from 'react'
import classnames from 'classnames'
import styles from './styles.module.scss'

export const Container = ({ children = null, large, xlarge }) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.large]: large,
    [styles.xlarge]: xlarge,
  })
  return <div className={classes}>{children}</div>
}
