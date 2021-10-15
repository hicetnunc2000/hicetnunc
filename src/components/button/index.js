import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import styles from './styles.module.scss'

export const Button = ({
  to = null,
  href = null,
  onClick = () => null,
  children,
  disabled,
  fit,
}) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.disabled]: disabled,
    [styles.fit]: fit,
  })

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}

export const Primary = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.primary]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Secondary = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.secondary]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Pill = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.pill]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Purchase = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.purchase]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Curate = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.curate]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}
