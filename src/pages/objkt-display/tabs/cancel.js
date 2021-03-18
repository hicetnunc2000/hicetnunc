import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Button, Curate } from '../../../components/button'
import { Loading } from '../../../components/loading'
import { PATH } from '../../../constants'
import { lowestPrice } from '../../../utils/lowestPrice'

export const Cancel = ({ swaps, address }) => {
  const { cancel } = useContext(HicetnuncContext)
  const { swap_id } = lowestPrice(swaps)
  const [message, setMessage] = useState()
  const [progress, setProgress] = useState()
  const history = useHistory()

  const handleSubmit = () => {
    const r = global.confirm('Are you sure?')
    if (r) {
      setProgress(true)
      console.log(swaps)
      setMessage('cancelling swap')
      cancel(swaps[0].swap_id)
        .then((e) => {
          // when taquito returns a success/fail message
          setProgress(false)
          setMessage(e.name)
          console.log('cancel', e)
          history.push(`${PATH.ISSUER}/${address}`)
        })
        .catch((e) => {
          setProgress(false)
          setMessage('an error occurred')
        })
    }
  }

  return (
    <>
      <Container>
        <Padding>
          <p>You're about to cancel your swap.</p>
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
