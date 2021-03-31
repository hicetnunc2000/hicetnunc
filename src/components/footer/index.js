import React from 'react'
import { Padding } from '../layout'
import { ButtonLanguage } from '../button-language'
import { ButtonTheme } from '../button-theme'
import { getLanguage } from '../../constants'
import styles from './index.module.scss'

export const Footer = () => {
  const language = getLanguage()

  return (
    <footer className={styles.container}>
      <Padding>
        <div className={styles.copy}>{language.footer.mint}</div>
        <div className={styles.buttons}>
          <ButtonLanguage />
          <ButtonTheme />
        </div>
      </Padding>

      {false && (
        <Padding>
          <div className={styles.warning}>{language.footer.warning}</div>
        </Padding>
      )}
    </footer>
  )
}
