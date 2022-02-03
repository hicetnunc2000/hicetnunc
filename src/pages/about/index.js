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
      <Page title="about" large>
        <Container>
          <Padding>
            <strong>teia</strong>
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
              <p>Join or contact teia on</p>
              &nbsp;
              <Button href="https://discord.gg/7pZrPCcgnG">
                <Primary>
                  <strong>discord</strong>
                </Primary>
              </Button>
              <p>,</p>&nbsp;
              <Button href="https://twitter.com/TeiaCommunity">
                <Primary>
                  <strong>twitter</strong>
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
            <Button href="https://github.com/hicetnunc2000/hicetnunc/wiki/Tools-made-by-the-community">
              <Primary>
                <strong>Community tools</strong>
              </Primary>
            </Button>
            {false && (
              <Button href="https://projects.stroep.nl/hicetnunc">
                <Primary>
                  <strong>example tool2</strong>
                </Primary>
              </Button>
            )}
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
{/*         <BottomBanner>
        Collecting has been temporarily disabled. Follow <a href="https://twitter.com/TeiaCommunity" target="_blank">@hicetnunc_art</a> or <a href="https://discord.gg/7pZrPCcgnG" target="_blank">join the discord</a> for updates.
        </BottomBanner> */}
      </Page>
    )
  }
}
