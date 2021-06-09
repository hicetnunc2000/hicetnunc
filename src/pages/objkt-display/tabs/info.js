import React from 'react'
import { Container, Padding } from '../../../components/layout'
import { Button, Primary } from '../../../components/button'
import { Tags } from '../../../components/tags'

export const Info = ({ token_info }) => {
  const { name, description, tags, formats } = token_info

  // cloudflare isn't useful in this case. they don't allow video streaming...
  // const CLOUDFLARE = 'https://cloudflare-ipfs.com/ipfs/'
  const IPFS = 'https://ipfs.io/ipfs/'

  return (
    <>
      <Container>
        <Padding>
          <div
            style={{
              fontFamily: 'basier_circle_monoregular',
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            {name}
          </div>
        </Padding>
      </Container>

      <Container>
        <Padding>{description}</Padding>
      </Container>

      <Container>
        <Padding>
          <Tags tags={tags} />
        </Padding>
      </Container>

      <Container>
        <Padding>mimetype: {formats[0].mimeType}</Padding>
        <Padding>
          <Button href={formats[0].uri.replace('ipfs://', IPFS)}>
            <Primary>ipfs</Primary>
          </Button>
        </Padding>
      </Container>
    </>
  )
}
