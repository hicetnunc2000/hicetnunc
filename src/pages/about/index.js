import React, { Component } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { BottomBanner } from '../../components/bottom-banner'
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
              <p>Join or contact hic et nunc on</p>
              &nbsp;
              <Button href="https://hicetnunc2000.medium.com">
                <Primary>
                  <strong>medium</strong>
                </Primary>
              </Button>
              <p>,</p>&nbsp;
              <Button href="mailto:hicetnunc2000@protonmail.com">
                <Primary>
                  <strong>email</strong>
                </Primary>
              </Button>
              <p>,</p>&nbsp;
              <Button href="https://discord.gg/W8vQ7REym7">
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
              <p>,</p>&nbsp;
              <Button href="https://t.me/hicetnunc2000">
                <Primary>
                  <strong>telegram</strong>
                </Primary>
              </Button>
              &nbsp;or through our
              <Button href="https://community.hicetnunc.xyz">
                <Primary>
                  <strong>&nbsp;community forum</strong>
                </Primary>
              </Button>.
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
        Collecting has been temporarily disabled. Follow <a href="https://twitter.com/hicetnunc2000" target="_blank">@hicetnunc2000</a> or <a href="https://discord.gg/jKNy6PynPK" target="_blank">join the discord</a> for updates.
        </BottomBanner> */}
      </Page>
    )
  }
}
