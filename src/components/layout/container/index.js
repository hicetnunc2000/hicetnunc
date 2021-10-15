import React from 'react'
import classnames from 'classnames'
import styles from './styles.module.scss'

export const Container = ({ children = null, large, xlarge, fixed }) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.large]: large,
    [styles.xlarge]: xlarge,
    [styles.fixed]: fixed
  })
  return <div className={classes}>{children}</div>
}
