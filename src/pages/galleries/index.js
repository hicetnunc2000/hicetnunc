import React, { useEffect, useState } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'

export const Galleries = () => {
  const [loaded, setLoaded] = useState(false)
  const [collections, setCollections] = useState([])

  useEffect(() => {
    fetch('/collections/collections.json')
      .then((e) => e.json())
      .then((data) => {
        console.log('collections', data)
        setCollections(data)
        setLoaded(true)
      })
  }, [])
  return (
    <Page title="collections">
      <Container>
        <Padding>
          <strong>Collections</strong>
        </Padding>
      </Container>
      {!loaded ? (
        <Container>
          <Padding>
            <Loading />
          </Padding>
        </Container>
      ) : (
        <>
          <Container>
            <Padding>
              {collections.map((c) => {
                return (
                  <Button key={c.uid} to={`/collection/${c.uid}`}>
                    <Primary>{c.title}</Primary>
                  </Button>
                )
              })}
            </Padding>
          </Container>
        </>
      )}
    </Page>
  )
}
