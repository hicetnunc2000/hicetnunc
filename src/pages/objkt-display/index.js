/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { GetOBJKT } from '../../data/api'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'
import { Page, Container, Padding } from '../../components/layout'
import { renderMediaType } from '../../components/media-types'
import { ItemInfo } from '../../components/item-info'
import { Menu } from '../../components/menu'
import { Info, Collectors, Swap, Burn } from './tabs'
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

    await axios.post(process.env.REACT_APP_GRAPHQL_OBJKT, { id : id }).then(res => console.log(res.data))
    GetOBJKT({ id })
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
      })
  }, [])

  const Tab = TABS[tabIndex].component

  return (
    <Page title={nft?.token_info.name}>
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

      {!loading && !error && (
        <>
          <Container>
            {nft.token_id &&
              renderMediaType({
                mimeType: nft.token_info.formats[0].mimeType,
                uri: nft.token_info.formats[0].uri.split('//')[1],
                interactive: true,
                metadata: nft,
              })}
          </Container>

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
                  if (nft?.owners && tab.private) {
                    console.log(
                      Object.keys(nft.owners).includes(address),
                      nft.token_info.creators.includes(address),
                      'valid',
                      Object.keys(nft.owners).includes(address) ||
                        nft.token_info.creators.includes(address)
                    )
                    if (
                      Object.keys(nft.owners).includes(address) === false &&
                      nft.token_info.creators.includes(address) === false
                    ) {
                      // user is not the creator now owns a copy of the object. hide

                      return null
                    }
                  }

                  return (
                    <Button key={tab.title} onClick={() => setTabIndex(index)}>
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
        </>
      )}
    </Page>
  )
}
