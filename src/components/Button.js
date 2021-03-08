import React from 'react'

const Button = function (props) {
  const { onClick, style: additionalStyle, label } = props
  const style = {
    color: '#000',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    ...additionalStyle,
  }

  return (
    <button style={style} onClick={onClick}>
      {label}
    </button>
  )
}

export default Button
