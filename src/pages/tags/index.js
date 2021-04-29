import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Button } from '../../components/button'
import { GetTags } from '../../data/api'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import { Loading } from '../../components/loading'
import { renderMediaType } from '../../components/media-types'
import { Page, Container, Padding } from '../../components/layout'
import { PATH } from '../../constants'
import styles from './styles.module.scss'

export const Tags = () => {
  const { id } = useParams()
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState()

  useEffect(() => {
    GetTags({ tag: id }).then((e) => {
      console.log('data is', e)
      setData(e)
      setLoaded(true)
    })
  }, [id])

  return (
    <Page title={`Tag ${id}`}>
      {!loaded ? (
        <Container>
          <Padding>
            <Loading />
          </Padding>
        </Container>
      ) : (
        <div className={styles.container}>
          <Container xlarge>
            <ResponsiveMasonry>
              {data.map((nft) => {
                const { mimeType, uri } = nft.formats[0]

                return (
                  <Button
                    key={nft.token_id}
                    to={`${PATH.OBJKT}/${nft.token_id}`}
                  >
                    <div className={styles.container}>
                      {renderMediaType({
                        mimeType,
                        uri: uri.split('//')[1],
                        metadata: nft,
                      })}
                      <div className={styles.number}>OBJKT#{nft.token_id}</div>
                    </div>
                  </Button>
                )
              })}
            </ResponsiveMasonry>
          </Container>
        </div>
      )}
    </Page>
  )
}
