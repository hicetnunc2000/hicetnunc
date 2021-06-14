import React, { Component } from 'react'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { renderMediaType } from '../../components/media-types'
import { Identicon } from '../../components/identicons'
import { walletPreview } from '../../utils/string'
import { SanitiseOBJKT, SanitizeDipDup } from '../../utils/sanitise'
import { PATH } from '../../constants'
import { VisuallyHidden } from '../../components/visually-hidden'
import { GetUserMetadata } from '../../data/api'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import styles from './styles.module.scss'

const axios = require('axios')
const fetch = require('node-fetch')

const query_creations = `
query creatorGallery($address: String!) {
  hic_et_nunc_token(where: {creator: {address: {_eq: $address}}, supply: {_gt: 0}}, order_by: {id: desc}) {
    id
    artifact_uri
    display_uri
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

async function fetchCreationsGraphQL(operationsDoc, operationName, variables) {
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
  return await result.json()
}

async function fetchCreations(addr) {
  const { errors, data } = await fetchCreationsGraphQL(query_creations, "creatorGallery", { "address": addr });
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
  /* console.log({ result }) */
  return result
}

export default class Display extends Component {
  static contextType = HicetnuncContext

  state = {
    wallet: '',
    render: false,
    loading: true,
    creations: [],
  }

  componentWillMount = async () => {
    const id = window.location.pathname.split('/')[1]
    if (id === 'tz') {
      const wallet = window.location.pathname.split('/')[2]
      this.setState({
        wallet,
      })

      this.onReady()
    } else {
      await axios
        .then((res) => {
          if (res.data.result.length === 0) {
            // if alias is not found, redirect to homepage
            this.props.history.push('/')
          } else {
            this.setState({
              wallet: res.data.result[0].tz,
            })

            this.onReady()
          }
        })
    }
    //console.log(window.location.pathname.split('/'))
  }

  // called if there's no redirect
  onReady = async () => {
    this.context.setPath(window.location.pathname)

    let addr = ''

    if (window.location.pathname.split('/')[1] === 'tz') {
      addr = window.location.pathname.split('/')[2]
    }

    //fetch collection promise, return addresses
    //fetch creations of collection wallet addresses
    const creations = await fetchCreations(addr)
    console.log(creations)

    this.setState({
      creations: creations,
      loading: false,
    })

  }

  render() {
    return (
      <Page title={this.state.alias}>
        <Container>
          <Padding>
            <p>
              <strong>{this.state.wallet}</strong>
            </p>
          </Padding>
        </Container>

        {this.state.loading && (
          <Container>
            <Padding>
              <Loading />
            </Padding>
          </Container>
        )}

        {!this.state.loading && (
          <Container xlarge>
            <ResponsiveMasonry>
              {this.state.creations.map((nft, i) => {
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
      </Page>
    )
  }
}
