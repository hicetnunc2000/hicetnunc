import React from 'react'
import { Helmet } from 'react-helmet'
import classnames from 'classnames'
import { VisuallyHidden } from '../../visually-hidden'
import styles from './styles.module.scss'

export const Page = ({ title = '', children = null, large }) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.large]: large,
  })

  const displayTitle = (title == '') ? 'hic et nunc' : title + ' - hic et nunc';

  return (
    <main className={classes}>
      <Helmet>
        <title>{displayTitle}</title>
      </Helmet>
      <VisuallyHidden as="h1">{title || 'hic et nunc'}</VisuallyHidden>
      {children}
    </main>
  )
}
