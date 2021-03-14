import React, { useState } from 'react'
import { ALLOWED_FILETYPES } from '../../constants'
import { getMimeType } from '../../utils/sanitise'
import styles from './index.module.scss'

const Buffer = require('buffer').Buffer

export const Upload = ({ label, onChange = () => null }) => {
  const [title, setTitle] = useState(label)

  const onFileChange = async (e) => {
    const { files } = e.target
    const file = files[0]

    setTitle(file.name)
    const mimeType = file.type !== '' ? file.type : await getMimeType(file)
    const buffer = Buffer.from(await file.arrayBuffer())

    onChange({ title, mimeType, file, buffer })
  }

  return (
    <div className={styles.container}>
      <label>
        {title}
        <input type="file" name="file" onChange={onFileChange} />
      </label>
      <div className={styles.allowed}>
        supports:&nbsp;{ALLOWED_FILETYPES.join(', ')}
      </div>
    </div>
  )
}
