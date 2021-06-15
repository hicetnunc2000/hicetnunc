/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HicetnuncContext } from '../../context/HicetnuncContext'
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

  const address = context.acc?.address

  useEffect(async () => {
    await axios
      .post(process.env.REACT_APP_GRAPHQL_OBJKT, { id: id })
      .then(async (res) => {
        await context.setAccount()
        setNFT(res.data)
        setLoading(false)
      })
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

      {!loading && (
        <>
          <Container>
            <div
              style={{
                position: 'relative',
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {renderMediaType({
                mimeType: nft.mime,
                artifactUri: nft.artifact_uri,
                displayUri: nft.display_uri,
                creator: nft.creator.address,
                objkt: String(nft.id),
                interactive: true,
              })}
            </div>
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
                  if (nft?.token_holders && tab.private) {
                    let holders_arr = nft.token_holders.map((e) => e.holder_id)

                    if (
                      holders_arr.includes(address) === false &&
                      nft.creator.address !== address
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
