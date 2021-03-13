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
              the present decentralized application allows its users to manage
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
              we're concerned about your security and autonomy. please verify
              informations while making transactions.
            </p>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <p>for consulting, networking or questions:</p>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <strong className={styles.buttons}>
              <Button href="https://discord.gg/jKNy6PynPK">
                <Primary>discord</Primary>
              </Button>
              {', '}
              <Button href="mailto:hicetnunc2000@protonmail.com">
                <Primary>email</Primary>
              </Button>
              {', '}
              <Button href="https://github.com/hicetnunc2000">
                <Primary>github</Primary>
              </Button>
              {', '}
              <Button href="https://github.com/hicetnunc2000/hicetnunc/blob/main/FAQ.md">
                <Primary>faq</Primary>
              </Button>
            </strong>
          </Padding>
        </Container>
      </Page>
    )
  }
}
