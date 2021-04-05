import React from 'react'
import { Helmet } from 'react-helmet'
import { VisuallyHidden } from '../../visually-hidden'
import styles from './index.module.scss'

export const Page = ({ title = 'hic et nunc', children = null }) => {
  return (
    <main className={styles.container}>
      <Helmet>
        {title !== '' ? (
          <title>hic et nunc - {title}</title>
        ) : (
          <title>hic et nunc</title>
        )}
      </Helmet>
      <VisuallyHidden as="h1">{title}</VisuallyHidden>
      {children}
    </main>
  )
}
