import React from 'react'
import { PATH } from '../../constants'
import { Container } from '../layout'
import { Button } from '../button'
import { ItemInfo } from '../item-info'
import { renderMediaType } from '../media-types'
import styles from './index.module.scss'

export const FeedItem = ({ token_info, token_id, swaps, total_amount }) => (
  <Container>
    <Button to={`${PATH.OBJKT}/${token_id}`}>
      <div className={styles.container}>{renderMediaType(token_info)}</div>
    </Button>
    <ItemInfo token_id={token_id} swaps={swaps} total_amount={total_amount} />
  </Container>
)
