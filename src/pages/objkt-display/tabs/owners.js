import React, { useContext } from 'react'
import { Container, Padding } from '../../../components/layout'
import { OwnerList } from '../../../components/owner-list'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { OwnerSwaps } from '../../../components/owner-swaps'

const _ = require('lodash')

export const Owners = ({ owners, swaps }) => {
  const { syncTaquito, collect, acc, getAccount, cancel } = useContext(
    HicetnuncContext
  )
  console.log(owners, swaps)
  console.log(_.merge(owners, swaps))

  const s = _.minBy(swaps, (o) => o.xtz_per_objkt)
  const filtered =
    (owners &&
      Object.keys(owners)
        .filter((s) => s.startsWith('tz'))
        .filter((s) => parseFloat(owners[s]) > 0) // removes negative owners
        .map((s) => ({ amount: owners[s], wallet: s }))) ||
    []

  const handleCollect = (swap_id, xtz_per_objkt) => {
    if (acc == null) {
      syncTaquito()
      getAccount()
    } else {
      collect(1, swap_id, xtz_per_objkt)
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

      {filtered.length === 0 ? undefined : (
        <Container>
          <Padding>
            <OwnerList owners={filtered} />
          </Padding>
        </Container>
      )}
    </>
  )
}
