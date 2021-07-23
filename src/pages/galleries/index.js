import { useEffect, useState } from 'react'
import { Button } from '../../components/button'
import { Page, Container, Padding } from '../../components/layout'
import { GetOBJKT } from '../../data/api'
import { renderMediaType } from '../../components/media-types'
import { PATH } from '../../constants'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import { BottomBanner } from '../../components/bottom-banner'
import styles from './styles.module.scss'

const sortByThumbnailTokenId = (a, b) => {
  const ia = parseInt(a.thumbnail)
  const ib = parseInt(b.thumbnail)
  return ia < ib ? 1 : -1
}
export const Galleries = () => {
  const [data, setData] = useState([])

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

            if (c === galleries.length) {
              g.sort(sortByThumbnailTokenId)
              setData(g)
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
      <Container xlarge>
        <Padding>
          <ResponsiveMasonry>
            {data.map((e) => {
              const { token_info } = e
              return (
                <Button key={e.uid} to={`${PATH.GALLERY}/${e.uid}`}>
                  <div className={styles.item}>
                    {renderMediaType({
                      mimeType: token_info.formats[0].mimeType,
                      artifactUri: token_info.artifactUri,
                      displayUri: token_info.displayUri,
                      creator: token_info.creators[0],
                      objkt: e.token_id,
                      interactive: false,
                      displayView: true
                    })}
                    <div className={styles.number}>{e.name}</div>
                  </div>
                </Button>
              )
            })}
          </ResponsiveMasonry>
        </Padding>
      </Container>
{/*       <BottomBanner>
        Collecting has been temporarily disabled. Follow <a href="https://twitter.com/hicetnunc2000" target="_blank">@hicetnunc2000</a> or <a href="https://discord.gg/jKNy6PynPK" target="_blank">join the discord</a> for updates.
      </BottomBanner> */}
    </Page>
  )
}
