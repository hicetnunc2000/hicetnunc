import React from 'react'
import { Container, Padding } from '../../../components/layout'
import { Input } from '../../../components/input'
import { Button, Curate } from '../../../components/button'

export const Swap = ({ total_amount, owners }) => {
  const filtered =
    (owners &&
      Object.keys(owners)
        .filter((s) => s.startsWith('tz'))
        .map((s) => ({ amount: owners[s], wallet: s }))) ||
    []
  const sales = filtered.length
  console.log('sales', sales)

  return (
    <>
      <Container>
        <Padding>
          <Input
            type="number"
            placeholder="OBJKT amount"
            name="objkt_amount"
            min={1}
            max={total_amount - sales}
            onChange={() => null /* this.handleChange */}
          />
          <Input
            type="number"
            placeholder="price per OBJKT (in tez)"
            name="xtz_per_objkt"
            min={0}
            max={10000}
            onChange={() => null /* this.handleChange */}
          />
          <Button onClick={() => null /* this.submitForm */} fit>
            <Curate>swap it</Curate>
          </Button>
        </Padding>
      </Container>

      <Container>
        <Padding>
          <p>
            swaps which carry value are charged with a 2.5% fee for platform
            maintenance
          </p>
        </Padding>
      </Container>
    </>
  )
}
