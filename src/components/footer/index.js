import React from 'react'
import { Padding } from '../layout'
import styles from './index.module.scss'

export const Footer = () => {
  return (
    <footer className={styles.container}>
      <Padding>
        sync -&gt; collect // sync -&gt; mint // sync -&gt; curate
      </Padding>
      <Padding>
        use it consciously. visit artists profiles. be careful with copy
        minters.
      </Padding>
    </footer>
  )
}
