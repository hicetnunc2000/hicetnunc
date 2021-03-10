import React, { Component } from 'react'
import { GetOBJKT } from '../../api'
import { Page, Container, Padding } from '../../components/layout'
import { LoadingContainer } from '../../components/loading'
import { Button } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { walletPreview } from '../../utils/string'
import { renderMediaType } from '../../components/media-types'
import styles from './index.module.scss'

export default class ObjktDisplay extends Component {
  static contextType = HicetnuncContext

  state = {
    objkt_id: 0,
    objkt: {},
    balance: 0,
    info: true,
    owners_arr: [],
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
    console.log(amount)
    if (!amount || amount.match(/^\d{1,}(\.\d{0,6})?$/)) {
      this.setState({ tz_per_objkt: amount })
    }
  }

  submitForm = async () => {
    this.context.swap(
      this.state.objkt_amount,
      window.location.pathname.split('/')[2],
      this.state.xtz_per_objkt
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
    const { loading, info, owners, objkt, owners_arr, curate } = this.state
    return (
      <Page>
        <LoadingContainer loading={loading}>
          {!loading && (
            <>
              <Container large>
                {objkt.token_id && renderMediaType(objkt.token_info)}
              </Container>

              <Container>
                <Padding>
                  <div className={styles.edition}>
                    <span>
                      OBJKT#{objkt.token_id}
                      <br />
                      issuer{' '}
                      <Button to={`/tz/${objkt.token_info.creators[0]}`}>
                        {walletPreview(objkt.token_info.creators[0])}
                      </Button>
                    </span>

                    <div>
                      {objkt.swaps.length !== 0 ? (
                        <span>
                          {objkt.swaps[0].objkt_amount}/{objkt.total_amount}
                        </span>
                      ) : (
                        <span>{objkt.total_amount} </span>
                      )}
                      <button
                        onClick={this.collect}
                        style={{
                          backgroundColor: 'white',
                        }}
                      >
                        {objkt.swaps.length !== 0 ? (
                          <span>
                            collect for{' '}
                            {parseInt(objkt.swaps[0].xtz_per_objkt / 1000000)}{' '}
                            tez
                          </span>
                        ) : (
                          <span>not for sale</span>
                        )}
                      </button>
                    </div>
                  </div>
                </Padding>
              </Container>

              <Container>
                <Padding>
                  <div className={styles.menu}>
                    <Button onClick={this.info} selected={info}>
                      info
                    </Button>

                    {objkt.token_info.creators[0] === this.context.address && (
                      <>
                        <Button onClick={this.curate} selected={curate}>
                          +curate
                        </Button>
                        {objkt.swaps.length !== 0 && (
                          <Button onClick={this.cancel}>
                            -cancel curation
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </Padding>
              </Container>

              <Container>
                <Padding>
                  <div className={styles.curate}>
                    {owners &&
                      owners_arr.map((e) => (
                        <div>
                          {e.balance}x{' '}
                          <a href={`https://tzkt.io/${e.address}`}>
                            {e.address}
                          </a>
                        </div>
                      ))}
                    {curate && (
                      <div
                        style={{
                          display: 'inline',
                        }}
                      >
                        <input
                          type="text"
                          name="objkt_amount"
                          onChange={this.handleChange}
                          placeholder="OBJKT amount"
                        ></input>
                        <br />
                        <input
                          style={{ width: '100%' }}
                          type="text"
                          name="xtz_per_objkt"
                          placeholder="µtez per OBJKT (1 tez = 1000000 µtez)"
                          onChange={this.handleChange}
                        ></input>
                        <br />
                        <button
                          style={{ width: '100%' }}
                          onClick={this.submitForm}
                        >
                          curate
                        </button>
                      </div>
                    )}
                  </div>
                </Padding>
              </Container>

              <Container>
                <Padding>
                  {info && (
                    <div className={styles.info}>
                      <div className={styles.item}>
                        <div>TITLE</div>
                        <div>{objkt.name}</div>
                      </div>
                      <div className={styles.item}>
                        <div>DESCRIPTION</div>
                        <div>{objkt.token_info.description}</div>
                      </div>
                      {objkt.token_info.tags.length > 0 && (
                        <div className={styles.item}>
                          <div>
                            {objkt.token_info.tags.map((tag, index) => {
                              return (
                                <div
                                  key={`tag${tag}${index}`}
                                  className={styles.tag}
                                >
                                  {tag}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Padding>
              </Container>
            </>
          )}
        </LoadingContainer>
      </Page>
    )
  }
}
