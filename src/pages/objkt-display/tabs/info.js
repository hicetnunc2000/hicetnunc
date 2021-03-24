import React from 'react'
import { Container, Padding } from '../../../components/layout'
import { Tags } from '../../../components/tags'

export const Info = ({ token_info }) => {
  const { name, description, tags } = token_info
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
    </>
  )
}
