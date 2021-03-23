import React from 'react'
import { getItem, setItem } from '../../utils/storage'
import styles from './index.module.scss'

const languages = [
  { key: 'en', title: 'english' },
  { key: 'de', title: 'german' },
  { key: 'fr', title: 'french' },
  { key: 'ja', title: 'japanese' },
  { key: 'pt', title: 'português' },
]

export const ButtonLanguage = () => {
  const language = getItem('language') || setItem('language', languages[0].key)

  const handleChange = (e) => {
    setItem('language', e.target.value)
    window.location.reload()
  }

  return (
    <select
      className={styles.container}
      value={language}
      onChange={handleChange}
    >
      {languages.map((lang) => {
        return (
          <option key={lang.key} value={lang.key}>
            {lang.title}
          </option>
        )
      })}
    </select>
  )
}
