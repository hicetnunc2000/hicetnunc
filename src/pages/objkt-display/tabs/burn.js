import React, { useState, useContext } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Button, Purchase } from '../../../components/button'
import { Input } from '../../../components/input'
import { Loading } from '../../../components/loading'

export const Burn = (props) => {
  console.log("BURN", props)
  
  const { token_holders, id } = props
  const { burn, acc, proxyAddress, message, setMessage, setProgress, progress } = useContext(HicetnuncContext)
  const [amount, setAmount] = useState('')

  let totalOwned = 0

  const proxyAdminAddress = props.creator.is_split ? props.creator.shares[0].administrator : null

  const found = token_holders.find(
    (e) => e.holder_id === acc?.address || (e.holder_id === proxyAddress && acc?.address === proxyAdminAddress)
  )

  if (found) {
    totalOwned = found.quantity
  }

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
      burn(id, amount)
    }
  }

  return (
    <>
      {!progress ?
        <div>
          <Container>
            <Padding>
              <p>
                You own {totalOwned} editions of OBJKT#{props.id}. How many would
                you like to burn?
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
              <p style={{ fontSize: '14px' }}>
                Burning will transfer the OBJKTs from your possession to a burn
                address. Once in the burn address, the OBJKT can't be recovered or
                sold. You can only burn tokens that you own. If you have them
                swapped, you first need to cancel that swap before you try to burn
                them.
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
                <Purchase>burn</Purchase>
              </Button>
            </Padding>
          </Container>
        </div>
        :
        <div>
          <p tyle={{
          position: 'absolute',
          left: '46%',
          top: '35%',
      }}> {message}</p>
          {progress && <Loading />}
        </div>
      }
    </>
  )
}
