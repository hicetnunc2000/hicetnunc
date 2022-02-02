import React, { useContext } from 'react'
import { Button, Primary, Purchase } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'
import { HicetnuncContext } from '../../context/HicetnuncContext'

const sortByPrice = (a, b) => {
  return Number(a.xtz_per_objkt) - Number(b.xtz_per_objkt)
}

export const OwnerSwaps = ({ swaps, handleCollect, cancel, proxyAdminAddress, restricted, ban, cancelv1, reswapv2 }) => {

  console.log("SWAPS", proxyAdminAddress);

  const { acc, proxyAddress } = useContext(HicetnuncContext)

  let v2 = swaps.filter(e => parseInt(e.contract_version) === 2 && parseInt(e.status) === 0 && e.is_valid)

  let v1 = swaps.filter(e => parseInt(e.contract_version) === 1 && parseInt(e.status) === 0)

  return (
    <div className={styles.container}>
      {
        v1.length > 0 && (
          <div>
            {v1.map((e, index) => {
              if (acc) {
                if (acc.address === e.creator_id) {
                  return (
                    <div>
                      <div key={`${e.id}-${index}`} className={styles.swap}>
                        <div className={styles.issuer}>
                          {e.amount_left} ed.&nbsp;
                          <Button to={'/tz/KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9'}>
                            <Primary>OBJKTSWAP V1</Primary>
                          </Button>
                        </div>
                        <div className={styles.buttons}>
                          <Button onClick={() => cancelv1(e.id)}>
                            <Purchase>cancel</Purchase>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return undefined
                }
              } else {
                return undefined
              }
            })}
          </div>
        )
      }
      {v2.sort(sortByPrice).map((swap, index) => {

        const showCancel = (swap.creator.address === acc?.address) || (proxyAdminAddress === acc?.address && swap.creator.address === proxyAddress)

        return (
          <div key={`${swap.id}-${index}`} className={styles.swap}>
            <div className={styles.issuer}>
              {swap.amount_left} ed.&nbsp;
              {swap.creator.name ? (
                <Button to={`/tz/${swap.creator.address}`}>
                  <Primary>{encodeURI(swap.creator.name)}</Primary>
                </Button>
              ) : (
                <Button to={`/tz/${swap.creator.address}`}>
                  <Primary>{walletPreview(swap.creator.address)}</Primary>
                </Button>
              )}
            </div>

            <div className={styles.buttons}>
              {!restricted && (
                !ban.includes(swap.creator_id) && (
                <Button onClick={() => handleCollect(swap.id, swap.price)}>
                  <Purchase>
                    collect for {parseFloat(swap.price / 1000000)} tez
                  </Purchase>
                </Button>
              ))}
              {showCancel && (
                  <>
                    <div className={styles.break}></div>
                    <input id="new_price" type="text" size="12" placeholder="New price"></input>
                    <Button onClick={() => reswapv2(swap)}>
                      <Purchase>reswap</Purchase>
                    </Button>

                    <Button onClick={() => cancel(swap.id)}>
                      <Purchase>cancel</Purchase>
                    </Button>
                  </>
                )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
