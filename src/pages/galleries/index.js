import { useEffect, useState } from 'react'
import { Button } from '../../components/button'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { GetOBJKT } from '../../data/api'
import { renderMediaType } from '../../components/media-types'
import { PATH } from '../../constants'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import styles from './styles.module.scss'

const sortByThumbnailTokenId = (a, b) => {
  const ia = parseInt(a.thumbnail)
  const ib = parseInt(b.thumbnail)
  return ia < ib ? 1 : -1
}
export const Galleries = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(false)

  useEffect(() => {
    // loads gallery to check endpoint file
    fetch('/galleries/galleries.json')
      .then((e) => e.json())
      .then(async (galleries) => {
        const g = []
        let c = 0
        galleries.forEach(async (element) => {
          await GetOBJKT({ id: element.thumbnail }).then((e) => {
            const found = galleries.find((e) => e.uid === element.uid)
            g.push(Object.assign({}, found, e))
            c++

            if (c === 3) {
              g.sort(sortByThumbnailTokenId)
              setData(g)
              setLoading(false)
            }
          })
        })
      })

    return () => {
      document.body.style = {}
    }
  }, [])
  return (
    <Page title="Galleries">
      {loading ? (
        <Container>
          <Padding>
            <Loading />
          </Padding>
        </Container>
      ) : (
        <Container xlarge>
          <Padding>
            <ResponsiveMasonry>
              {data.map((e) => {
                const { token_info } = e
                const { mimeType, uri } = token_info.formats[0]

                return (
                  <Button key={e.uid} to={`${PATH.GALLERY}/${e.uid}`}>
                    <div className={styles.item}>
                      <div
                        style={{ pointerEvents: 'none' }}
                        className={styles.image}
                      >
                        {renderMediaType({
                          uri: uri.split('//')[1],
                          mimeType,
                          metadata: e,
                          interactive: false,
                        })}
                        <div className={styles.number}>{e.name}</div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </ResponsiveMasonry>
          </Padding>
        </Container>
      )}
    </Page>
  )
}
