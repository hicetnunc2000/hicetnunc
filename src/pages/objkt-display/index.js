/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { GetOBJKT } from '../../data/api'
import { Loading } from '../../components/loading'
import { Page, Container, Padding } from '../../components/layout'
import { renderMediaType } from '../../components/media-types'
import { ItemInfo } from '../../components/item-info'
import { Button, Primary } from '../../components/button'
import { Menu } from '../../components/menu'
import { Info, Collectors, Swap, Burn } from './tabs'

const TABS = [
  { title: 'info', component: Info },
  { title: 'collectors', component: Collectors },
  { title: 'swap', component: Swap, private: true },
  { title: 'burn', component: Burn, private: true },
]

export const ObjktDisplay = () => {
  const { id } = useParams()
  const context = useContext(HicetnuncContext)

  const [loading, setLoading] = useState(true)
  const [tabIndex, setTabIndex] = useState(0)
  const [nft, setNFT] = useState()

  const address = context.acc?.address

  useEffect(() => {
    GetOBJKT({ id }).then(async (objkt) => {
      await context.setAccount()
      setNFT(objkt)

      setLoading(false)
    })
  }, [])

  const Tab = TABS[tabIndex].component

  return (
    <Page title={nft?.token_info.name}>
      {loading && (
        <Container>
          <Loading />
        </Container>
      )}

      {!loading && (
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
                  if (tab.private && nft.token_info.creators[0] !== address) {
                    return null
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
