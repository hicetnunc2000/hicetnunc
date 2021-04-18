import React, { Component } from 'react'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { renderMediaType } from '../../components/media-types'
import { ArtistSocials } from '../../components/artist-socials'
import { Identicon } from '../../components/identicons'
import { walletPreview } from '../../utils/string'
import { SanitiseOBJKT } from '../../utils/sanitise'
import { PATH } from '../../constants'
import { VisuallyHidden } from '../../components/visually-hidden'
import { GetUserMetadata } from '../../data/api'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import styles from './styles.module.scss'

const axios = require('axios')

const sortByTokenId = (a, b) => {
  return b.token_id - a.token_id
}

export default class Display extends Component {
  static contextType = HicetnuncContext

  state = {
    wallet: window.location.pathname.split('/')[2],
    walletPrev: walletPreview(window.location.pathname.split('/')[2]),
    render: false,
    loading: true,
    results: [],
    objkts: [],
    creations: [],
    collection: [],
    collectionState: false,
    creationsState: true,
    hdao: 0,
  }

  componentWillMount = async () => {
    this.context.setPath(window.location.pathname)

    await GetUserMetadata(this.state.wallet).then((data) => {
      if (data.data.alias) this.setState({ alias: data.data.alias })
      if (data.data.description)
        this.setState({ description: data.data.description })
      if (data.data.site) this.setState({ site: data.data.site })
      if (data.data.twitter) this.setState({ twitter: data.data.twitter })
      if (data.data.github) this.setState({ github: data.data.github })
      if (data.data.reddit) this.setState({ reddit: data.data.reddit })
      if (data.data.instagram) this.setState({ instagram: data.data.instagram })
      if (data.data.logo) this.setState({ logo: data.data.logo })
    })

    await axios
      .get(process.env.REACT_APP_TZ, {
        params: { tz: this.state.wallet },
      })
      .then(async (res) => {
        this.setState({
          hdao: res.data.hdao / 1_000_000,
        })
        const sanitised = SanitiseOBJKT(res.data.result)
        const creations = sanitised.filter(
          (e) => this.state.wallet === e.token_info.creators[0]
        )
        const collection = sanitised.filter(
          (e) => this.state.wallet !== e.token_info.creators[0]
        )

        this.setState({
          creations: creations.sort(sortByTokenId),
          loading: false,
          collection: collection.sort(sortByTokenId),
        })

        /*
        let totalCreations = creations.length
        let total = 0
                 const loadOwners = async (id, index) => {
          const owners = await axios
            .get(
              `https://api.better-call.dev/v1/contract/mainnet/KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/tokens/holders?token_id=${id}`
            )
            .then((res) => res.data)
          // add owners to creations array
          creations[index].owners = [...Object.keys(owners)]
          total++
          // all loaded
          if (total === totalCreations) {
            this.setState({
              objkts: sanitised,
              creations: creations.filter(
                (e) =>
                  e.owners.indexOf('tz1burnburnburnburnburnburnburjAYjjX') ===
                  -1
              ),
              collection: sanitised.filter(
                (e) => this.state.wallet !== e.token_info.creators[0]
              ),
              loading: false,
            })
          }
        }
        // load all owners
        for (let i = 0; i < creations.length; i++) {
          loadOwners(creations[i].token_id, i)
          console.log()
        } */
      })
  }

  creations = () =>
    this.setState({ collectionState: false, creationsState: true })

  collection = () =>
    this.setState({ collectionState: true, creationsState: false })

  render() {
    return (
      <Page title={this.state.wallet}>
        <Container>
          <Padding>
            <div className={styles.profile}>
              <Identicon address={this.state.wallet} logo={this.state.logo} />

              <div className={styles.info}>
                {this.state.alias && (
                  <p>
                    <strong>{this.state.alias}</strong>
                  </p>
                )}
                {this.state.description && <p>{this.state.description}</p>}
                <Button href={`https://tzkt.io/${this.state.wallet}`}>
                  <Primary>{this.state.walletPrev}</Primary>
                </Button>

                <p>{this.state.hdao} ○</p>

                <ArtistSocials
                  site={this.state.site}
                  twitter={this.state.twitter}
                  instagram={this.state.instagram}
                  github={this.state.github}
                  reddit={this.state.reddit}
                />
              </div>
            </div>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <p>
              <strong>OBJKTs</strong>
            </p>
            <div className={styles.menu}>
              <Button onClick={this.creations}>
                <Primary selected={this.state.creationsState}>
                  creations
                </Primary>
              </Button>

              <Button onClick={this.collection}>
                <Primary selected={this.state.collectionState}>
                  collection
                </Primary>
              </Button>
            </div>
          </Padding>
        </Container>

        {this.state.loading && (
          <Container>
            <Padding>
              <Loading />
            </Padding>
          </Container>
        )}

        {this.state.creationsState && (
          <Container xlarge>
            <ResponsiveMasonry>
              {this.state.creations.map((nft, i) => {
                const { mimeType, uri } = nft.token_info.formats[0]

                return (
                  <Button
                    key={nft.token_id}
                    to={`${PATH.OBJKT}/${nft.token_id}`}
                  >
                    <div className={styles.container}>
                      {renderMediaType({
                        mimeType,
                        uri: uri.split('//')[1],
                        metadata: nft,
                      })}
                      <div className={styles.number}>OBJKT#{nft.token_id}</div>
                    </div>
                  </Button>
                )
              })}
            </ResponsiveMasonry>
          </Container>
        )}

        {this.state.collectionState && (
          <Container xlarge>
            <ResponsiveMasonry>
              {this.state.collection.map((nft, i) => {
                const { mimeType, uri } = nft.token_info.formats[0]
                return (
                  <Button
                    key={nft.token_id}
                    to={`${PATH.OBJKT}/${nft.token_id}`}
                  >
                    <div className={styles.container}>
                      {renderMediaType({
                        mimeType,
                        uri: uri.split('//')[1],
                        metadata: nft,
                      })}
                      <div className={styles.number}>OBJKT#{nft.token_id}</div>
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
