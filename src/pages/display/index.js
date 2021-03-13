import React, { Component } from 'react'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { renderMediaType } from '../../components/media-types'
import { walletPreview } from '../../utils/string'
import { SanitiseOBJKT } from '../../utils/sanitise'
import { PATH } from '../../constants'
import styles from './index.module.scss'

const axios = require('axios')

export default class Display extends Component {
  static contextType = HicetnuncContext

  state = {
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

  componentDidMount = async () => {
    this.context.setPath(window.location.pathname)
    const currentWallet = window.location.pathname.split('/')[2]
    console.log('current wallet', currentWallet)
    await axios
      .post(process.env.REACT_APP_TZ, {
        // 3.129.20.231
        tz: currentWallet,
      })
      .then(async (res) => {
        const sanitised = SanitiseOBJKT(res.data.result)

        this.setState({
          objkts: sanitised,
          creations: sanitised.filter(
            (e) => currentWallet === e.token_info.creators[0]
          ),
          collection: sanitised.filter(
            (e) => currentWallet !== e.token_info.creators[0]
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
    const addr = window.location.pathname.split('/')[2]
    return (
      <Page>
        <Container>
          <Padding>
            <div className={styles.profile}>
              <div className={styles.picture} />

              <div className={styles.info}>
                <Button href={`https://tzkt.io/${addr}`}>
                  <Primary>{walletPreview(addr)}</Primary>
                </Button>
                {/* TODO: Move this to API not Context--> this.context.getBalance(addr) */}
                <p>- TEZ</p>
                <p>- ○</p>
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
                return (
                  <Button
                    key={nft.token_id}
                    to={`${PATH.OBJKT}/${nft.token_id}`}
                  >
                    <div className={styles.container}>
                      {renderMediaType(nft.token_info, false)}
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
                return (
                  <Button
                    key={nft.token_id}
                    to={`${PATH.OBJKT}/${nft.token_id}`}
                  >
                    <div className={styles.container}>
                      {renderMediaType(nft.token_info, false)}
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
