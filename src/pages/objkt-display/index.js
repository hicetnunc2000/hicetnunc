import React, { Component } from 'react'
import { GetOBJKT } from '../../api'
import { Page, Container, Padding } from '../../components/layout'
import { LoadingContainer } from '../../components/loading'
import { Input } from '../../components/input'
import { ItemInfo } from '../../components/item-info'
import { Button, Curate, Primary, Burn } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { renderMediaType } from '../../components/media-types'
import { walletPreview } from '../../utils/string'
import { SanitiseOBJKT } from '../../utils/sanitise'
import styles from './index.module.scss'
import { lowestPrice } from '../../utils/lowestPrice'

export class ObjktDisplay extends Component {
  static contextType = HicetnuncContext

  state = {
    objkt_id: 0,
    objkt: {},
    balance: 0,
    info: true,
    owners: false,
    swaps: false,
    burn: false,
    loading: true,
    cancel: false,
    swap: false,
    test: false,
    value: 0,
    xtz_per_objkt: 0,
    objkt_amount: 0,
    royalties: 0,
  }

  componentWillMount() {
    GetOBJKT({ objkt_id: window.location.pathname.split('/')[2] }).then(
      (data) => {
        const objkt = data.result[0]
        const swap = lowestPrice(objkt.swaps)
        this.setState({
          objkt: data.result,
          loading: false,
          swap,
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
        this.state.swap.swap_id,
        this.state.swap.xtz_per_objkt * 1
      )
    }
  }

  toggleInfo = () =>
    this.setState({
      info: true,
      owners: false,
      swaps: false,
      cancel: false,
      burn: false,
    })

  toggleOwners = () =>
    this.setState({
      info: false,
      owners: true,
      swaps: false,
      cancel: false,
      burn: false,
    })

  toggleSwaps = () =>
    this.setState({
      info: false,
      owners: false,
      swaps: true,
      cancel: false,
      burn: false,
    })

  toggleCancel = () => {
    this.setState({
      info: false,
      owners: false,
      swaps: false,
      cancel: true,
      burn: false,
    })
  }

  toggleBurn = () =>
    this.setState({
      info: false,
      owners: false,
      swaps: false,
      cancel: false,
      burn: true,
    })

  render() {
    const { loading, info, owners, swaps, cancel, burn, objkt } = this.state
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
          {!loading && (
            <>
              <Container large>
                {objkt.token_id && renderMediaType(objkt.token_info, true)}
              </Container>

              <Container>
                <Padding>
                  <ItemInfo {...objkt} isDetailView />
                </Padding>
              </Container>

              <Container>
                <Padding>
                  <div className={styles.menu}>
                    <Button onClick={this.toggleInfo}>
                      <Primary selected={info}>info</Primary>
                    </Button>

                    <Button onClick={this.toggleOwners}>
                      <Primary selected={owners}>owners</Primary>
                    </Button>

                    {objkt.token_info.creators[0] === this.context.address && (
                      <>
                        <Button onClick={this.toggleSwaps}>
                          <Primary selected={swaps}>swap</Primary>
                        </Button>
                        {objkt.swaps.length !== 0 && (
                          <Button onClick={this.toggleCancel}>
                            <Primary selected={cancel}>cancel</Primary>
                          </Button>
                        )}
                        <Button onClick={this.toggleBurn}>
                          <Primary selected={burn}>burn</Primary>
                        </Button>
                      </>
                    )}
                  </div>
                </Padding>
              </Container>

              {info && (
                <>
                  <Container>
                    <Padding>TITLE</Padding>
                    <Padding>{objkt.token_info.name}</Padding>
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

              {swaps && (
                <>
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
                        <Curate>swap it</Curate>
                      </Button>
                    </Padding>
                  </Container>

                  <Container>
                    <Padding>
                      <p>
                        swaps which carry value are charged with a 2.5% fee for
                        platform maintenance
                      </p>
                    </Padding>
                  </Container>
                </>
              )}

              {cancel && (
                <>
                  <Container>
                    <Padding>
                      <p>You're about to cancel your swap.</p>
                    </Padding>
                  </Container>
                  <Container>
                    <Padding>
                      <Button
                        onClick={() =>
                          this.context.cancel(this.state.swap.swap_id)
                        }
                        fit
                      >
                        <Burn>cancel it</Burn>
                      </Button>
                    </Padding>
                  </Container>
                </>
              )}

              {burn && (
                <>
                  <Container>
                    <Padding>
                      <p>
                        Burning your OBJKT will permanently delete it from the
                        network.
                      </p>
                    </Padding>
                  </Container>
                  <Container>
                    <Padding>
                      <Button onClick={() => alert('coming soon...')} fit>
                        <Burn>burn it</Burn>
                      </Button>
                    </Padding>
                  </Container>
                </>
              )}
            </>
          )}
        </LoadingContainer>
      </Page>
    )
  }
}
