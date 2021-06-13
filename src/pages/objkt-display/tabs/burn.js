import React, { useState, useContext } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Button, Curate } from '../../../components/button'
import { Input } from '../../../components/input'
import { Loading } from '../../../components/loading'

export const Burn = (props) => {
  const { burn, address } = useContext(HicetnuncContext)
  const [message, setMessage] = useState() // eslint-disable-line
  const [amount, setAmount] = useState('')
  const [progress, setProgress] = useState() // eslint-disable-line

  console.log(props.token_holders.map(e => e.holder_id))
  const totalOwned = 0
  console.log(address)
  if (props.token_holders.map(e => e.holder_id).includes([address?.address])) {
    totalOwned = props.token_holders.map(e => e.holder_id)[address.address]
  } 
/*   const totalOwned =
    (props.token_holders.map(e => e.holder_id)[address?.address] &&
      parseInt(props.owners[address?.address])) ||
    0 // check total the user owns of this token */

  const handleSubmit = () => {
    if (amount === '') {
      alert('Error: No amount specified.')
      return
    }

/*     if (amount > totalOwned) {
      alert(
        `Error: You're trying to burn ${amount}, but you only own ${0}.`
      )
      return
    } */

    const r = global.confirm(
      `Are you sure you want to burn ${amount} of ${0}?`
    )
    if (r) {
      setProgress(true)
      setMessage('burning OBJKT')
      burn(props.id, amount)
    }
  }

  return (
    <>
      <Container>
        <Padding>
          <p>
            You own {totalOwned} editions of OBJKT#{props.id}. How many
            would you like to burn?
          </p>
        </Padding>
      </Container>
      <Container>
        <Padding>
          <Input
            type="number"
            placeholder="OBJKTs to burn"
            min={1}
            max={totalOwned}
            onChange={(e) => setAmount(e.target.value)}
            disabled={progress}
          />
        </Padding>
      </Container>

      <Container>
        <Padding>
          <p style={{ fontSize : '14px' }}>
            Burning will transfer the OBJKTs from your possession to a burn address. Once
            in the burn address, the OBJKT can't be recovered or sold. You can
            only burn tokens that you own. If you have them swapped, you first
            need to cancel that swap before you try to burn them.
          </p>
          <br />
          <p>
            <strong>NB: This action is not reversable.</strong>
          </p>
        </Padding>
      </Container>

      <Container>
        <Padding>
          <Button onClick={handleSubmit} fit>
            <Curate>burn</Curate>
          </Button>
          <div>
            <p>{message}</p>
            {progress && <Loading />}
          </div>
        </Padding>
      </Container>
    </>
  )
}
