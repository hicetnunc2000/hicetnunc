import React, { useEffect, useState } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'

export const Galleries = () => {
  const [loaded, setLoaded] = useState(false)
  const [collections, setCollections] = useState([])

  useEffect(() => {
    fetch('/galleries/galleries.json')
      .then((e) => e.json())
      .then((data) => {
        console.log('galleries', data)
        setCollections(data)
        setLoaded(true)

        //http://www.joanielemercier.com/hicetnunc/thefen.json
      })
  }, [])
  return (
    <Page title="galleries">
      <Container>
        <Padding>
          <strong>galleries</strong>
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
                  <Button key={c.uid} to={`/galleries/${c.uid}`}>
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
