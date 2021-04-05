import React, { Component } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { getLanguage } from '../../constants'
import styles from './index.module.scss'

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
              <PrimaryButton href="mailto:hicetnunc2000@protonmail.com">
                <strong>email</strong>
              </PrimaryButton>
              <p>,</p>&nbsp;
              <PrimaryButton href="https://discord.gg/jKNy6PynPK">
                <strong>discord</strong>
              </PrimaryButton>
              <p>, or on</p>&nbsp;
              <PrimaryButton href="https://reddit.com/r/hicetnunc">
                <strong>reddit</strong>
              </PrimaryButton>
            </div>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <div className={styles.buttons}>
              <p>WIKI is available</p>&nbsp;
              <PrimaryButton href="https://github.com/hicetnunc2000/hicetnunc/wiki">
                <strong>here</strong>
              </PrimaryButton>
            </div>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <div className={styles.buttons}>
              <p>Issues can be reported</p>&nbsp;
              <PrimaryButton href="https://github.com/hicetnunc2000/hicetnunc/issues">
                <strong>here</strong>
              </PrimaryButton>
            </div>
          </Padding>
        </Container>
      </Page>
    )
  }
}
