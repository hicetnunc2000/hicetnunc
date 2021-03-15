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
import styles from './index.module.scss'
import { GetUserData, GetUserMetadata } from '../../data/api'

const axios = require('axios')

export default class Display extends Component {
  static contextType = HicetnuncContext

  state = {
    wallet: window.location.pathname.split('/')[2],
    walletPrev: walletPreview(window.location.pathname.split('/')[2]),
    render: false,
    balance: 0,
    loading: true,
    results: [],
    objkts: [],
    creations: [],
    collection: [],
    collectionState: false,
    creationsState: true,
  }

  componentWillMount = async () => {
    this.context.setPath(window.location.pathname)
    await GetUserData(this.state.wallet).then(data => {
      if (data.data.alias)
        this.setState({ alias: data.data.alias })
      if (data.data.balance)
        this.setState({ balance: (data.data.balance / 1000000) })
    })

    await GetUserMetadata(this.state.wallet).then(data => {
      if (data.data.description)
        this.setState({ description: data.data.description })
      if (data.data.site)
        this.setState({ site: data.data.site })
      if (data.data.twitter)
        this.setState({ twitter: data.data.twitter })
      if (data.data.github)
        this.setState({ github: data.data.github })
      if (data.data.email)
        this.setState({ email: data.data.email })
    })

    await axios
      .post(process.env.REACT_APP_TZ, {
        // 3.129.20.231
        tz: this.state.wallet,
      })
      .then(async (res) => {
        const sanitised = SanitiseOBJKT(res.data.result)

        this.setState({
          objkts: sanitised,
          creations: sanitised.filter(
            (e) => this.state.wallet === e.token_info.creators[0]
          ),
          collection: sanitised.filter(
            (e) => this.state.wallet !== e.token_info.creators[0]
          ),
          loading: false,
        })
      })
  }

  creations = () =>
    this.setState({ collectionState: false, creationsState: true })

  collection = () =>
    this.setState({ collectionState: true, creationsState: false })

  render() {
    return (
      <Page>
        <Container>
          <Padding>
            <div className={styles.profile}>
              <Identicon address={this.state.wallet} />

              <div className={styles.info}>
                {this.state.alias && <p>{this.state.alias}</p>}
                {this.state.description && <p>{this.state.description}</p>}
                <Button href={`https://tzkt.io/${this.state.wallet}`}>
                  <Primary>{this.state.walletPrev}</Primary>
                </Button>

                <p>{this.state.balance} - ꜩ</p>
                <p>- ○</p>
                {/* TODO: Move this to API not Context--> this.context.getBalance(addr) */}

                <div>
                  {this.state.site &&
                    <a href={this.state.site}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ color: 'black', marginRight: '10px' }}>
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
                      </svg>
                    </a>
                  }
                  {this.state.email &&
                    <a href={"mailto:" + this.state.email}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ color: 'black', marginRight: '10px' }}>
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                      </svg>
                    </a>
                  }
                  {this.state.site &&
                    <a href={"https://twitter.com/" + this.state.twitter}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ color: 'black', marginRight: '10px' }}>
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                      </svg>
                    </a>
                  }
                  {this.state.site &&
                    <a href={"https://github.com/" + this.state.github}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ color: 'black', marginRight: '10px' }}>
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                    </a>
                  }
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
            <div className={styles.list}>
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
                      })}
                      <div className={styles.number}>OBJKT#{nft.token_id}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </Container>
        )}

        {this.state.collectionState && (
          <Container xlarge>
            <div className={styles.list}>
              {this.state.collection.map((nft, i) => {
                const { mimeType, uri } = nft.token_info.formats[0]
                return (
                  <Button
                    key={nft.token_id}
                    to={`${PATH.OBJKT}/${nft.token_id}`}
                  >
                    <div className={styles.container}>
                      {renderMediaType({ mimeType, uri: uri.split('//')[1] })}
                      <div className={styles.number}>OBJKT#{nft.token_id}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </Container>
        )}
      </Page>
    )
  }
}
