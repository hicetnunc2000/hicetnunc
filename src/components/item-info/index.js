import React, { useContext } from 'react'
import { PATH } from '../../constants'
import { Button, Primary, Purchase } from '../button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'

const _ = require('lodash')

export const ItemInfo = ({
  token_id,
  token_info,
  owners,
  swaps,
  // transfered,
  feed,
  // total_amount,
  hDAO_balance,
  isDetailView,
}) => {
  const { syncTaquito, collect, curate, claim_hDAO, acc } =
    useContext(HicetnuncContext)
  const reducer = (accumulator, currentValue) =>
    parseInt(accumulator) + parseInt(currentValue)

  // subtract burned pieces from total
  let total = 0

  try {
    total =
      _.values(owners).length !== 0 ? _.values(owners).reduce(reducer) : 'X'
    total = _.keys(owners).includes('tz1burnburnburnburnburnburnburjAYjjX')
      ? total - owners['tz1burnburnburnburnburnburnburjAYjjX']
      : total
  } catch (e) {
    total =
      _.values(owners).length !== 0 ? _.values(owners).reduce(reducer) : 'X'
  }

  let ed =
    swaps.length !== 0 ? swaps.map((e) => e.objkt_amount).reduce(reducer) : 'X'
  let s = _.minBy(swaps, (o) => Number(o.xtz_per_objkt))
  let maxPrice = _.maxBy(swaps, (o) => Number(o.xtz_per_objkt))

  var message = ''

  try {
    message =
      swaps[0] !== undefined
        ? 'collect for ' + Number(s.xtz_per_objkt) / 1000000 + ' tez'
        : 'not for sale'
  } catch (e) {
    message = 'not for sale'
  }

  const handleCollect = () => {
    if (acc == null) {
      syncTaquito()
    } else {
      collect(1, s.swap_id, s.xtz_per_objkt * 1)
    }
  }

  const copySharingURL = (token_id) => {
    navigator.clipboard.writeText('http://objkt.link/' + token_id);
  }

  const curateOrClaim = (id, balance = 0) => {
    // if user is creator and there's hDAO balance
    if (acc && acc.address === token_info.creators[0] && balance > 0) {
      claim_hDAO(balance, id)
    } else {
      curate(id)
    }
  }

  const renderHDAObutton = (id, balance) => {
    return (
      <Button onClick={() => curateOrClaim(id, balance)}>
        <Primary>
          <span
            className={styles.top}
            data-position={'top'}
            data-tooltip={
              acc && acc.address === token_info.creators[0] &&
              parseInt(hDAO_balance) > 0
                ? 'collect hDAO'
                : 'curate'
            }
          >
            〇
          </span>
          {balance && balance !== -1
            ? ` ${parseInt(hDAO_balance) / 1000000}`
            : ''}
        </Primary>
      </Button>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.edition}>
          <div className={styles.inline}>
            <p>Issuer:&nbsp;</p>
            <Button to={`${PATH.ISSUER}/${token_info.creators[0]}`}>
              <Primary>{walletPreview(token_info.creators[0])}</Primary>
            </Button>
          </div>
          {!feed && (
            <div>
              <p>
                <span>
                  Editions:
                  <span>
                    {ed}/{total}
                  </span>
                </span>
              </p>
              {false && (
                <p>
                  Price range: {(Number(s.xtz_per_objkt) / 1000000).toFixed(2)}-
                  {(Number(maxPrice.xtz_per_objkt) / 1000000).toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>
        {feed && (
          <div className={styles.objktContainer}>
            <Button to={`${PATH.OBJKT}/${token_id}`} disabled={isDetailView}>
              <Primary>OBJKT#{token_id}</Primary>
            </Button>
            <div style={{ paddingLeft: '20px', marginBottom: '2px' }}>
              {renderHDAObutton(token_id, hDAO_balance)}
            </div>
          </div>
        )}
      </div>
      <div className={styles.container}>
        {isDetailView && (
          <div className={styles.container}>
            <p>OBJKT#{token_id}</p>
            <span
              data-position={'top'}
              data-tooltip='copy sharing url'
            >
              <Button
                onClick={() => copySharingURL(token_id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  style={{
                    fill: 'var(--text-color)',
                    stroke: 'transparent',
                  }}
                >
                  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                </svg>
              </Button>
            </span>
            <Button onClick={() => handleCollect()}>
              <Purchase>{message}</Purchase>
            </Button>
          </div>
        )}
      </div>
      <div className={styles.container}>
        {!feed && <div>{renderHDAObutton(token_id, hDAO_balance)}</div>}
      </div>
    </>
  )
}
