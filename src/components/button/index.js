import React from 'react'
import { Link } from 'react-router-dom'

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
  const style = {
    color: '#000',
    '&:hover': {
      color: '#f00',
    },
  }

  if (to) {
    return (
      <Link to={to} style={style}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {children}
      </a>
    )
  }
  return (
    <button onClick={onClick} style={style}>
      {children}
    </button>
  )
}
