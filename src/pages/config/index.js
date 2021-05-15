import React, { Component } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Container, Padding, Page } from '../../components/layout'
import { SigningType } from '@airgap/beacon-sdk'
import { char2Bytes } from '@taquito/utils'
const { create } = require('ipfs-http-client')
const infuraUrl = 'https://ipfs.infura.io:5001'

const ls = require('local-storage')

export class Config extends Component {
  static contextType = HicetnuncContext

  state = {
    vote: 0,
    subjkt: '',
    description: '',
    social_media: '',
    subjktUri: '' // uploads image
  }

  componentWillMount = () => {
    this.context.syncTaquito()
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
    console.log(this.state)
  }

  // config personax

  subjkt_config = async () => {

    const ipfs = create(infuraUrl)

    this.context.registry(this.state.subjkt, await ipfs.add(Buffer.from(JSON.stringify({ description: this.state.description }))))
    /*     

    signature study
    
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
        
        */
  }

  hDAO_operators = () => {
    this.context.hDAO_update_operators(this.context.acc.address)
  }

  hDAO_config = () => {
    // convert float to 10^6
    ls.set('hDAO_config', this.state.vote)
  }

  // delete account

  render() {
    return (
      <Page>
        <Container>
          <Padding>
            <div>
              <button onClick={this.hDAO_operators}>allow subjkt operators ○</button>
            </div>
            <div>
              <input type="text" name="subjkt" onChange={this.handleChange} placeholder='subjkt'></input><br />
              <input type="text" name="description" onChange={this.handleChange} placeholder='description'></input><br />
              <button onClick={this.subjkt_config}>config</button>
            </div>
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
          </Padding>
        </Container>
      </Page>
    )
  }
}
