import classnames from 'classnames'
import styles from './index.module.scss'

export const HTMLComponent = ({ src, interactive, preview, token_info }) => {
  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: interactive,
  })

  return (
    <div className={classes}>
      Preview not available for HTML ZIP files.
      <br /><br/>
      Click 'mint' below to proceed.
    </div>
  )
}
