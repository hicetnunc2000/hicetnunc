import React from 'react'
import { Container, Padding } from '../../../components/layout'
import { Button, Primary } from '../../../components/button'
import { Tags } from '../../../components/tags'

export const Info = ( token_info ) => {
  const { title, description, token_tags, mime, artifact_uri } = token_info
  console.log(token_info)
  // cloudflare isn't useful in this case. they don't allow video streaming...
  // const CLOUDFLARE = 'https://cloudflare-ipfs.com/ipfs/'
  const IPFS = 'https://ipfs.io/ipfs/'

  return (
    <>
      <Container>
        <Padding>
          <div
            style={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            {title}
          </div>
        </Padding>
      </Container>

      <Container>
        <Padding>
          <div style={{ whiteSpace: 'pre-wrap' }}>{description}</div>
        </Padding>
      </Container>

      <Container>
        <Padding>
          <Tags token_tags={token_tags} />
        </Padding>
      </Container>

      <Container>
        <Padding>mimetype: {mime}</Padding>
        <Padding>
          <Button href={artifact_uri.replace('ipfs://', IPFS)}>
            <Primary>ipfs</Primary>
          </Button>
        </Padding>
      </Container>
    </>
  )
}
