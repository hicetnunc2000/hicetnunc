import React from 'react'
import styles from './index.module.scss'

export const Input = ({
  type = 'text',
  placeholder = 'placeholder',
  name = 'input-name-not-set',
  min,
  max,
  maxlength = 500,
  label,
  onChange = () => null,
  disabled,
  value,
}) => (
  <div className={styles.container}>
    <label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        min={min}
        max={max}
        maxLength={maxlength}
        defaultValue={value}
        onChange={onChange}
        disabled={disabled}
      />
      <p>{label}</p>
    </label>
  </div>
)
