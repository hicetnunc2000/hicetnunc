import React from 'react'
import { PATH } from '../../constants'
import { Padding } from '../layout'
import { Button } from '../button'
import { ItemInfo } from '../item-info'
import { renderMediaType } from '../media-types'
import { VisuallyHidden } from '../visually-hidden'
import styles from './styles.module.scss'

export const FeedItem = (props) => {
  return (
    <Padding>
      <Button to={`${PATH.OBJKT}/${props.id}`}>
        <VisuallyHidden>{`Go to OBJKT: ${props.title}`}</VisuallyHidden>
        <div className={styles.container}>
          {renderMediaType({
            mimeType: props.mime,
            artifactUri: props.artifact_uri,
            displayUri: props.display_uri,
            creator: props.creator_id,
            objkt: String(props.id),
            displayView: true
          })}
        </div>
      </Button>
      <div style={{paddingLeft : '20px'}}>
      <ItemInfo {...props} />
      </div>
    </Padding>
  )
}
