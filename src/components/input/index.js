import React from 'react'
import styles from './index.module.scss'

export const Input = ({
  type = 'text',
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  min,
  max,
  onChange = () => null,
  disabled,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      min={min}
      max={max}
      onChange={onChange}
      className={styles.container}
      disabled={disabled}
    ></input>
  )
}
