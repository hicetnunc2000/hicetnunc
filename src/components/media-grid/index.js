import React from 'react'
import { Container, Padding } from '../layout'
import { Button } from '../button'
import { VisuallyHidden } from '../visually-hidden'
import { renderMediaType } from '../media-types'
import { MimeTypeIcon } from '../mimetype-icon'
import { PATH } from '../../constants'
import styles from './styles.module.scss'

export const MediaGrid = ({ items }) => {
  return (
    <Container large>
      <Padding>
        <div className={styles.list}>
          {items.map((item, index) => {
            const { token_info, token_id } = item
            const { mimeType, uri } = token_info.formats[0]

            return (
              <Button to={`${PATH.OBJKT}/${token_id}`} key={token_id}>
                <VisuallyHidden>{`Go to OBJKT: ${token_info.name}`}</VisuallyHidden>
                <div className={styles.item}>
                  {renderMediaType({
                    mimeType,
                    uri: uri.split('//')[1],
                    metadata: item,
                  })}
                  <div className={styles.rollover}>
                    <MimeTypeIcon mimeType={mimeType} />
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </Padding>
    </Container>
  )
}
