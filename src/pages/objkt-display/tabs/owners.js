import React from 'react'
import { Container, Padding } from '../../../components/layout'
import { OwnerList } from '../../../components/owner-list'

export const Owners = ({ owners }) => {
  const filtered =
    (owners &&
      Object.keys(owners)
        .filter((s) => s.startsWith('tz'))
        .filter((s) => parseFloat(owners[s]) > 0) // removes negative owners
        .map((s) => ({ amount: owners[s], wallet: s }))) ||
    []
  return (
    <>
      {filtered.length === 0 ? (
        <Container>
          <Padding>no owners</Padding>
        </Container>
      ) : (
        <Container>
          <Padding>
            <OwnerList owners={filtered} />
          </Padding>
        </Container>
      )}
    </>
  )
}
