import React, { useContext } from 'react'
import { PATH } from '../../constants'
import { Button, Primary, Purchase } from '../button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'
import { CollabIssuerInfo } from '../collab/show/CollabIssuerInfo'

const _ = require('lodash')

export const ItemInfo = ({
  id,
  creator_id,
  owners,
  swaps,
  creator,
  // transfered,
  feed,
  token_holders,
  supply,
  // total_amount,
  hDAO_balance,
  isDetailView,
  restricted,
  artifact_uri,
  mime
}) => {
  const { syncTaquito, collect, curate, claim_hDAO, acc } =
    useContext(HicetnuncContext)
  const reducer = (accumulator, currentValue) =>
    parseInt(accumulator) + parseInt(currentValue)

  if (isDetailView) {
    // subtract burned pieces from total
    let total = 0

    total = supply
    let ed =
      token_holders.filter(
        (e) => e.holder_id === 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn'
      ).length > 0
        ? token_holders.filter(
          (e) => e.holder_id === 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn'
        )[0].quantity
        : 'X'
    swaps = swaps.filter(e => parseInt(e.contract_version) === 2 && parseInt(e.status) === 0 && e.is_valid)
    console.log(swaps)
    let s = _.minBy(swaps, (o) => Number(o.price))
    let maxPrice = _.maxBy(swaps, (o) => Number(o.price))

    var message = ''

    try {
      message =
        swaps[0] !== undefined
          ? 'collect for ' + Number(s.price) / 1000000 + ' tez'
          : 'not for sale'
    } catch (e) {
      message = 'not for sale'
    }

    const handleCollect = () => {
      if (acc == null) {
        syncTaquito()
      } else {
        collect(s.id, s.price * 1)
      }
    }

    const curateOrClaim = (id, balance = 0) => {
      // if user is creator and there's hDAO balance
      if (acc && acc.address === creator.address && balance > 0) {
        claim_hDAO(balance, id)
      } else {
        curate(id)
      }
    }

    const renderHDAObutton = (id, balance) => {
      return (
        <Button onClick={() => curate(id)}>
          <Primary>
            <span
              className={styles.top}
              data-position={'top'}
              data-tooltip={'curate'}
            >
              〇
            </span>
          </Primary>
        </Button>
      )
    }

    const reverseImageSearch = (imgurl) => {
      window.open(`https://tineye.com/search/?url=${imgurl.replace('ipfs://','https://ipfs.io/ipfs/')}`,'_blank');
      window.open(`https://www.google.com/searchbyimage?image_url=${imgurl.replace('ipfs://','https://ipfs.io/ipfs/')}`,'_blank');
    }

    // the issuer path depends on whether it's a collab address (KT) or individual (tz)
    const { ISSUER, COLLAB } = PATH
    const creatorAddress = creator.address
    const isCollab = creatorAddress.substring(0, 2) === 'KT'
    const issuerPath = isCollab ? COLLAB : ISSUER

    return (
      <>
        <div style={{ height: '30px' }}></div>
        <div className={styles.container}>
          <div className={styles.edition}>
            <div className={styles.inline}>
              {/* <p className={styles.issuer}>{isCollab ? 'Collaboration:' : 'Issuer:'}&nbsp;</p> */}
              {isCollab && (
                <CollabIssuerInfo address={ creatorAddress } />
              )}
              {!isCollab && (
                <Button
                  to={
                    `/tz/${creator.address}`
                  }
                >
                  {creator.name ? (
                    <Primary>{encodeURI(creator.name)}</Primary>
                  ) : (
                    <Primary>{walletPreview(creator.address)}</Primary>
                  )}
                </Button>
              )}
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
              </div>
            )}
          </div>
          {feed && (
            <div className={styles.objktContainer}>
              <Button to={`${PATH.OBJKT}/${id}`} disabled={isDetailView}>
                <Primary>OBJKT#{id}</Primary>
              </Button>
            </div>
          )}
        </div>

        {isDetailView && !restricted && (
          <div className={styles.spread}>
            <p style={{ paddingBottom: '7.5px' }}>OBJKT#{id}</p>
            <Button onClick={() => handleCollect()}>
              <Purchase>{message}</Purchase>
            </Button>
          </div>
        )}
        <div style={{display:'flex'}}>
          <Button onClick={() => curate(id)}>
            <Primary>
              <span
                className={styles.top}
                data-position={'top'}
                data-tooltip={'curate'}
              >
                〇
              </span>
            </Primary>
          </Button>
          &nbsp;
          {
            mime.includes('image') && (
              <>
              {/* <Button href={`https://www.google.com/searchbyimage?image_url=${artifact_uri.replace('ipfs://','https://ipfs.io/ipfs/')}`}>
                <Primary>
                  <span
                    className={styles.top}
                    data-position={'top'}
                    data-tooltip={'search image'}
                  >
                    <svg style={{marginBottom: '-4px'}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </span>
                </Primary>
              </Button>
              &nbsp; */}
              <Button onClick={()=>{reverseImageSearch(artifact_uri)}}>
                <Primary>
                  <span
                    className={styles.top}
                    data-position={'top'}
                    data-tooltip={'image search'}
                  >
                    <svg style={{marginBottom: '-4px'}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </span>
                </Primary>
              </Button>
              </>
            )
          }
        </div>
      </>
    )
  } else {
    return (
      <div className={styles.container}>
        <div className={styles.edition}>
          <div className={styles.inline}>
            <Button
              to={
                `/tz/${creator.address}`
              }
            >
              {creator.name ? (
                <Primary>{encodeURI(creator.name)}</Primary>
              ) : (
                <Primary>{walletPreview(creator.address)}</Primary>
              )}
            </Button>
          </div>
          <div className={styles.objktContainer}>
            <Button to={`${PATH.OBJKT}/${id}`}>
              <Primary>OBJKT#{id}</Primary>
            </Button>
            <Button onClick={() => curate(id)}>
              <Primary>
                <span
                  className={styles.top}
                  data-position={'top'}
                  data-tooltip={'curate'}
                >
                  〇
                </span>
              </Primary>
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
