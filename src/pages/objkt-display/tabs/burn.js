import React, { useState } from 'react'
// import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Button, Curate } from '../../../components/button'
import { Loading } from '../../../components/loading'
// import { lowestPrice } from '../../../utils/lowestPrice'

export const Burn = ({ swaps }) => {
  // const { cancel } = useContext(HicetnuncContext)
  // const { swap_id } = lowestPrice(swaps)
  const [message, setMessage] = useState()
  const [progress, setProgress] = useState()

  const handleSubmit = () => {
    const r = global.confirm('Are you sure?')
    if (r) {
      setProgress(true)
      setMessage('burning NFT')
      // cancel(swap_id)
      //   .then((e) => {
      //     // when taquito returns a success/fail message
      //     setProgress(false)
      //     setMessage(e.description)
      //     console.log('cancel', e)
      //   })
      //   .catch((e) => {
      //     setProgress(false)
      //     setMessage('an error occurred')
      //   })
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
            <Curate>cancel it</Curate>
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
