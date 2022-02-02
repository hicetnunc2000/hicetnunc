import React, { useContext, useState } from 'react'
import { PATH } from '../../constants'
import { Button, Primary, Purchase, Secondary } from '../button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'
import collabStyles from '../collab/styles.module.scss'
import { SigningUI } from '../collab/sign/SigningUI'
import { SigningSummary } from '../collab/show/SigningSummary'
import { CollabIssuerInfo } from '../collab/show/CollabIssuerInfo'
import { CollaboratorType } from '../collab/constants'
import classNames from 'classnames'

const _ = require('lodash')

export const ItemInfo = ({
  id,
  swaps,
  creator,
  is_signed,
  token_signatures,
  feed,
  token_holders,
  supply,
  isDetailView,
  restricted
}) => {
  const { syncTaquito, collect, curate, acc } =
    useContext(HicetnuncContext)

  const [showSignStatus, setShowSignStatus] = useState(false)

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

    // Check collab status
    const isCollab = creator.is_split
    const verifiedSymbol = isCollab && is_signed ? '✓ ' : '⚠️'
    const verifiedStatus = isCollab && is_signed ? 'VERIFIED' : 'UNVERIFIED'
    const isCoreParticipant = isCollab ? creator.shares[0].shareholder.find(h => h.holder_id === acc?.address) : false

    // Show the signing UI if required
    const userHasSigned = token_signatures.find(sig => sig.holder_id === acc?.address)
    const coreParticipants = isCollab ? creator.shares[0].shareholder.filter(h => h.holder_type === CollaboratorType.CORE_PARTICIPANT) : null

    const signStatusStyles = classNames(
      collabStyles.flexBetween,
      collabStyles.alignStart
    )

    return (
      <>
        <div style={{ height: '30px' }}></div>
        <div className={styles.container}>
          <div className={styles.edition}>

            <div className={collabStyles.relative}>
              <div className={styles.inline}>

                {isCollab && (
                  <CollabIssuerInfo creator={creator} />
                )}

                {!isCollab && (
                  <Button to={`${PATH.ISSUER}/${creator.address}`}>
                    {creator.name ? (
                      <Primary>{encodeURI(creator.name)}</Primary>
                    ) : (
                      <Primary>{walletPreview(creator.address)}</Primary>
                    )}
                  </Button>
                )}
              </div>
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

        {/* SHOW SIGNING UI IF COLLABORATOR */}
        {isDetailView && isCollab && isCoreParticipant && !userHasSigned && (
          <div className={styles.container} style={{ paddingTop: 0 }}>
            <SigningUI id={id} hasSigned={false} />
          </div>
        )}

        {isDetailView && !restricted && (
          <div className={styles.spread}>
            <div>
              <p style={{ paddingBottom: '7.5px' }}>OBJKT#{id}</p>
              {isCollab && (
                <div className={collabStyles.relative}>
                  <span>{verifiedSymbol}</span>
                  <Button onClick={() => setShowSignStatus(!showSignStatus)}>
                    <Primary>
                      <strong>{verifiedStatus}</strong>
                    </Primary>
                  </Button>
                  {showSignStatus && (
                    <div className={collabStyles.collabInfo}>
                      <div className={signStatusStyles}>
                        <SigningSummary
                          coreParticipants={coreParticipants}
                          signatures={token_signatures}
                        />
                        <Button onClick={() => setShowSignStatus(false)}>
                          <Secondary>
                            close
                          </Secondary>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button onClick={() => handleCollect()}>
              <Purchase>{message}</Purchase>
            </Button>
          </div>
        )}
        <div className={styles.spread}>
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
      </>
    )
  } else {
    return (
      <div className={styles.container}>
        <div className={styles.edition}>
          <div className={styles.inline}>
            <Button
              to={
                `/tz/${creator?.address}`
              }
            >
              {creator?.name ? (
                <Primary>{encodeURI(creator?.name)}</Primary>
              ) : (
                <Primary>{walletPreview(creator?.address)}</Primary>
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
