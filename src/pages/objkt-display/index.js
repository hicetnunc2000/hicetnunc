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
import { Info, Owners, Swap, Cancel, Burn } from './tabs'
const _ = require('lodash')

const TABS = [
  { title: 'info', component: Info },
  { title: 'owners', component: Owners },
  { title: 'swap', component: Swap, private: true },
  { title: 'cancel', component: Cancel, private: true },
  { title: 'burn', component: Burn, private: true },
]

export const ObjktDisplay = () => {
  const { id } = useParams()
  const { address, acc, setAccount } = useContext(HicetnuncContext)

  const [loading, setLoading] = useState(true)
  const [tabIndex, setTabIndex] = useState(0)
  const [nft, setNFT] = useState()
  const [owners, setOwners] = useState(null)
  const [creator, setCreator] = useState(null)


  useEffect(() => {
    GetOBJKT({ id }).then(async (objkt) => {
      await setAccount()
      
      setNFT(objkt)
      setOwners(objkt.owners)
      
      try {
        setCreator(objkt.token_info.creators[0])
      } catch (e) {

      }
      setLoading(false)

    })
  }, [id])

  const Tab = TABS[tabIndex].component

  return (
    <Page>
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
                {TABS.filter(
                  (e) => !e.private || _.keys(owners).includes(address) || address == creator
                ).map(({ title }, index) => (
                  <Button key={title} onClick={() => setTabIndex(index)}>
                    <Primary selected={tabIndex === index}>{title}</Primary>
                  </Button>
                ))}
              </Menu>
            </Padding>
          </Container>

          <Tab {...nft} address={address} />
        </>
      )}
    </Page>
  )
}
