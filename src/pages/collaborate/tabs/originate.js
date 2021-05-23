// THIS FILE SHOULD BE REMOVED
// it replaced with create.js
import { MichelsonMap } from '@taquito/taquito'

import React, { useContext, useState } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Button, Curate } from '../../../components/button'
import { Input } from '../../../components/input'

export const Originate = () => {
  //, syncTaquito, collect, acc, getAccount, cancel
  const { Tezos, objkt } = useContext(
    HicetnuncContext
  )
  const [adminAddress, setAdminAddress] = useState('')
  const [participants, setParticipants] = useState({})
  const [totalShares, setTotalShares] = useState(0)

  const updateParticipant = (pNum, address, shares) => {
    // Updates participant info by its index pNum. If there are no
    // participant - creates one.
    // If address is undefined - used already saved address
    // If shares is undefined - used already saved shares

    const participant = participants[pNum] || {}
    // TODO: is it okay to use participants here or should I make a participantsCopy?
    participant['address'] = address || participant['address']
    participant['shares'] = shares || participant['shares']

    participants[pNum] = participant
    setParticipants(participants)
  }

  const wrapShares = (participants) => {
    // Transforms participants into shares object:
    let shares = {}
    Object.values(participants).forEach(
      value => shares[value['address']] = value['shares'])
    return shares
  }

  const originateContract = () => {

    // TODO: check that all fields are correct
    const administratorAddress = participants[1]['address']
    const shares = wrapShares(participants)
    const storage = {
      administrator: administratorAddress,
      shares: MichelsonMap.fromLiteral(shares),
      totalShares: totalShares,
      hicetnuncMinterAddress: objkt,
    };

    console.log('shares', shares)
    console.log('storage', storage)
  }
  // TODO: make origination works
  // TODO: show participants in the loop
  // TODO: button + to add new participants
  // TODO: Total share sum counter
  // TODO: address + shares in one row

  return (
      <Container>
        <Padding>
          <Input
            type="text"
            onChange={(e) => updateParticipant(1, e.target.value, undefined)}
            placeholder="participant 1 address (administrator)"
            label="participant 1 address (administrator)"
            value={adminAddress}
          />
          <Input
            type="number"
            onChange={(e) => updateParticipant(1, undefined, e.target.value)}
            placeholder="participant 1 shares"
            label="participant 1 shares"
            value={adminAddress}
          />
        </Padding>
        <Padding>
          <Input
            type="text"
            onChange={(e) => updateParticipant(2, e.target.value, undefined)}
            placeholder="participant 2 address"
            label="participant 2 address"
            value={adminAddress}
          />
          <Input
            type="number"
            onChange={(e) => updateParticipant(2, undefined, e.target.value)}
            placeholder="participant 2 shares"
            label="participant 2 shares"
            value={adminAddress}
          />
        </Padding>

        <Padding>
            Total shares: {totalShares}
        </Padding>

        <Padding>
            OBJKT contract: {objkt}
        </Padding>

        <Padding>
          <Button onClick={(e) => originateContract()} fit> <Curate>Create new collaborative contract</Curate>
          </Button>
        </Padding>
      </Container>
  )
}

