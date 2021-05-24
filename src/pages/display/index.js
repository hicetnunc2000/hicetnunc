import React, { Component } from 'react'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { renderMediaType } from '../../components/media-types'
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
    creations: [],
    collection: [],
    market: [],
    creationsState: true,
    collectionState: false,
    marketState: false,
    hdao: 0,
  }

  componentWillMount = async () => {
    if (window.location.pathname.split('/')[1] === 'tz') {
      this.setState({
        wallet: window.location.pathname.split('/')[2],
        walletPreview: walletPreview(window.location.pathname.split('/')[2]),
      })

      await GetUserMetadata(window.location.pathname.split('/')[2]).then(
        (data) => {
          if (data.data.alias) this.setState({ alias: data.data.alias })
          if (data.data.description)
            this.setState({ description: data.data.description })
          if (data.data.site) this.setState({ site: data.data.site })
          if (data.data.telegram)
            this.setState({ telegram: data.data.telegram })
          if (data.data.twitter) this.setState({ twitter: data.data.twitter })
          if (data.data.github) this.setState({ github: data.data.github })
          if (data.data.reddit) this.setState({ reddit: data.data.reddit })
          if (data.data.instagram)
            this.setState({ instagram: data.data.instagram })
          if (data.data.logo) this.setState({ logo: data.data.logo })
        }
      )
    } else {
      await axios
        .post(process.env.REACT_APP_SUBJKT, {
          subjkt: window.location.pathname.split('/')[1],
        })
        .then((res) => {
          this.setState({
            wallet: res.data.result[0].tz,
            walletPrev: window.location.pathname.split('/')[1],
            subjkt: window.location.pathname.split('/')[1],
          })
        })
    }

    this.context.setPath(window.location.pathname)
    /*     if (window.location.pathname.split('/')[3] === 'creations') {
      this.setState({
        creationsState: true,
        collectionState: false,
        marketState: false,
      })
    } else if (window.location.pathname.split('/')[3] === 'collection') {
      this.setState({
        creationsState: false,
        collectionState: true,
        marketState: false,
      })
    } else if (window.location.pathname.split('/')[3] === 'market') {
      this.setState({
        creationsState: false,
        collectionState: false,
        marketState: true,
      })
    } */

/*     await axios.get('http://localhost:3002/tz_owner', { params : { tz : this.state.wallet }}).then(res => console.log(res.data))
    await axios.get('http://localhost:3002/tz_creator', { params : this.state.wallet }).then(res => console.log(res.data)) */
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
          (e) => {
            console.log(e)

            return (this.state.wallet === e.token_info.creators[0])/*  && (e.action !== 'Received') */}
        )
        const collection = sanitised.filter(
          (e) => this.state.wallet !== e.token_info.creators[0]
        )

        const market = {}

        // filter market that were created by the user
        Object.keys(res.data.swaps).forEach((e) => {
          // all swaps include swaps on OBJKT you purchased and OBJKT you minted.
          // setting it to false will only display OBJKT that you purchased and put up for sale
          // but will NOT include your own art.
          const allSwaps = true

          if (allSwaps) {
            market[e] = res.data.swaps[e]
          } else {
            const id = Number(e)
            const found = sanitised.find((e) => {
              return e.token_id === id
            })
            if (!found) {
              market[e] = res.data.swaps[e]
            }
          }
        })

        this.setState({
          creations: creations.sort(sortByTokenId),
          loading: false,
          collection: collection.sort(sortByTokenId),
          market,
        })
      })
  }

  creations = () => {
    this.setState({
      creationsState: true,
      collectionState: false,
      marketState: false,
    })
    //this.props.history.push(`/tz/${this.state.wallet}`)
  }

  collection = () => {
    this.setState({
      creationsState: false,
      collectionState: true,
      marketState: false,
    })
    //this.props.history.push(`/tz/${this.state.wallet}/collection`)
  }

  market = () => {
    this.setState({
      creationsState: false,
      collectionState: false,
      marketState: true,
    })
    //this.props.history.push(`/tz/${this.state.wallet}/market`)
  }

  render() {
    return (
      <Page title={this.state.alias}>
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

                <div>
                  {this.state.site && (
                    <Button href={this.state.site}>
                      <VisuallyHidden>{this.state.site}</VisuallyHidden>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        style={{
                          fill: 'var(--text-color)',
                          stroke: 'transparent',
                          marginRight: '10px',
                        }}
                      >
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
                      </svg>
                    </Button>
                  )}
                  {this.state.telegram && (
                    <Button href={`https://t.me/${this.state.telegram}`}>
                      <VisuallyHidden>{`https://t.me/${this.state.telegram}`}</VisuallyHidden>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        style={{
                          fill: 'var(--text-color)',
                          stroke: 'transparent',
                          marginRight: '10px',
                        }}
                      >
                        <path d="M9.78,18.65L10.06,14.42L17.74,7.5C18.08,7.19 17.67,7.04 17.22,7.31L7.74,13.3L3.64,12C2.76,11.75 2.75,11.14 3.84,10.7L19.81,4.54C20.54,4.21 21.24,4.72 20.96,5.84L18.24,18.65C18.05,19.56 17.5,19.78 16.74,19.36L12.6,16.3L10.61,18.23C10.38,18.46 10.19,18.65 9.78,18.65Z"></path>
                      </svg>
                    </Button>
                  )}
                  {this.state.twitter && (
                    <Button href={`https://twitter.com/${this.state.twitter}`}>
                      <VisuallyHidden>{`https://twitter.com/${this.state.twitter}`}</VisuallyHidden>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        style={{
                          fill: 'var(--text-color)',
                          stroke: 'transparent',
                          marginRight: '10px',
                        }}
                      >
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                      </svg>
                    </Button>
                  )}
                  {this.state.instagram && (
                    <Button
                      href={`https://instagram.com/${this.state.instagram}`}
                    >
                      <VisuallyHidden>{`https://instagram.com/${this.state.instagram}`}</VisuallyHidden>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        style={{
                          fill: 'var(--text-color)',
                          stroke: 'transparent',
                          marginRight: '10px',
                        }}
                      >
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                      </svg>
                    </Button>
                  )}
                  {this.state.github && (
                    <Button href={`https://github.com/${this.state.github}`}>
                      <VisuallyHidden>{`https://github.com/${this.state.github}`}</VisuallyHidden>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        style={{
                          fill: 'var(--text-color)',
                          stroke: 'transparent',
                          marginRight: '10px',
                        }}
                      >
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                    </Button>
                  )}
                  {this.state.reddit && (
                    <Button href={`https://reddit.com/${this.state.reddit}`}>
                      <VisuallyHidden>{`https://reddit.com/${this.state.reddit}`}</VisuallyHidden>
                      <svg
                        height="16"
                        viewBox="0 0 512 512"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          fill: 'var(--text-color)',
                          stroke: 'transparent',
                          marginRight: '10px',
                        }}
                      >
                        <path d="m309.605469 343.347656c-11.46875 11.46875-36.042969 15.5625-53.554688 15.5625-17.5625 0-42.085937-4.09375-53.554687-15.5625-2.714844-2.714844-7.066406-2.714844-9.777344 0-2.714844 2.714844-2.714844 7.066406 0 9.777344 18.175781 18.175781 53.09375 19.609375 63.332031 19.609375s45.105469-1.433594 63.335938-19.609375c2.660156-2.714844 2.660156-7.066406 0-9.777344-2.714844-2.714844-7.066407-2.714844-9.78125 0zm0 0" />
                        <path d="m224 282.675781c0-14.695312-11.980469-26.675781-26.675781-26.675781-14.691407 0-26.675781 11.980469-26.675781 26.675781 0 14.691407 11.984374 26.675781 26.675781 26.675781 14.695312 0 26.675781-11.980468 26.675781-26.675781zm0 0" />
                        <path d="m256 0c-141.363281 0-256 114.636719-256 256s114.636719 256 256 256 256-114.636719 256-256-114.636719-256-256-256zm148.53125 290.148438c.5625 3.6875.871094 7.425781.871094 11.214843 0 57.445313-66.867188 103.988281-149.351563 103.988281s-149.351562-46.542968-149.351562-103.988281c0-3.839843.308593-7.628906.871093-11.316406-13.003906-5.835937-22.066406-18.890625-22.066406-34.046875 0-20.582031 16.691406-37.324219 37.324219-37.324219 10.035156 0 19.097656 3.941407 25.804687 10.394531 25.90625-18.6875 61.75-30.621093 101.632813-31.644531 0-.511719 18.636719-89.292969 18.636719-89.292969.359375-1.738281 1.382812-3.226562 2.867187-4.195312 1.484375-.972656 3.277344-1.28125 5.019531-.921875l62.054688 13.207031c4.351562-8.804687 13.308594-14.898437 23.804688-14.898437 14.746093 0 26.675781 11.929687 26.675781 26.675781s-11.929688 26.675781-26.675781 26.675781c-14.285157 0-25.855469-11.265625-26.519532-25.394531l-55.554687-11.828125-16.996094 80.027344c39.167969 1.378906 74.34375 13.257812 99.839844 31.691406 6.707031-6.5 15.820312-10.496094 25.90625-10.496094 20.636719 0 37.324219 16.691407 37.324219 37.324219 0 15.257812-9.164063 28.3125-22.117188 34.148438zm0 0" />
                        <path d="m314.675781 256c-14.695312 0-26.675781 11.980469-26.675781 26.675781 0 14.691407 11.980469 26.675781 26.675781 26.675781 14.691407 0 26.675781-11.984374 26.675781-26.675781 0-14.695312-11.980468-26.675781-26.675781-26.675781zm0 0" />
                      </svg>
                    </Button>
                  )}
                </div>
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

              {/* <Button onClick={this.market}>
                <Primary selected={this.state.marketState}>market</Primary>
              </Button> */}
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

        {!this.state.loading && this.state.creationsState && (
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
                      {/* hover objkt info */}

                      {/* <div className={styles.number}>OBJKT#{nft.token_id}</div> */}
                    </div>
                  </Button>
                )
              })}
            </ResponsiveMasonry>
          </Container>
        )}

        {!this.state.loading && this.state.collectionState && (
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
                      {/* <div className={styles.number}>OBJKT#{nft.token_id}</div> */}
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
                    You currently don't have any OBJKT on the secondary market.
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
