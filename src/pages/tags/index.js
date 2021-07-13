/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { BottomBanner } from '../../components/bottom-banner'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router'
import { Button } from '../../components/button'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import { Loading } from '../../components/loading'
import { renderMediaType } from '../../components/media-types'
import { Page, Container, Padding } from '../../components/layout'
import { PATH } from '../../constants'
import styles from './styles.module.scss'

const axios = require('axios')

export const Tags = () => {
  const { id } = useParams()
  const [error, setError] = useState(false)
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = () => {
    setCount(count + 1)
  }

  useEffect(async () => {
    if (error) {
      console.log('returning on error')
      return
    }

    const next = items.concat(
      await axios
        .post(process.env.REACT_APP_GRAPHQL_TAGS, { tag: id })
        .then((res) => res.data)
    )
    next.map((e) => console.log(e))
    setItems(next)
  }, [count, id])

  return (
    <Page title={`Tag ${id}`}>
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <Container xlarge>
            <Padding>
              <Loading />
            </Padding>
          </Container>
        }
      >
        <div className={styles.container}>
          <Container xlarge>
            <ResponsiveMasonry>
              {items.map((nft, index) => {
                return (
                  <Button
                    key={`${nft.id}-${index}`}
                    to={`${PATH.OBJKT}/${nft.id}`}
                  >
                    <div className={styles.container}>
                      {renderMediaType({
                        mimeType: nft.mime,
                        artifactUri: nft.artifact_uri,
                        displayUri: nft.display_uri,
                      })}
                    </div>
                  </Button>
                )
              })}
            </ResponsiveMasonry>
          </Container>
        </div>
      </InfiniteScroll>
      {/* <BottomBanner>
      Collecting has been temporarily disabled. Follow <a href="https://twitter.com/hicetnunc2000" target="_blank">@hicetnunc2000</a> or <a href="https://discord.gg/jKNy6PynPK" target="_blank">join the discord</a> for updates.
      </BottomBanner> */}
    </Page>
  )
}
