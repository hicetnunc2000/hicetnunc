import React, { useState, useContext } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Input } from '../../../components/input'
import { Button, Curate } from '../../../components/button'

export const Select = () => {
  const { getProxy, setProxy } = useContext(HicetnuncContext)
  const [newProxyContract, setNewProxy] = useState(getProxy())

  return (
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
        <Padding>
          <Button onClick={(e) => setProxy(newProxyContract)} fit>
            <Curate>Use proxy contract</Curate>
          </Button>
        </Padding>
      </Container>
  )
}

