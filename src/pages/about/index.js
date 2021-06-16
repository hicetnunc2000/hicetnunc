import React, { Component } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { Popup } from '../../components/popup'
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

  constructor() {
    super();
    this.state = {
      show: true
    };
    this.showPopup = this.showPopup.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
  }

  showPopup = () => {
    this.setState({ show: true });
  };

  hidePopup = () => {
    this.setState({ show: false });
  };

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
            <p>Community tools:</p>&nbsp;
            <Button href="https://projects.stroep.nl/hicetnunc">
              <Primary>
                <strong>hicetnunc discovery</strong>
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

        {/* An example of a popup, you can replace icon with sad, happy, or exclamation mark. Note that no icon specification defaults to the hic et nunc logo. */}
      
        {/*<Container>
          <Padding>
            <Popup icon show={this.state.show} handleClose={this.hideModal} title="This is lorem ipsum.">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue erat lorem, ornare volutpat elit auctor sit amet. Praesent pharetra turpis nunc, a rhoncus nisi interdum a. Phasellus ac nisl a risus interdum luctus vitae eu ipsum. Vivamus varius nunc erat, placerat tempus metus viverra eget. Maecenas sed ante volutpat, sagittis est nec, gravida velit. Donec condimentum imperdiet ante, sit amet blandit leo suscipit nec. Duis gravida nunc laoreet, tristique est id, ornare tortor. Ut in nulla hendrerit, pellentesque augue elementum, molestie metus. Nulla non ultrices neque, vel finibus lorem. Integer sodales nunc augue, in malesuada tortor feugiat sed. Nam neque ipsum, lacinia in imperdiet vel, ornare sit amet purus. Mauris laoreet egestas odio. Integer interdum at sem eget egestas. Praesent et malesuada tortor. In lectus ante, dictum at ullamcorper ac, pulvinar et elit. Aenean turpis lorem, fermentum non consectetur sit amet, imperdiet in ligula.</p>
            </Popup>
          </Padding>
        </Container>*/}
      </Page>
    )
  }
}
