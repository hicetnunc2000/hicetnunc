import React, { Component } from 'react'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { renderMediaType } from '../../components/media-types'
import { walletPreview } from '../../utils/string'
import { PATH } from '../../constants'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import styles from './styles.module.scss'

const axios = require('axios')
const fetch = require('node-fetch')

const sortByTokenId = (a, b) => {
  return b.id - a.id
}


const query_collection = `
  query collectorGallery($address: String!) {
    hic_et_nunc_token(where: {trades: {buyer: {address: {_eq: $address}}}}) {
      id
      artifact_uri
      thumbnail_uri
      timestamp
      mime
      title
      description
      supply
      token_tags {
        tag {
          tag
        }
      }
    }
  }
`;

async function fetchCollectionGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "https://api.hicdex.com/v1/graphql",
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

async function fetchCollection(addr) {
  const { errors, data } = await fetchCollectionGraphQL(query_collection, "collectorGallery", { "address": addr });
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
  console.log({ result })
  return result
}

export default class Frens extends Component {
  static contextType = HicetnuncContext

  state = {
    wallet: '',
    walletPrev:
      window.location.pathname.split('/')[1] === 'tz'
        ? walletPreview(window.location.pathname.split('/')[2])
        : window.location.pathname.split('/')[1],
    subjkt: '',
    render: false,
    loading: true,
    results: [],
    objkts: [],
    collection: [],
    market: [],
    collectionState: true,
    hdao: 0,
    frens: []
  }

  componentWillMount = async () => {
    const id = window.location.pathname.split('/')[1]
    if (id === 'tz') {
      const wallet = window.location.pathname.split('/')[2]
      this.setState({
        wallet,
        walletPreview: walletPreview(wallet),
      })

      this.onReady()
    } else {
      await axios
        .post(process.env.REACT_APP_SUBJKT, {
          subjkt: id,
        })
        .then((res) => {
          if (res.data.result.length === 0) {
            // if alias is not found, redirect to homepage
            this.props.history.push('/')
          } else {
            this.setState({
              wallet: res.data.result[0].tz,
              walletPrev: id,
              subjkt: id,
            })

            this.onReady()
          }
        })


    }

    console.log(window.location.pathname.split('/'))

  }

  // called if there's no redirect
  onReady = async () => {
    this.context.setPath(window.location.pathname)

    // based on route, define initial state
    if (this.state.subjkt !== '') {
      // if alias route
      if (window.location.pathname.split('/')[2] === 'collection') {
        this.setState({
          collectionState: true,
          marketState: false,
        })
      }
    } else {
      // if tz/wallethash route
      if (window.location.pathname.split('/')[3] === 'collection') {
        this.setState({
          collectionState: true,
          marketState: false,
        })
      }
    }

    let addr = ''

    if (window.location.pathname.split('/')[1] === 'tz') {
      addr = window.location.pathname.split('/')[2]
    } else {
      addr = await axios.post(process.env.REACT_APP_SUBJKT, { subjkt : window.location.pathname.split('/')[1]}).then(res => res.data.result[0].tz)
      console.log(addr)
    }

    const collection = await fetchCollection(addr)
    console.log(collection)

    this.setState({
      loading: false,
      collection: collection,
    })

  }

  collection = () => {
    this.setState({
      collectionState: true,
      marketState: false,
    })

    if (this.state.subjkt !== '') {
      // if alias route
      this.props.history.push(`/${this.state.subjkt}/collection`)
    } else {
      // if tz/wallethash route
      this.props.history.push(`/tz/${this.state.wallet}/collection`)
    }
  }

  render() {
    return (
      <Page title={this.state.alias}>
        {this.state.loading && (
          <Container>
            <Padding>
              <Loading />
            </Padding>
          </Container>
        )}

        {!this.state.loading && this.state.collectionState && (
          <Container xlarge>
            <ResponsiveMasonry>
              {this.state.collection.map((nft, i) => {
                const mimeType = nft.mime
                const uri = nft.artifact_uri
                return (
                  <Button
                    key={nft.id}
                    to={`${PATH.OBJKT}/${nft.id}`}
                  >
                    <div className={styles.container}>
                      {renderMediaType({
                        mimeType,
                        uri: uri.split('//')[1],
                        metadata: nft,
                      })}
                    </div>
                  </Button>
                )
              })}
            </ResponsiveMasonry>
          </Container>
        )}

        {!this.state.loading && this.state.marketState && (
          <>
            {Object.keys(this.state.market).length === 0 && (
              <Container>
                <Padding>
                  <p>
                    You currently don't have any OBJKT on the market.
                  </p>
                </Padding>
              </Container>
            )}
            {Object.keys(this.state.market).map((key) => {
              return (
                <Container key={key}>
                  <Padding>
                    <Button to={`${PATH.OBJKT}/${key}`}>
                      <Primary>
                        <strong>OBJKT#{key}</strong>
                      </Primary>
                    </Button>
                  </Padding>
                </Container>
              )
            })}
          </>
        )}
      </Page>
    )
  }
}
