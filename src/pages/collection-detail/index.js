import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'
import styles from './index.module.scss'

export const CollectionDetail = () => {
  const { id } = useParams()
  const [loaded, setLoaded] = useState(false)
  const [collection, setCollection] = useState([])

  useEffect(() => {
    fetch(`/collections/${id}.json`)
      .then((e) => e.json())
      .then((data) => {
        console.log('collection', data)
        setCollection(data)
        setLoaded(true)
      })
  }, [id])

  return (
    <Page title="collections">
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
              <Button to="/collections">
                <Primary>back to collections</Primary>
              </Button>
            </Padding>
          </Container>

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
              <div className={styles.list}>
                {collection.objkt.map((nft, i) => {
                  return (
                    <div className={styles.container} key={`thumb${i}`}>
                      <div
                        style={{ backgroundColor: 'gray', height: '100px' }}
                      />
                      <div className={styles.number}>OBJKT#{nft}</div>
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
