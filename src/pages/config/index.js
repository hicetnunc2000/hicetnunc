/* eslint-disable */
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
    subjkt_url: ''
  }

  componentWillMount = () => {
    this.context.syncTaquito()
  }

  handleChange = (e) => {
    if (e.target.name == 'subjkt_url' && !e.target.checkValidity()){
      console.log(e.target.pattern)
      e.target.value = e.target.value.replace(/[^a-z0-9-._]/g, "")
    }
    this.setState({ [e.target.name]: e.target.value })
  }

  // config subjkt

  subjkt_config = async () => {
    const ipfs = create(infuraUrl)
    /*     const [file] = this.state.selectedFile
    
        const buffer = Buffer.from(await file.arrayBuffer())
    
        this.setState({ avatar: 'ipfs://' + (await ipfs.add(buffer)).path }) */

    this.context.registry(
      this.state.subjkt,
      await ipfs.add(
        Buffer.from(JSON.stringify({ description: this.state.description }))
      )
    )
  }

  // upload file

  onFileChange = (event) => {
    this.setState({
      selectedFile: event.target.files,
      fileTitle: event.target.files[0].name,
    })
  }

  hDAO_operators = () => {
    this.context.hDAO_update_operators(this.context.acc.address)
  }

  unregister = () => this.context.unregister()

  hDAO_config = () => {
    // convert float to 10^6
    ls.set('hDAO_config', this.state.vote)
  }

  /*     

   signature studies
   
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
            {/*             <div>
              <button onClick={this.hDAO_operators}>
                allow subjkt operators ○
              </button>
            </div> */}
            <div>
              <div style={{ backgroundColor: 'black', height: '0.5px' }}></div>
            </div>
            <div style={{ paddingTop: '15%' }}>
              <div><strong>SUBJKT</strong></div>
              <label>hicetnunc.xyz/</label>
              <input
                style={{ marginBottom: '4px' }}
                type="text"
                name="subjkt_url"
                onChange={this.handleChange}
                placeholder="subjkt-url"
                pattern="^[a-z0-9-._]*$"
                value={this.subjkt_url}
              ></input> <span style={{display: 'inline-block', marginBottom: '4px', opacity: '0.8'}}>(a-z 0-9 - _ .)</span>
              <br />
              <label>Display Name: </label>
              <input
                style={{ marginBottom: '4px' }}
                type="text"
                name="subjkt"
                onChange={this.handleChange}
                placeholder="Subjkt Name"
                pattern="^[a-z0-9-._]*$"
                value={this.subjkt}
              ></input>
              <br />
              <label>Description: &nbsp;</label>
              <textarea
                style={{ marginBottom: '4px', width: '100%' }}
                name="description"
                onChange={this.handleChange}
                placeholder="description"
                value={this.description}
              ></textarea>
              <br />
              <button
                style={{
                  border: 'none',
                  padding: '4px 8px',
                  margin: '8px 0',
                  fontWeight: 'bold'
                }}
                onClick={this.subjkt_config}
              >
                set SUBJKT
              </button>
            </div>
            <div style={{ paddingTop: '5%' }}>
              <div><strong>CURATE</strong></div>
              <label>hDAO amount: &nbsp;</label>
              <input
                style={{ marginBottom: '4px' }}
                type="text"
                name="vote"
                onChange={this.handleChange}
                placeholder="μ○"
              ></input> <span style={{display: 'inline-block', marginBottom: '4px', opacity: '0.8'}}>(default: 1000)</span>
              <p style={{ fontSize: '12px' }}>
                hic et nunc DAO ○ sent per curate, in millionths <a style={{ color: 'var(--text-color)', fontWeight: 'bold' }} href="https://github.com/hicetnunc2000/hicetnunc/wiki/hDAO#what-are-those-little-circles-on-each-post-hdao-what-is-that" target="_blank">Learn More</a>
              </p>
              <button
                style={{
                  border: 'none',
                  padding: '4px 8px',
                  margin: '8px 0',
                  fontWeight: 'bold'
                }}
                onClick={this.hDAO_config}
              >
                set curate
              </button>
            </div>
            {/*             <div>
              <input type="text" name="str" onChange={this.handleChange} placeholder="sign"></input>
              <button onClick={this.sign}>sign</button>
            </div> */}

            {/* this action may affect collectors. consider it carefully */}

            {/*             <div style={{ paddingTop: '5%' }}>
              <button onClick={this.unregister}>unregister</button>
            </div> */}
          </Padding>
        </Container>
      </Page>
    )
  }
}
