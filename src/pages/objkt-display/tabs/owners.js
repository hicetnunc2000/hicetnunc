import React from 'react'
import { Container, Padding } from '../../../components/layout'
import { OwnerList } from '../../../components/owner-list'

export const Owners = ({ owners }) => {
  const filtered =
    (owners &&
      Object.keys(owners)
        .filter((s) => s.startsWith('tz'))
        .map((s) => ({ amount: owners[s], wallet: s }))) ||
    []
  console.log(filtered.length)
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
