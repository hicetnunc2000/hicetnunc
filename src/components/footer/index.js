import React from 'react'
import { Padding } from '../layout'
import { ButtonTheme } from '../button-theme'
import { AnimationSwap } from '../animation-swap'
import styles from './index.module.scss'

export const Footer = () => {
  return (
    <footer className={styles.container} style={{ position : 'fixed' }}>
      {false && (
        <Padding>
          <AnimationSwap label="collect" />
        </Padding>
      )}
      {true && (
        <Padding>
          sync -&gt; collect // sync -&gt; mint // sync -&gt; swap
        </Padding>
      )}
      <Padding>
        use it consciously. visit artists profiles. be careful with copy
        minters.
      </Padding>
      <ButtonTheme />
    </footer>
  )
}
