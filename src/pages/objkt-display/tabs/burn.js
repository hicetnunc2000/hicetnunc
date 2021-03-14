import React, { useState, useContext } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Button, Curate } from '../../../components/button'
import { Loading } from '../../../components/loading'

export const Burn = (props) => {
  console.log('burn props', props)
  const { address, token_id, total_amount } = props
  const { burn } = useContext(HicetnuncContext)
  const [message, setMessage] = useState()
  const [progress, setProgress] = useState()

  const handleSubmit = () => {
    const r = global.confirm('Are you sure?')
    if (r) {
      setProgress(true)
      setMessage('burning NFT')

      burn(address, token_id, total_amount)
        .then((e) => {
          // when taquito returns a success/fail message
          console.log('cancel', e)
          setProgress(false)
          setMessage(e.message)
        })
        .catch((e) => {
          console.log('error', e)
          setProgress(false)
          setMessage('an error occurred')
        })
    }
  }

  return (
    <>
      <Container>
        <Padding>
          <p>Burning your NFT will permanently delete it from the network.</p>
        </Padding>
      </Container>
      <Container>
        <Padding>
          <Button onClick={handleSubmit} fit>
            <Curate>burn it</Curate>
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

/*
Tezos.wallet.at('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton').transfer([from : origin, txs : [ {to : dest, token_id : id } ])
*/
