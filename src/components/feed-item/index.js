import React from 'react'
import { PATH } from '../../constants'
import { Button } from '../button'
import { renderMediaType } from '../media-types'
import styles from './index.module.scss'

export const FeedItem = ({ token_info, token_id }) => {
  // renderMediaType
  return (
    <Button to={`${PATH.OBJKT}/${token_id}`}>
      <div className={styles.container}>{renderMediaType(token_info)}</div>
    </Button>
  )
}

// {
//   "contract": "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton",
//   "network": "mainnet",
//   "level": 1378902,
//   "token_id": 3602,
//   "symbol": "OBJKT",
//   "name": "Proof of Build #3",
//   "decimals": 0,
//   "token_info": {
//       "artifactUri": "ipfs://QmSpScqHjWaLNpn5g6ygWueMm16vemx574srFBrt4NoWiR",
//       "creators": [
//           "tz1djRgXXWWJiY1rpMECCxr5d9ZBqWewuiU1"
//       ],
//       "description": "Galleon wallet version 1.1.13b release process – slide 4.",
//       "formats": [
//           {
//               "mimeType": "image/png",
//               "uri": "ipfs://QmSpScqHjWaLNpn5g6ygWueMm16vemx574srFBrt4NoWiR"
//           }
//       ],
//       "isBooleanAmount": false,
//       "shouldPreferSymbol": false,
//       "tags": [
//           ""
//       ],
//       "thumbnailUri": "ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc"
//   },
//   "supply": 0,
//   "transfered": 0,
//   "swaps": [],
//   "total_amount": 7,
//   "owners": {
//       "tz1djRgXXWWJiY1rpMECCxr5d9ZBqWewuiU1": "7"
//   }
// }
