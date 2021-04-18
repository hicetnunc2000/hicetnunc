import React, { useState, useContext } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Input } from '../../components/input'
import { Button, Curate } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'


export const ProxyContract = () => {
  const { getProxy, setProxy } = useContext(HicetnuncContext)
  const [newProxyContract, setNewProxy] = useState(getProxy())

  // TODO: button to free from proxy contract? (that just makes field empty)
  // TODO: create new smart contract form with separate page?
  // TODO: how to withdraw? (ideal if it sould be auto-transactions inside Deafult method with maps?)
  // TODO: validate proxy address?
  // TODO: any way to find all contracts that controlled by user pk?

  return (
    <Page title="proxy">
      <Container>
        <Padding>
          <Input
            type="text"
            onChange={(e) => setNewProxy(e.target.value)}
            placeholder="proxy contract address"
            label="proxy contract"
            value={newProxyContract}
          />
        </Padding>
      </Container>

      <Container>
        <Padding>
          <Button onClick={(e) => setProxy(newProxyContract)} fit>
            <Curate>Use proxy contract</Curate>
          </Button>
        </Padding>
      </Container>
    </Page>
  )
}
