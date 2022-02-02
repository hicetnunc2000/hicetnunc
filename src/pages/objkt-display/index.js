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
import { Info, Collectors, Swap, Burn, History } from './tabs'
import styles from './styles.module.scss'
import './style.css'
import { Transfer } from '../../components/collab/show/Transfer'

const axios = require('axios')

const TABS = [
  { title: 'info', component: Info }, // public tab
  { title: 'listings', component: Collectors }, // public tab
  { title: 'history', component: History },
  { title: 'swap', component: Swap, private: true, restricted: true }, // private tab (users only see if they are the creators or own a copy)
  { title: 'burn', component: Burn, private: true }, // private tab (users only see if they are the creators or own a copy)
  { title: 'transfer', component: Transfer, private: true }, // private tab (users only see if they are the creators or own a copy)
]

const query_objkt = `
query objkt($id: bigint!) {
  hic_et_nunc_token_by_pk(id: $id) {
id
mime
timestamp
display_uri
description
artifact_uri
is_signed
metadata
creator {
  address
  name
  is_split
  shares {
    administrator
    shareholder {
      holder_type
      holder_id
      holder {
        name
        address
      }
    }
  }
}
token_signatures {
  holder_id
}
thumbnail_uri
title
supply
royalties
swaps {
  amount
  amount_left
  id
  price
  timestamp
  creator {
    address
    name
  }
  contract_version
  status
  royalties
  creator_id
  is_valid
}
token_holders(where: {quantity: {_gt: "0"}}) {
  holder_id
  quantity
  holder {
    name
  }
}
token_tags {
  tag {
    tag
  }
}
trades(order_by: {timestamp: asc}) {
  amount
  swap {
    price
  }
  
  seller {
    address
    name
  }
  buyer {
    address
    name
  }
  timestamp
}
}
}
`

async function fetchObjkt(id) {

  const { errors, data } = await fetchGraphQL(query_objkt, 'objkt', { id })
  if (errors) {
    console.error(errors)
  }

  console.log(errors, data)

  const result = data.hic_et_nunc_token_by_pk
  console.log(result)
  return result

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

export const ObjktDisplay = () => {
  const { id } = useParams()
  const context = useContext(HicetnuncContext)

  const [loading, setLoading] = useState(true)
  const [tabIndex, setTabIndex] = useState(0)
  const [nft, setNFT] = useState()
  const [error] = useState(false)
  const [restricted, setRestricted] = useState(false)

  const address = context.acc?.address
  const proxy = context.getProxy()
  const getRestrictedAddresses = async () =>
    await axios
      .get(
        'https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json'
      )
      .then((res) => res.data)
  useEffect(async () => {
    let objkt = await fetchObjkt(id)

    await context.setAccount()

    if (getWalletBlockList().includes(objkt.creator.address)) {
      setRestricted(true)
      objkt.restricted = true
      setNFT(objkt)
    } else {
      objkt.ban = await getRestrictedAddresses()
      objkt.restricted = false
      // filter swaps from banned account
      if (objkt.swaps && objkt.ban) objkt.swaps = objkt.swaps.filter(s => (s.status > 0 || !objkt.ban.includes(s.creator_id)))
      setNFT(objkt)
    }
    setLoading(false)
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
    <Page title={nft?.title}>
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
        !context.progress ?
          <>
            <Container>
              <Padding>
                {restricted && (
                  <div style={{ color: 'white', background: 'black', textAlign: 'center' }}>
                    restricted OBJKT
                  </div>
                )}
              </Padding>
            </Container>
            <div
              style={{
                position: 'relative',
                display: 'block',
                width: '100%'
              }}
              className="objkt-display">
              <div className={
                nft.mime === 'application/x-directory' || nft.mime === 'image/svg+xml' ? 'objktview-zipembed objktview ' + styles.objktview :
                  [(
                    nft.mime === 'video/mp4' ||
                      nft.mime === 'video/ogv' ||
                      nft.mime === 'video/quicktime' ||
                      nft.mime === 'video/webm' ||
                      nft.mime === 'application/pdf' ? 'no-fullscreen' : 'objktview ' + styles.objktview
                  )]
              }>
                {renderMediaType({
                  mimeType: nft.mime,
                  artifactUri: nft.artifact_uri,
                  displayUri: nft.display_uri,
                  creator: nft.creator,
                  objkt: nft.id,
                  interactive: true,
                  displayView: false
                })}
              </div>
              <div>
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

                        if (nft?.restricted && tab.restricted) {
                          return null
                        }

                        if (nft?.token_holders && tab.private) {
                          let holders_arr = nft.token_holders.map(
                            (e) => e.holder_id
                          )

                          if (
                            holders_arr.includes(address) === false &&
                            nft.creator.address !== address &&
                            nft.creator.address !== proxy
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
          :
          <Container>
            <Padding>
              <div>
                <p style={{
                  position: 'absolute',
                  left: '46%',
                  top: '45%',
                }}>{context.message}</p>
                {context.progress && <Loading />}
              </div>
            </Padding>
          </Container>
      )}
      <div style={{ height: '40px' }}></div>
    </Page>
  )
}
