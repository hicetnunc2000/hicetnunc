import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Loading } from '../../../components/loading'
import { Input } from '../../../components/input'
import { Button, Curate } from '../../../components/button'
import { getTotalSales } from '../../../utils/sanitise'

export const Swap = ({ total_amount, owners, token_info, address }) => {
  const { id } = useParams()
  const { swap } = useContext(HicetnuncContext)
  const [amount, setAmount] = useState()
  const [price, setPrice] = useState()
  const sales = getTotalSales({ owners, creators: token_info.creators })
  const [progress, setProgress] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (!amount || amount === '' || !price || price === '') {
      // simple validation for now
      alert('the swap is invalid')
    } else {
      setProgress(true)
      setMessage('generating swap')
      // swap is valid call API
      console.log(amount, id, price)
      swap(parseFloat(amount), id, parseFloat(price * 1000000))
        .then((e) => {
          // when taquito returns a success/fail message
          setProgress(false)
          setMessage(e.description)
          console.log('swap/list', e)

          //history.push(`${PATH.ISSUER}/${address}`)
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
          <Input
            type="number"
            label="QUANTITY"
            helpText="number of OBJKTs"
            min={1}
            defaultValue={amount}
            max={total_amount - sales}
            onChange={(e) => setAmount(e.target.value)}
            disabled={progress}
          />
          <Input
            type="number"
            label="PRICE"
            helpText="price per OBJKT (in tez)"
            min={0}
            max={10000}
            onChange={(e) => setPrice(e.target.value)}
            disabled={progress}
          />
          <Button onClick={handleSubmit} fit disabled={progress}>
            <Curate>swap it</Curate>
          </Button>
          <div>
            <p>{message}</p>
            {progress && <Loading />}
          </div>
        </Padding>
      </Container>

      <Container>
        <Padding>
          <p>
            swaps which carry value are charged with a 2.5% fee for platform
            maintenance
          </p>
        </Padding>
      </Container>
    </>
  )
}
