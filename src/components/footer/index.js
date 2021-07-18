import React from 'react'
import { ButtonLanguage } from '../button-language'
import { ButtonTheme } from '../button-theme'
import { getLanguage } from '../../constants'
import styles from './styles.module.scss'

export const Footer = () => {
  const language = getLanguage()

  return (
    <footer className={styles.container}>
      <div>
        <div className={styles.copy}>{language.footer.mint}</div>
      </div>

      {false && (
        <div>
          <div className={styles.warning}>{language.footer.warning}</div>
        </div>
      )}
    </footer>
  )
}
