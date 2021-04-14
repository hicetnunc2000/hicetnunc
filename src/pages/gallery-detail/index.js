import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'
import { Item } from './item'
import styles from './styles.module.scss'

export const GalleryDetail = () => {
  const { id } = useParams()
  const [loaded, setLoaded] = useState(false)
  const [collection, setCollection] = useState([])

  useEffect(() => {
    // loads gallery to check endpoint file
    fetch('/galleries/galleries.json')
      .then((e) => e.json())
      .then((galleries) => {
        const found = galleries.find((e) => e.uid === id)

        fetch(found.endpoint)
          .then((e) => e.json())
          .then((data) => {
            console.log(data)
            setCollection(data.data)
            setLoaded(true)
          })
      })
  }, [id])

  return (
    <Page title="galleries">
      {!loaded ? (
        <Container>
          <Padding>
            <Loading />
          </Padding>
        </Container>
      ) : (
        <>
          {false && (
            <Container>
              <Padding>
                <Button to="/galleries">
                  <Primary>back</Primary>
                </Button>
              </Padding>
            </Container>
          )}

          <Container>
            <Padding>
              <strong>{collection.title}</strong>
            </Padding>
          </Container>

          <Container>
            <Padding>
              <p>{collection.description}</p>
            </Padding>
          </Container>

          <Container>
            <Padding>
              <div className={styles.container}>
                {collection.map((artist, i) => {
                  console.log('artist', artist)
                  return (
                    <div className={styles.container} key={`artist${i}`}>
                      <div className={styles.artist}>
                        <strong>{artist.artist}</strong>
                      </div>
                      <div className={styles.gallery}>
                        {artist.objkt.map((objkt) => {
                          return <Item key={objkt} objkt={objkt} />
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Padding>
          </Container>
        </>
      )}
    </Page>
  )
}
