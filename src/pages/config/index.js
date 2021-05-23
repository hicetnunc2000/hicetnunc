import {
  ALLOWED_MIMETYPES,
  ALLOWED_FILETYPES_LABEL,
  ALLOWED_COVER_MIMETYPES,
  ALLOWED_COVER_FILETYPES_LABEL,
  MINT_FILESIZE,
  MIMETYPE,
} from '../../constants'
import React, { Component } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Container, Padding, Page } from '../../components/layout'
import { Input } from '../../components/input'
import { Button, Curate, Primary } from '../../components/button'
import { Upload } from '../../components/upload'

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
    subjktUri: '', // uploads image
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

    this.context.registry(
      this.state.subjkt,
      await ipfs.add(
        Buffer.from(JSON.stringify({ description: this.state.description }))
      )
    )
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

  // signature tests

  sign = () => {
    console.log(this.context.addr)
    this.context.signStr({
      /*       payload : "05" + char2Bytes(this.state.str) */
      payload: this.state.str
        .split('')
        .reduce(
          (hex, c) => (hex += c.charCodeAt(0).toString(16).padStart(2, '0')),
          ''
        ),
      /*         sourceAddress: this.context.addr,
       */
    })
  }
  // delete account

  render() {
    return (
      <Page>
        <Container>
          <Padding>
            <div>
              <button onClick={this.hDAO_operators}>
                allow subjkt operators ○
              </button>
            </div>
            <div>
              <input
                type="text"
                name="subjkt"
                onChange={this.handleChange}
                placeholder="subjkt"
              ></input>
              <br />
              <input
                type="text"
                name="description"
                onChange={this.handleChange}
                placeholder="description"
              ></input>
              <br />
              {/* social media */}
              <Container>
                <Padding>
                  <Upload label="SUBJKT image" />
                </Padding>
              </Container>
              <button onClick={this.subjkt_config}>config</button>
            </div>
            <div>
              <Input
                type="text"
                name="vote"
                onChange={this.handleChange}
                placeholder="○"
              />
              <p style={{ fontSize: '12px' }}>
                hic et nunc DAO ○ curation parameter
              </p>
              <Button onClick={this.hDAO_config} fit>
                config
              </Button>
            </div>
            {/*             <div>
              <input type="text" name="str" onChange={this.handleChange} placeholder="sign"></input>
              <button onClick={this.sign}>sign</button>
            </div> */}
          </Padding>
        </Container>
      </Page>
    )
  }
}
