import React from 'react'
import { PATH } from '../../constants'
import { Padding } from '../layout'
import { Button } from '../button'
import { ItemInfo } from '../item-info'
import { renderMediaType } from '../media-types'
import { VisuallyHidden } from '../visually-hidden'
import styles from './styles.module.scss'

export const FeedItem = (props) => {
  const { id, title } = props

  return (
    <div style={{ border: '1px dashed black' }}>
      <Padding>
        <Button to={`${PATH.OBJKT}/${id}`}>
          <VisuallyHidden>{`Go to OBJKT: ${title}`}</VisuallyHidden>
          <div className={styles.container}>{renderMediaType(props)}</div>
        </Button>
        <ItemInfo {...props} />
      </Padding>
    </div>
  )
}
