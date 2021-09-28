import React, { Component } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import styles from './styles.module.scss'

export class FAQ extends Component {
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
      <Page title="faq" large>
        <Container>
          <Padding>
            <div className={styles.faq__outer__container}>
              <h1 className={styles.faq__title}>FAQ</h1>
              <ul className={styles.faq__container}>
                <li className={styles.buttons}>
                  <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/Getting-Started-with-Tezos">
                    <Primary>
                      How do I get tezos/make a wallet?
                    </Primary>
                  </Button>
                </li>
                <li className={styles.buttons}>
                  <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/Introduction">
                    <Primary>
                      How do I mint?
                    </Primary>
                  </Button>
                </li>
                <li className={styles.buttons}>
                  <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/Edit-your-profile">
                    <Primary>
                      How do I edit my profile?
                    </Primary>
                  </Button>
                </li>
                <li className={styles.buttons}>
                  <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/How-to-swap-%F0%9F%94%83">
                    <Primary>
                      How do I add/change the price of my OBJKT?
                    </Primary>
                  </Button>
                </li>
                <li className={styles.buttons}>
                  <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/How-to-burn-%F0%9F%94%A5">
                    <Primary>
                      How do I burn my OBJKT?
                    </Primary>
                  </Button>
                </li>
                <li className={styles.buttons}>
                  <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/How-to-resell-%F0%9F%8F%AA">
                    <Primary>
                      How do I resell an OBJKT?
                    </Primary>
                  </Button>
                </li>
                <li className={styles.buttons}>
                  <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/hDAO">
                    <Primary>
                      What is hDAO?
                    </Primary>
                  </Button>
                </li>
              </ul>
            </div>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <div className={styles.faq__outer__container}>
              <hr className={styles.divider}/>
            </div>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <div className={styles.faq__outer__container}>
              <ul className={styles.faq__container}>
                <li className={styles.buttons}>
                  <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/General">
                    <Primary>
                      General FAQ
                    </Primary>
                  </Button>
                </li>
                <li className={styles.buttons}>
                  <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/Troubleshooting">
                    <Primary>
                      Troubleshooting
                    </Primary>
                  </Button>
                </li>
                <li className={styles.buttons}>
                  <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/Tools-made-by-the-community">
                    <Primary>
                      Useful tools
                    </Primary>
                  </Button>
                </li>
              </ul>
            </div>
          </Padding>
        </Container>

        {/*         <Container>
          <Padding>
            <div className={styles.buttons}>
              <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/pt:Home">
                <Primary>
                  <strong>português</strong>
                </Primary>
              </Button>
            </div>
          </Padding>
        </Container> */}
      </Page>
    )
  }
}
