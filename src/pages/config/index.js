import React, { Component } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Container, Padding, Page } from '../../components/layout'
import { RequestSignPayloadInput, SigningType } from '@airgap/beacon-sdk'
import { char2Bytes } from '@taquito/utils'

const ls = require('local-storage')
/* .split('')
                  .reduce(
                    (hex, c) =>
                      (hex += c.charCodeAt(0).toString(16).padStart(2, '0')),
                    ''
                  ) */
export class Config extends Component {
  static contextType = HicetnuncContext

  state = {
    vote: 0,
    string: '',
  }

  componentWillMount = () => this.context.hDAO_vote

  // config alias
  // config hDAO balance

  componentWillMount = () => {
    this.context.syncTaquito()
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
    console.log(this.state)
  }

  // config alias

  alias_config = async () => {
    const bytes =
      '05' +
      char2Bytes(
        JSON.stringify({
          alias: this.state.alias,
          description: this.state.description,
        })
      )
    console.log(bytes)
    const payload = {
      signingType: SigningType.MICHELINE,
      payload: bytes,
      sourceAddress: this.context.addr,
    }
    console.log(payload)
    this.context.sign(payload)
  }

  hDAO_config = () => {
    // convert float to 10^6
    ls.set('hDAO_config', this.state.vote)
  }

  render() {
    return (
      <Page>
        <Container>
          <Padding>
            {/*             <div>
              <input type="text" name="string" onChange={this.handleChange} placeholder='alias'></input><br/>
              <button onClick={this.alias_config}>config</button>
            </div> */}
            <div>
              <input
                type="text"
                name="vote"
                onChange={this.handleChange}
                placeholder="○"
              ></input>
              <p style={{ fontSize: '12px' }}>
                hic et nunc DAO ○ curation parameter
              </p>
              <button onClick={this.hDAO_config}>config</button>
            </div>
            {/*             <div>
              <p>allow ○ operators</p>
            </div> */}
          </Padding>
        </Container>
      </Page>
    )
  }
}
