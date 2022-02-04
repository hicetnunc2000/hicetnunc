import React, { useEffect, useState, useContext } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { useParams } from 'react-router'
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { ItemModal } from './item-modal'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import { renderMediaType } from '../../components/media-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './styles.module.scss'
import axios from 'axios'
const _ = require('lodash')
async function fetchObjkts(ids) {
  const { data } = await fetchGraphQL(`
    query Objkts($_in: [bigint!] = "") {
      hic_et_nunc_token(where: { id: {_in: $_in}}) {
        artifact_uri
        display_uri
        creator_id
        id
        mime
        thumbnail_uri
        timestamp
        title
        hdao_balance
      }
    }`, "Objkts", { "_in": ids })
  return data.hic_et_nunc_token
}

async function fetchGraphQL(operationsDoc, operationName, variables) {
  let result = await fetch(process.env.REACT_APP_GRAPHQL_API, {
    method: 'POST',
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  })
  return await result.json()
}

export const GalleryDetail = () => {
  const context = useContext(HicetnuncContext)
  const { id } = useParams()
  const [loaded, setLoaded] = useState(false)
  const [collection, setCollection] = useState([])
  const [modal, setModal] = useState()
  const [hasMore, setHasMore] = useState(true)
  const [items, setItems] = useState([])
  const [feed, setFeed] = useState([])
  const [offset, setOffset] = useState(0)

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
            .then(async (data) => {
              let res = []

              if (id === 'thefen') {
                res = await axios.get('https://raw.githubusercontent.com/joanielemercier/The_fen/main/thefen.json').then(res => res.data.data.map(e => e.objkt))
                res = res.reduce((a, b) => [...a, ...b], [])
                res = await(fetchObjkts(res))
                res = res.filter(e => ![34413, 35798, 41628].includes(e.id))
              } else {
                res = await fetchObjkts(data.data[0].objkt)
              }

              setItems(res)
              setCollection(data)
              context.feed = res.slice(0, 15)
              setLoaded(true)
            })
        } else {
          alert(`gallery ${id} not found`)
        }
      })

    return () => {
      document.body.style = {}
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = () => {
    setFeed([...feed, ...items.slice(offset, offset + 15)])
    context.feed = _.uniqBy([...context.feed, ...items.slice(offset, offset + 15)], 'id')
    setOffset(offset + 15)
    if (feed.length === items.lenght) setHasMore(false)
  }

  return (
    <Page title={collection?.title}>
      {!loaded ? (
        <Container>
          {/*           <Padding>
            <Loading />
          </Padding> */}
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
              <InfiniteScroll
                dataLength={context.feed.length}
                next={loadMore}
                hasMore={hasMore}
                loader={undefined}
                endMessage={undefined}
              >
                <ResponsiveMasonry>
                  {
                    context.feed.map(e => {
                      return (
                        <Button key={e.id} to={`/objkt/${e.id}`}>
                          <div className={styles.item}>
                            {renderMediaType({
                              mimeType: e.mime,
                              artifactUri: e.artifact_uri,
                              displayUri: e.display_uri,
                              creator: "",
                              objkt: e.id,
                              interactive: false,
                              displayView: true
                            })}
                          </div>
                        </Button>
                      )
                    })
                  }
                </ResponsiveMasonry>
              </InfiniteScroll>
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
                <div className={styles.close} onClick={() => showModal(false)}>
                  CLOSE X
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Page>
  )
}
