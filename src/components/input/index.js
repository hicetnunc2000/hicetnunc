import React from 'react'
import styles from './index.module.scss'

export const Input = ({
  type = 'text',
  placeholder = '',
  name = 'input-name-not-set',
  min,
  max,
  maxlength = 500,
  onChange = () => null,
  disabled,
  label,
  helpText,
  value
}) => {
  return (
    <div className={styles.container}>
      <label>{label}
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          min={min}
          max={max}
          maxLength={maxlength}
          onChange={onChange}
          disabled={disabled}
          value={value}
        ></input>
        <div className={styles.helpText}>{helpText}</div>
      </label>
    </div>
  )
}
