import React, { useState, useContext } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Button, ActionButton } from '../../../components/button'
import { Loading } from '../../../components/loading'
const _ = require('lodash')
// README: commented some code out displaying errors and logs.
// adding warning saying burning is temporary disabled.
export const Burn = (props) => {
  // console.log('burn props', props)
  // const { address, /* token_id, */ total_amount, owners } = props
  const { burn } = useContext(HicetnuncContext)
  const [message, setMessage] = useState() // eslint-disable-line
  const [progress, setProgress] = useState() // eslint-disable-line

  const handleSubmit = () => {
    const r = global.confirm('Burning will remove all OBJKT#:id from your possession to a burn address.')
    console.log(props.token_id)
    console.log(props.acc)
    console.log(props.owners)

    // 
    if (r) {
      //alert('burning temporary disabled')
      setProgress(true)
      setMessage('burning NFT')
      burn(props.token_id, props.owners)

      //console.log(owners)
      // console.log('total amount', total_amount)

      // console.log(props.owners, owners[address])
      /*       burn(address, token_id, total_amount)
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
        }) */
    }
  }

  return (
    <>
      <Container>
        <Padding>
          <p>Burning will remove all OBJKT#{props.token_id} from your possession to a burn address.</p>
        </Padding>
      </Container>
      <Container>
        <Padding>
          <Button onClick={handleSubmit} fit>
            <ActionButton>burn it</ActionButton>
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
