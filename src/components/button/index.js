import React, { useContext, Component } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import styles from './index.module.scss'
import { HicetnuncContext } from '../../context/HicetnuncContext'

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

export const Primary = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.primary]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Secondary = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.secondary]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export const Purchase = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.purchase]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}

export class Curate extends Component {
  static contextType = HicetnuncContext

  constructor(props) {
    super(props)

    this.state = {
      tokenId: props.tokenId,
      waiting: false,
      setWaiting: (waiting) => {
        this.setState({ waiting: waiting })
      }
    }
  }

  async tryCurate(state) {
    state.setWaiting(true)
    const context = this.context
    context.curate(state.tokenId)
    .finally(() => {
      state.setWaiting(false)
    })
  }

  render() {
    const classes = classnames({
      [styles.curate]: true,
    })
    const classesActive = classnames({
      [styles.curateActive]: true,
    })
    return (
      <Button className={classes} onClick={() => this.tryCurate(this.state)}>
        <Primary>
          <div style={{position: 'relative'}}>
            <div className={classesActive} style={{display: this.state.waiting ? 'block' : 'none'}}>〇</div>
          〇</div>
        </Primary>
      </Button>
    )
    }
}

export const Burn = ({ children = null, selected }) => {
  const classes = classnames({
    [styles.burn]: true,
    [styles.selected]: selected,
  })
  return <div className={classes}>{children}</div>
}


<div class="button_primary__2VQbN" style="
    position: relative;
">

<div id="a" style="

">〇</div>
</div>