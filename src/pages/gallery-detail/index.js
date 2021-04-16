import React, { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'
import { Item } from './item'
import { ItemModal } from './item-modal'
import styles from './styles.module.scss'

export const GalleryDetail = () => {
  const { id } = useParams()
  const [loaded, setLoaded] = useState(false)
  const [collection, setCollection] = useState([])
  const [modal, setModal] = useState()

  const showModal = (info) => {
    setModal(info)
    if (info) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style = {}
    }
  }

  useEffect(() => {
    // loads gallery to check endpoint file
    fetch('/galleries/galleries.json')
      .then((e) => e.json())
      .then((galleries) => {
        const found = galleries.find((e) => e.uid === id)

        if (found) {
          fetch(found.endpoint)
            .then((e) => e.json())
            .then((data) => {
              setCollection(data)
              setLoaded(true)
            })
        } else {
          alert(`gallery ${id} not found`)
        }
      })

    return () => {
      document.body.style = {}
    }
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
        <div className={styles.container}>
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

          <Container xlarge>
            <Padding>
              <div className={styles.content}>
                {collection.data.map((artist, i) => {
                  return (
                    <div className={styles.block} key={`artist${i}`}>
                      {artist.artist && (
                        <div className={styles.artist}>
                          <strong>{artist.artist}</strong>
                        </div>
                      )}
                      <div className={styles.gallery}>
                        {artist.objkt.map((objkt) => {
                          return (
                            <Item
                              key={objkt}
                              objkt={objkt}
                              onClick={(info) => showModal(info)}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Padding>
          </Container>

          <AnimatePresence>
            {modal && (
              <div className={styles.modal}>
                <div
                  className={styles.background}
                  onClick={() => showModal(false)}
                />
                <ItemModal info={modal} />
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Page>
  )
}
