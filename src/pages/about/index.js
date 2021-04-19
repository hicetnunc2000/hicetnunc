import React, { Component } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { getLanguage } from '../../constants'
import styles from './styles.module.scss'

export class About extends Component {
  static contextType = HicetnuncContext

  language = getLanguage()

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
      <Page title="about">
        <Container>
          <Padding>
            <strong>hic et nunc</strong>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <p>{this.language.about.paragraphs[0]}</p>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <p>{this.language.about.paragraphs[1]}</p>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <p>{this.language.about.paragraphs[2]}</p>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <div className={styles.buttons}>
              <p>For consulting, networking or questions get in touch by</p>
              &nbsp;
              <Button href="mailto:hicetnunc2000@protonmail.com">
                <Primary>
                  <strong>email</strong>
                </Primary>
              </Button>
              <p>,</p>&nbsp;
              <Button href="https://discord.gg/jKNy6PynPK">
                <Primary>
                  <strong>discord</strong>
                </Primary>
              </Button>
              <p>,</p>&nbsp;
              <Button href="https://reddit.com/r/hicetnunc">
                <Primary>
                  <strong>reddit</strong>
                </Primary>
              </Button>
              <p>, or on</p>&nbsp;
              <Button href="https://t.me/hicetnunc2000">
                <Primary>
                  <strong>telegram</strong>
                </Primary>
              </Button>
            </div>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <div className={styles.buttons}>
              <p>WIKI is available on</p>&nbsp;
              <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki">
                <Primary>
                  <strong>github</strong>
                </Primary>
              </Button>
            </div>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <div className={styles.buttons}>
              <p>Report</p>&nbsp;
              <Button href="https://github.com/hicetnunc2000/hicetnunc/issues">
                <Primary>
                  <strong>issues</strong>
                </Primary>
              </Button>
            </div>
          </Padding>
        </Container>
      </Page>
    )
  }
}
