import React from 'react'
import { ALLOWED_FILETYPES } from '../../constants'
import styles from './index.module.scss'

export const Upload = ({ label }) => {
  const onFileChange = (e) => {
    console.log('file change', e)
  }
  return (
    <div className={styles.container}>
      <label>
        {label}
        <input type="file" name="file" onChange={onFileChange} />
      </label>
      <div className={styles.allowed}>
        currently supported formats: {ALLOWED_FILETYPES.join(', ')}
      </div>
    </div>
  )
}
