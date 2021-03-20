import React from 'react'
import { Padding } from '../layout'
import { ButtonLanguage } from '../button-language'
import { ButtonTheme } from '../button-theme'
import styles from './index.module.scss'

export const Footer = () => {
  return (
    <footer className={styles.container}>
      <Padding>
        <div className={styles.copy}>
          sync -&gt; collect // sync -&gt; mint // sync -&gt; swap
        </div>
        <div className={styles.buttons}>
          <ButtonLanguage />
          <ButtonTheme />
        </div>
      </Padding>

      {false && (
        <Padding>
          <div className={styles.warning}>
            use it consciously. visit artists profiles. be careful with copy
            minters.
          </div>
        </Padding>
      )}
    </footer>
  )
}
