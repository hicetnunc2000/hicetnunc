import React from 'react'
import styles from './styles.module.scss'

export const VisuallyHidden = ({ children = null, as: Comp = 'span' }) => {
  return <Comp className={styles.container}>{children}</Comp>
}
