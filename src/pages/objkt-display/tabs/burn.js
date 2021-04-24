import React, { useState, useContext } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Button, Curate } from '../../../components/button'
import { Loading } from '../../../components/loading'

export const Burn = (props) => {
  const { burn } = useContext(HicetnuncContext)
  const [message, setMessage] = useState() // eslint-disable-line
  const [progress, setProgress] = useState() // eslint-disable-line

  const handleSubmit = () => {
    const r = global.confirm(
      `Burning will remove all OBJKT#${props.token_id} from your possession to a burn address.`
    )
    if (r) {
      setProgress(true)
      setMessage('burning OBJKT')
      burn(props.token_id, props.owners)
    }
  }

  return (
    <>
      <Container>
        <Padding>
          <p>
            Burning will remove all OBJKT#{props.token_id} from your possession
            to a burn address. Those that you have swapped (on sale), or have
            already been collected by others will not be affected by burn.
          </p>
          <p>&nbsp;</p>
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
