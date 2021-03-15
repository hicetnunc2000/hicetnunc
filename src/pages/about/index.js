import React, { Component } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import styles from './index.module.scss'

export class About extends Component {
  static contextType = HicetnuncContext

  state = {
    reveal: false,
  }

  reveal = () => {
    this.setState({
      reveal: !this.state.reveal,
    })
  }

  render() {
    return (
      <Page>
        <Container>
          <Padding>
            <strong>hic et nunc</strong>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <p>
              The present decentralized application allows its users to manage
              decentralized digital assets, serving as a public smart contract
              infrastructure on Tezos Blockchain.
            </p>{' '}
          </Padding>
        </Container>

        <Container>
          <Padding>
            <p>
              IPFS NFTs can be minted and traded by permissionless means. such
              experiment was designed intending to imagine alternative crypto
              economies.
            </p>{' '}
          </Padding>
        </Container>

        <Container>
          <Padding>
            <p>
              We're concerned about your security and autonomy. please verify
              informations while making transactions.
            </p>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <div className={styles.buttons}>
              <p>For consulting, networking or questions get in touch by</p>
              &nbsp;
              <Button href="mailto:hicetnunc2000@protonmail.com">
                <Primary>
                  <strong>email</strong>&nbsp;
                </Primary>
              </Button>
              <p>or on</p>&nbsp;
              <Button href="https://discord.gg/jKNy6PynPK">
                <Primary>
                  <strong>discord</strong>
                </Primary>
              </Button>
            </div>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <div className={styles.buttons}>
              <p>FAQ's are available</p>&nbsp;
              <Button href="https://github.com/hicetnunc2000/hicetnunc/blob/main/FAQ.md">
                <Primary>
                  <strong>here</strong>
                </Primary>
              </Button>
            </div>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <div className={styles.buttons}>
              <p>Issues can be reported here</p>&nbsp;
              <Button href="https://github.com/hicetnunc2000/hicetnunc/issues">
                <Primary>
                  <strong>here</strong>
                </Primary>
              </Button>
            </div>
          </Padding>
        </Container>
      </Page>
    )
  }
}
