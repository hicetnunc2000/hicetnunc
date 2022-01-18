import React, { useContext } from 'react'
import { Container, Padding } from '../../../components/layout'
import { OwnerList } from '../../../components/owner-list'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { OwnerSwaps } from '../../../components/owner-swaps'

const _ = require('lodash')

export const Collectors = ({ id, creator, swaps, token_holders, restricted, ban }) => {
  const { syncTaquito, collect, acc, getAccount, cancel, cancelv1, reswapv2 } =
    useContext(HicetnuncContext)

  // sort swaps in ascending price order

  swaps = _.orderBy(swaps, 'price', 'asc')

  // for reswap, we need to have minimal token info
  swaps.forEach(s => {
    s.token = { id: id, creator_id: creator.address }
  })

  const handleCollect = (swap_id, price) => {
    if (acc == null) {
      syncTaquito()
      getAccount()
    } else {
      collect(swap_id, price)
    }
  }

  const proxyAdminAddress = creator.is_split ? creator.shares[0].administrator : null

  return (
    <>
      {swaps.length > 0 && (
        <Container>
          <Padding>
            <OwnerSwaps
              swaps={swaps}
              handleCollect={handleCollect}
              acc={acc}
              proxyAdminAddress={proxyAdminAddress}
              cancel={cancel}
              cancelv1={cancelv1}
              restricted={restricted}
              ban={ban}
              reswapv2={reswapv2}
            />
          </Padding>
        </Container>
      )}

      {/* {filtered.length === 0 ? undefined : ( */}
      <Container>
        <Padding>
          <OwnerList
            owners={token_holders}
            acc={acc}
            swaps={swaps}
          />
        </Padding>
      </Container>
      {/* )} */}
    </>
  )
}
