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

  const totalOwned = ( props.owners[address?.address] && parseInt(props.owners[address?.address]) ) || 0 // check total the user owns of this token

  const handleSubmit = () => {
    if (amount === '') {
      alert('Error: No amount specified.')
      return
    }

    if (amount > totalOwned) {
      alert(
        `Error: You're trying to burn ${amount}, but you only own ${totalOwned}.`
      )
      return
    }

    const r = global.confirm(
      `Are you sure you want to burn ${amount} of ${totalOwned}?`
    )
    if (r) {
      setProgress(true)
      setMessage('burning OBJKT')
      burn(props.token_id, amount)
    }
  }

  return (
    <>
      <Container>
        <Padding>
          <p>
            You own {totalOwned} editions of OBJKT#{props.token_id}. How many
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
          <p>
            Burning will transfer from your possession to a burn address. Once
            in the burn address, OBJKT they can't be recovered or sold. You can
            only burn tokens that you own. If you have them on a swap, you first
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
