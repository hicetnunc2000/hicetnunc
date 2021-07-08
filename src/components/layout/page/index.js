import React from 'react'
import { Helmet } from 'react-helmet'
import classnames from 'classnames'
import { VisuallyHidden } from '../../visually-hidden'
import styles from './styles.module.scss'

export const Page = ({ title = '', children = null, shareImage = null, large }) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.large]: large,
  })

  const displayTitle = (title !== '') ? ( title + ' - hic et nunc' ) : 'hic et nunc';

  return (
    <main className={classes}>
      <Helmet>
        <title>{displayTitle}</title>
        <meta name="og:title" content={displayTitle} />
        <meta name="og:title" content={displayTitle} />
        <meta name="twitter:title" content={displayTitle} />

        {shareImage && (<meta name="twitter:image" content={shareImage} />)}
        {shareImage && (<meta name="og:image" content={shareImage} />)}

      </Helmet>
      <VisuallyHidden as="h1">{title}</VisuallyHidden>
      {children}
    </main>
  )
}
