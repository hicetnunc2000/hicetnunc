import React from 'react'
import { Container, Padding } from '../../../components/layout'
import { Button, Primary } from '../../../components/button'
import { Tags } from '../../../components/tags'

export const Info = ({ token_info }) => {
  const { name, description, tags, formats } = token_info

  const CLOUDFLARE = 'https://cloudflare-ipfs.com/ipfs/'

  return (
    <>
      <Container>
        <Padding>TITLE</Padding>
        <Padding>{name}</Padding>
      </Container>

      <Container>
        <Padding>DESCRIPTION</Padding>
        <Padding>{description}</Padding>
      </Container>

      <Container>
        <Padding>
          <Tags tags={tags} />
        </Padding>
      </Container>

      <Container>
        <Padding>MEDIA</Padding>
        <Padding>mimetype: {formats[0].mimeType}</Padding>
        <Padding>
          <Button href={formats[0].uri.replace('ipfs://', CLOUDFLARE)}>
            <Primary>ipfs</Primary>
          </Button>
        </Padding>
      </Container>
    </>
  )
}
