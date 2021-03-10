import React from 'react'
import { Link } from 'react-router-dom'
import styles from './index.module.scss'

/**
 * Button component renders a button based on the type of prop received
 *
 * example: <Button to="" /> -> renders a react-router-dom Link (for page changes)
 * example: <Button href="" /> -> renders a <a> tag (for external pages)
 * example: <Button onClick={} /> -> renders a button with a onClick callback.
 */
export const Button = ({
  to = null,
  href = null,
  onClick = () => null,
  children,
}) => {
  if (to) {
    return (
      <Link to={to} className={styles.container}>
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
        className={styles.container}
      >
        {children}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={styles.container}>
      {children}
    </button>
  )
}

export const Primary = ({ children = null }) => (
  <div className={styles.primary}>{children}</div>
)

export const Secondary = ({ children = null }) => (
  <div className={styles.secondary}>{children}</div>
)
