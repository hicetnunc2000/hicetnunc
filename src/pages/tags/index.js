import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { GetTags } from '../../data/api'
import { Page, Container, Padding } from '../../components/layout'

export const Tags = () => {
  const { tag } = useParams()
  console.log('load ID', tag)

  useEffect(() => {
    GetTags()
  }, [])

  return (
    <Page title="Tags">
      <Container>
        <Padding>Tags {tag}</Padding>
      </Container>
    </Page>
  )
}
