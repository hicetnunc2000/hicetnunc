import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import styles from './index.module.scss'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Loading } from '../loading'

/**
 * Button component renders a button based on the type of prop received
 *
 * example: <Button to="" /> -> renders a react-router-dom Link (for page changes)
 * example: <Button href="" /> -> renders a <a> tag (for external pages)
 * example: <Button onClick={} /> -> renders a button with a onClick callback.
 */
export const Button = ({
  to = null,
  href = null,
  onClick = () => null,
  children,
  disabled,
  fit,
}) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.disabled]: disabled,
    [styles.fit]: fit,
  })

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}

export const PrimaryButton = ({
  to = null,
  href = null,
  onClick = () => null,
  children = null,
  selected,
  fit
}) => {
  const classes = classnames({
    [styles.primary]: true,
    [styles.selected]: selected,
  })
  return <Button
    to={to}
    href={href}
    onClick={onClick}
    selected={selected}
    fit={fit}
    ><div className={classes}>{children}</div>
  </Button>
}

export const SecondaryButton = ({
  onClick = () => null,
  children = null,
  selected
}) => {
  const classes = classnames({
    [styles.secondary]: true,
    [styles.selected]: selected,
  })
  return <Button
    onClick={onClick}
    selected={selected}
    ><div className={classes}>{children}</div>
  </Button>
}

export const PurchaseButton = ({
  onClick = () => null,
  children = null,
  selected
}) => {
  const classes = classnames({
    [styles.purchase]: true,
    [styles.selected]: selected,
  })
  return <Button
    onClick={onClick}
    selected={selected}
    ><div className={classes}>{children}</div>
  </Button>
}

export const ActionButton = ({
  onClick = () => null,
  children,
  disabled,
  fit,
  selected
}) => {
  const classes = classnames({
    [styles.action]: true,
    [styles.selected]: selected,
  })
  return <Button
    onClick={onClick}
    disabled={disabled}
    fit={fit}
    selected={selected}
  ><div className={classes}>{children}</div></Button>
}

// export const Burn = ({ children = null, selected }) => {
//   const classes = classnames({
//     [styles.burn]: true,
//     [styles.selected]: selected,
//   })
//   return <div className={classes}>{children}</div>
// }

export const CurateButton = ({
  tokenId,
  selected
}) => {
  const [waiting, setWaiting] = useState(false)
  const context = useContext(HicetnuncContext)

  const tryCurate = async() => {
    setWaiting(true)
    context.curate(tokenId)
    .finally(() => {
      setWaiting(false)
    })
  }

  const classes = classnames({
    [styles.curate]: true,
    [styles.selected]: selected,
  })

  return (
    <Button onClick={tryCurate}>
      {
        waiting ? (
          <Loading />
        ) : (
          <div className={classes} title="Curate">〇</div>
        )
      }
    </Button>
  )
}