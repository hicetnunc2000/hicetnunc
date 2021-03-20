import React from 'react'
import styles from './index.module.scss'

export const Input = ({
  type = 'text',
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  min,
  max,
  maxlength = 30000,
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
      maxLength={maxlength}
      onChange={onChange}
      className={styles.container}
      disabled={disabled}
    ></input>
  )
}
