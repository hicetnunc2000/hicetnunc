import React from 'react'
import { Helmet } from 'react-helmet'
import classnames from 'classnames'
import { VisuallyHidden } from '../../visually-hidden'
import styles from './styles.module.scss'
import { BottomBanner } from '../../bottom-banner'


export const Page = ({ title = 'hic et nunc', children = null, large }) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.large]: large,
  })
  return (
    <main className={classes}>
      <Helmet>
        {title !== '' ? (
          <title>{title} - hic et nunc</title>
        ) : (
          <title>hic et nunc</title>
        )}
      </Helmet>
      <VisuallyHidden as="h1">{title}</VisuallyHidden>
      {children}
      <BottomBanner></BottomBanner>
    </main>
  )
}
