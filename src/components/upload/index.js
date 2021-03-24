import React, { useState } from 'react'
import { ALLOWED_FILETYPES_LABEL, getLanguage } from '../../constants'
import { getMimeType } from '../../utils/sanitise'
import styles from './index.module.scss'

const Buffer = require('buffer').Buffer

export const Upload = ({ label, onChange = () => null }) => {
  const language = getLanguage()
  const [title, setTitle] = useState(label)

  const onFileChange = async (e) => {
    const { files } = e.target
    const file = files[0]

    setTitle(file.name)
    const mimeType = file.type !== '' ? file.type : await getMimeType(file)
    const buffer = Buffer.from(await file.arrayBuffer())

    // set reader for preview
    const reader = new FileReader()
    reader.addEventListener('load', (e) => {
      onChange({ title, mimeType, file, buffer, reader: e.target.result })
    })
    reader.readAsDataURL(file)
  }

  return (
    <div className={styles.container}>
      <label>
        {title}
        <input type="file" name="file" onChange={onFileChange} />
      </label>
      <div className={styles.allowed}>
        {language.mint.supports}:&nbsp;{ALLOWED_FILETYPES_LABEL}
      </div>
    </div>
  )
}
