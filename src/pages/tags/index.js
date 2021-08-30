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

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    process.env.REACT_APP_GRAPHQL_API,
    {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );
  return await result.json();
}

async function fetchTag(tag) {
  const { errors, data } = await fetchGraphQL(`query ObjktsByTag($tag: String = "3d", $lastId: bigint = 99999999) {
    hic_et_nunc_token(where: {token_tags: {tag: {tag: {_eq: $tag}}}, id: {_lt: $lastId}, supply: {_gt: "0"}}, order_by: {id: desc}) {
      id
      artifact_uri
      display_uri
      mime
      creator {
        address
        name
      }
    }
  }`,
    'ObjktsByTag',
    { tag: tag }
  )

  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}
export const Tags = () => {
  const { id } = useParams()
  const [error, setError] = useState(false)
  const [items, setItems] = useState([])
  const [feed, setFeed] = useState([])
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = () => {
    console.log(items.slice(count + 25, count + 50))
    setFeed([...feed, ...items.slice(count + 25, count + 50)])
    setCount(count + 25)
  }

  useEffect(async () => {
    let arr = await fetchTag(id)
    setItems(arr)
    setFeed(arr.slice(0, 25))
  }, [])

  return (
    <Page title={`Tag ${id}`}>
      <div className="tag-view">
        <InfiniteScroll
          dataLength={feed.length}
          next={loadMore}
          hasMore={hasMore}
          loader={undefined}
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
        {/*         <BottomBanner>
                v2 migration: All OBJKTs listed on market before June 28th must be relisted on market due smart contract migration. managed assets > v1 swaps > batch cancel > relist.
        </BottomBanner> */}
      </div>
    </Page>
  )
}
