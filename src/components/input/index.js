import React from 'react'
import styles from './index.module.scss'

export const Input = ({
  type = 'text',
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  min,
  max,
  maxlength = 500,
  onChange = () => null,
  disabled,
  value,
}) => (
  <input
    type={type}
    placeholder={placeholder}
    name={name}
    min={min}
    max={max}
    maxLength={maxlength}
    defaultValue={value}
    onChange={onChange}
    className={styles.container}
    disabled={disabled}
  />
)
