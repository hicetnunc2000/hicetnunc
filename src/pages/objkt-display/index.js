import React, { Component } from 'react'
import { GetOBJKT } from '../../api'
import { Page, Container, Padding } from '../../components/layout'
import { LoadingContainer } from '../../components/loading'
import { Input } from '../../components/input'
import { ItemInfo } from '../../components/item-info'
import { Button, Curate, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { renderMediaType } from '../../components/media-types'
import { walletPreview } from '../../utils/string'
import { SanitiseOBJKT } from '../../utils/sanitise'
import styles from './index.module.scss'

export class ObjktDisplay extends Component {
  static contextType = HicetnuncContext

  state = {
    objkt_id: 0,
    objkt: {},
    balance: 0,
    info: true,
    owners: false,
    curate: false,
    loading: true,
    cancel: false,
    test: false,
    value: 0,
    xtz_per_objkt: 0,
    objkt_amount: 0,
    royalties: 0,
  }

  componentWillMount() {
    GetOBJKT({ objkt_id: window.location.pathname.split('/')[2] }).then(
      (data) => {
        this.setState({
          objkt: data.result[0],
          loading: false,
        })
      }
    )
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () =>
      console.log(this.state)
    )
  }

  amountChange = (e) => {
    const amount = e.target.value
    // TODO: Add validation based on max available OBJK to sell. check render() method
    if (!amount || amount.match(/^\d{1,}(\.\d{0,6})?$/)) {
      this.setState({ tz_per_objkt: amount })
    }
  }

  submitForm = async () => {
    this.context.swap(
      this.state.objkt_amount,
      window.location.pathname.split('/')[2],
      this.state.xtz_per_objkt * 1000000
    )
  }

  collect = () => {
    if (this.context.Tezos == null) {
      alert('sync')
    } else {
      this.context.collect(
        1,
        this.state.objkt.swaps[0].swap_id,
        this.state.objkt.swaps[0].xtz_per_objkt * 1
      )
    }
  }

  info = () =>
    this.setState({
      info: true,
      owners: false,
      curate: false,
      cancel: false,
    })

  owners = () =>
    this.setState({ info: false, owners: true, curate: false, cancel: false })

  curate = () =>
    this.setState({ info: false, owners: false, curate: true, cancel: false })

  cancel = () => this.context.cancel(this.state.objkt.swaps[0].swap_id)

  render() {
    const { loading, info, owners, objkt, curate } = this.state
    const ownersArray =
      (objkt.owners &&
        Object.keys(objkt.owners).filter((s) => s.startsWith('tz'))) ||
      []
    const sales = ownersArray.length

    // sanitize the objkt to make sure it has the necessary props.
    // if not, displays an error message.
    const [sanitised] = SanitiseOBJKT([objkt])
    if (!loading && sanitised === undefined) {
      return (
        <Page>
          <Container>
            <Padding>
              <div style={{ display: 'flex' }}>
                This OBJKT is corrupted. Please reach out on&nbsp;
                <Button href="https://discord.gg/jKNy6PynPK">
                  <Primary>discord</Primary>
                </Button>
              </div>
              <pre>{JSON.stringify(objkt, null, 2)}</pre>
            </Padding>
          </Container>
        </Page>
      )
    }

    return (
      <Page>
        <LoadingContainer loading={loading}>
          {!loading && false && (
            <>
              <Container large>
                {objkt.token_id && renderMediaType(objkt.token_info)}
              </Container>

              <Container>
                <Padding>
                  <ItemInfo {...objkt} isDetailView />
                </Padding>
              </Container>

              <Container>
                <Padding>
                  <div className={styles.menu}>
                    <Button onClick={this.info}>
                      <Primary selected={info}>info</Primary>
                    </Button>

                    <Button onClick={this.owners}>
                      <Primary selected={owners}>owners</Primary>
                    </Button>

                    {objkt.token_info.creators[0] === this.context.address && (
                      <>
                        <Button onClick={this.curate}>
                          <Primary selected={curate}>+curate</Primary>
                        </Button>
                        {objkt.swaps.length !== 0 && (
                          <Button onClick={this.cancel}>
                            <Primary>-cancel curation</Primary>
                          </Button>
                        )}
                      </>
                    )}

                    {/* TODO: crzypatchwork to implement*/}
                    {false && (
                      <Button onClick={() => alert('available soon')}>
                        <Primary>burn</Primary>
                      </Button>
                    )}
                  </div>
                </Padding>
              </Container>

              {info && (
                <>
                  <Container>
                    <Padding>TITLE</Padding>
                    <Padding>{objkt.name}</Padding>
                  </Container>
                  <Container>
                    <Padding>DESCRIPTION</Padding>
                    <Padding>{objkt.token_info.description}</Padding>
                  </Container>

                  {objkt.token_info.tags.length > 0 && (
                    <Container>
                      <Padding>
                        <div className={styles.tags}>
                          {objkt.token_info.tags.map((tag, index) => (
                            <div
                              key={`tag${tag}${index}`}
                              className={styles.tag}
                            >
                              {tag}
                            </div>
                          ))}
                        </div>
                      </Padding>
                    </Container>
                  )}
                </>
              )}

              {owners && (
                <Container>
                  <Padding>
                    {ownersArray.map((wallet) => {
                      const amount = objkt.owners[wallet]
                      return (
                        <div
                          key={`${objkt.token_id}-${wallet}`}
                          className={styles.owner}
                        >
                          {amount}x&nbsp;
                          <Button href={`https://tzkt.io/${wallet}`}>
                            <Primary>{walletPreview(wallet)}</Primary>
                          </Button>
                        </div>
                      )
                    })}
                  </Padding>
                </Container>
              )}

              {curate && (
                <Container>
                  <Padding>
                    <Input
                      type="number"
                      placeholder="OBJKT amount"
                      name="objkt_amount"
                      min={1}
                      max={objkt.total_amount - sales}
                      onChange={this.handleChange}
                    />
                    <Input
                      type="number"
                      placeholder="price per OBJKT (in tez)"
                      name="xtz_per_objkt"
                      min={0}
                      max={10000}
                      onChange={this.handleChange}
                    />
                    <Button onClick={this.submitForm} fit>
                      <Curate>curate</Curate>
                    </Button>
                  </Padding>
                </Container>
              )}
            </>
          )}
        </LoadingContainer>
      </Page>
    )
  }
}
