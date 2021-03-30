import React, { useContext } from 'react'
import { Container, Padding } from '../../../components/layout'
import { OwnerList } from '../../../components/owner-list'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Button, Purchase } from '../../../components/button'
import { walletPreview } from '../../../utils/string'

const _ = require('lodash')

export const Owners = ({ owners, swaps }) => {
  const { syncTaquito, collect, acc, getAccount, cancel } = useContext(
    HicetnuncContext
  )
  console.log(owners, swaps)
  console.log(_.merge(owners, swaps))

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
      {swaps.length > 0 ? (
        <Container>
          <Padding>
            {swaps.map((e) => {
              return (
                <div style={{ marginBottom: `10px` }}>
                  <span>
                    {e.objkt_amount}x{' '}
                    <a
                      style={{
                        color: '#000',
                        '&:hover': {
                          color: 'white',
                          textDecoration: 'underline',
                        },
                      }}
                      href={'/tz/' + e.issuer}
                    >
                      {walletPreview(e.issuer)}
                    </a>
                  </span>
                  <span style={{ float: 'right' }}>
                    <Button
                      onClick={() => handleCollect(e.swap_id, e.xtz_per_objkt)}
                    >
                      <Purchase>
                        collect for {parseFloat(e.xtz_per_objkt / 1000000)} tez
                      </Purchase>
                    </Button>
                  </span>
                  {e.issuer == (acc !== undefined ? acc.address : '') ? (
                    <span style={{ float: 'right' }}>
                      <Button onClick={() => cancel(e.swap_id)}>
                        <Purchase>cancel</Purchase>
                      </Button>
                    </span>
                  ) : undefined}
                  {/* cancel */}
                </div>
              )
            })}
          </Padding>
        </Container>
      ) : undefined}
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
