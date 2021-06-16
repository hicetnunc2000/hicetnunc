/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { getWalletBlockList } from '../../constants'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'
import { Page, Container, Padding } from '../../components/layout'
import { renderMediaType } from '../../components/media-types'
import { ItemInfo } from '../../components/item-info'
import { Menu } from '../../components/menu'
import { Info, Collectors, Swap, Burn } from './tabs'
import styles from './styles.module.scss'

const axios = require('axios')

const TABS = [
  { title: 'info', component: Info }, // public tab
  { title: 'collectors', component: Collectors }, // public tab
  { title: 'swap', component: Swap, private: true }, // private tab (users only see if they are the creators or own a copy)
  { title: 'burn', component: Burn, private: true }, // private tab (users only see if they are the creators or own a copy)
]

export const ObjktDisplay = () => {
  const { id } = useParams()
  const context = useContext(HicetnuncContext)

  const [loading, setLoading] = useState(true)
  const [tabIndex, setTabIndex] = useState(0)
  const [nft, setNFT] = useState()
  const [error, setError] = useState(false)

  const address = context.acc?.address

  useEffect(async () => {
    //await axios.post(process.env.REACT_APP_GRAPHQL_OBJKT, { id : id }).then(res => console.log(res.data))
    await axios
      .post(process.env.REACT_APP_GRAPHQL_OBJKT, { id: id })
      .then(async (res) => {
        await context.setAccount()

        if (getWalletBlockList().includes(res.data.creator.address)) {
          setError('Object is restricted and/or from a copyminter')
        } else {
          setNFT(res.data)
        }
        setLoading(false)
      })
    /*     GetOBJKT({ id })
      .then(async (objkt) => {
        if (Array.isArray(objkt)) {
          setError(
            "There's a problem loading this OBJKT. Please report it on Github."
          )
          setLoading(false)
        } else {
          await context.setAccount()
          setNFT(objkt)

          setLoading(false)
        }
      })
      .catch((e) => {
        if (e.response && e.response.data.error) {
          setError(
            `(http ${e.response.data.error.http_status}) ${e.response.data.error.message}`
          )
        } else if (e.response && e.response.data) {
          setError(`(http ${e.response.status}) ${e.response.data}`)
        } else if (e.request) {
          setError(
            `There's a problem loading this OBJKT. Please report it on Github. ${e.message}`
          )
        } else {
          setError(
            `There's a problem loading this OBJKT. Please report it on Github. ${e}`
          )
        }
        setLoading(false)
      }) */
  }, [])

  const Tab = TABS[tabIndex].component

  return (
    <Page title={nft?.name}>
      {loading && (
        <Container>
          <Padding>
            <Loading />
          </Padding>
        </Container>
      )}

      {error && (
        <Container>
          <Padding>
            <p>{error}</p>
          </Padding>
          <Padding>
            <Button href="https://github.com/hicetnunc2000/hicetnunc/issues">
              <Primary>
                <strong>Report</strong>
              </Primary>
            </Button>
          </Padding>
        </Container>
      )}

      {!loading && (
        <>
          <div className={styles.container}>
            <div className={styles.image}>
              {renderMediaType({
                mimeType: nft.mime,
                artifactUri: nft.artifact_uri,
                displayUri: nft.display_uri,
                creator: nft.creator,
                interactive: true,
              })}
            </div>
            <div className={styles.info}>
              <Container>
                <Padding>
                  <ItemInfo {...nft} isDetailView />
                </Padding>
              </Container>

              <Container>
                <Padding>
                  <Menu>
                    {TABS.map((tab, index) => {
                      // if nft.owners exist and this is a private route, try to hide the tab.
                      // if nft.owners fails, always show route!
                      if (nft?.token_holders && tab.private) {
                        let holders_arr = nft.token_holders.map(
                          (e) => e.holder_id
                        )

                        if (
                          holders_arr.includes(address) === false &&
                          nft.creator.address !== address
                        ) {
                          // user is not the creator now owns a copy of the object. hide

                          return null
                        }
                      }

                      return (
                        <Button
                          key={tab.title}
                          onClick={() => setTabIndex(index)}
                        >
                          <Primary selected={tabIndex === index}>
                            {tab.title}
                          </Primary>
                        </Button>
                      )
                    })}
                  </Menu>
                </Padding>
              </Container>

              <Tab {...nft} address={address} />
            </div>
          </div>
        </>
      )}
    </Page>
  )
}
