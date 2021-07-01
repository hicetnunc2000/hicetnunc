import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Loading } from '../../../components/loading'
import { Input } from '../../../components/input'
import { Button, Curate } from '../../../components/button'

export const Swap = ({ total_amount, owners, creator, royalties, token_info, address }) => {
  const { id } = useParams()
  const { swap, swapv2, acc } = useContext(HicetnuncContext)
  const [amount, setAmount] = useState()
  const [price, setPrice] = useState()
  const [progress, setProgress] = useState(false)
  const [message, setMessage] = useState('')

  console.log('token', creator.address)
  const checkPrice = (value) => {
    if (value <= 0.1) {
      setPrice(value)
      setMessage(
        'please note that items intended to be giveaways can be collected in multiple editions and resold in large quantities. please ensure you are happy with the quantity and price chosen before swapping'
      )
    } else {
      setPrice(value)
      setMessage('')
    }

    if (value === '') {
      setPrice(value)
      setMessage('')
    }
  }

  const handleSubmit = () => {
    if (!amount || amount === '' || !price || price === '') {
      // simple validation for now
      alert('invalid input')
    } else {
      setProgress(true)
      setMessage('preparing swap')
      // swap is valid call API
      console.log(acc.address, royalties,parseFloat(price) * 1000000, id, creator.address, parseFloat(amount))
      swapv2(acc.address, royalties, parseFloat(price) * 1000000, id, creator.address, parseFloat(amount))
      //swap(parseFloat(amount), id, parseFloat(price) * 1000000)  
      .then((e) => {
          // when taquito returns a success/fail message
          setProgress(false)
          setMessage(e.description)

          //history.push(`${PATH.ISSUER}/${address}`)
        })
        .catch((e) => {
          setProgress(false)
          setMessage('error')
        })
    }
  }

  return (
    <>
      <Container>
        <Padding>
          <Input
            type="number"
            placeholder="OBJKT amount"
            min={1}
            defaultValue={amount}
            /* max={total_amount - sales} */
            onChange={(e) => setAmount(e.target.value)}
            disabled={progress}
          />
          <Input
            type="number"
            placeholder="price per OBJKT (in tez)"
            min={0}
            max={10000}
            onChange={(e) => checkPrice(e.target.value)}
            disabled={progress}
          />
          <Button onClick={handleSubmit} fit disabled={progress}>
            <Curate>swap</Curate>
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
            swaps which carry values are charged with a 2.5% fee for platform
            maintenance
          </p>
        </Padding>
      </Container>
    </>
  )
}
