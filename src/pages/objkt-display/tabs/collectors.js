import React, { useContext } from 'react'
import { Container, Padding } from '../../../components/layout'
import { OwnerList } from '../../../components/owner-list'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { OwnerSwaps } from '../../../components/owner-swaps'

const _ = require('lodash')

export const Collectors = ({ owners, swaps, token_holders }) => {
  const { syncTaquito, collect, acc, getAccount, cancel } =
    useContext(HicetnuncContext)
    console.log(swaps)
    console.log('holders', token_holders)

  // sort swaps in ascending price order

  swaps = _.orderBy(swaps, 'price', 'asc')

/*   const filtered =
    (owners &&
      Object.keys(owners)
        .filter((s) => s.startsWith('tz'))
        .filter((s) => parseFloat(owners[s]) > 0) // removes negative owners
        .filter((e) => e !== 'tz1burnburnburnburnburnburnburjAYjjX') // remove burn wallet
        .map((s) => ({ amount: owners[s], wallet: s }))) ||
    [] */

  const handleCollect = (swap_id, price) => {
    if (acc == null) {
      syncTaquito()
      getAccount()
    } else {
      collect(1, swap_id, price)
    }
  }
  return (
    <>
      {swaps.length > 0 && (
        <Container>
          <Padding>
            <OwnerSwaps
              swaps={swaps}
              handleCollect={handleCollect}
              acc={acc}
              cancel={cancel}
            />
          </Padding>
        </Container>
      )}

      {/* {filtered.length === 0 ? undefined : ( */}
        <Container>
          <Padding>
            <OwnerList owners={token_holders} />
          </Padding>
        </Container>
      {/* )} */}
    </>
  )
}
