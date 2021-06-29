/* eslint-disable */

import React, { Component } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Container, Padding, Page } from '../../components/layout'
import { BottomBanner } from '../../components/bottom-banner'
import { Input, Textarea } from '../../components/input'
import { Button, Curate } from '../../components/button'
import { Upload } from '../../components/upload'

import { SigningType } from '@airgap/beacon-sdk'
import { char2Bytes } from '@taquito/utils'
import styles from './styles.module.scss'
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
    console.log('set', e.target.name, 'to', e.target.value)
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
            <Input
              name="subjkt"
              onChange={this.handleChange}
              placeholder="Username"
              label="Username"
              value={this.state.subjkt}
            />
            <Input
              name="description"
              onChange={this.handleChange}
              placeholder="Description"
              label="Description"
              value={this.state.description}
            />
            <Button onClick={this.subjkt_config}>
              <Curate>Save Profile</Curate>
            </Button>
          </Padding>
          <p style={{ fontSize: "12px" }}> one can link their twitter account through <a href="https://tzprofiles.com">tz profiles</a></p>
        </Container>

        <Container>
          <Padding>
            <Input
              name="vote"
              onChange={this.handleChange}
              placeholder="hDAO Curation"
              label="hDAO Curation"
              value={undefined}
            />

            <Button onClick={this.hDAO_config}>
              <Curate>Save ○</Curate>
            </Button>

            <p>hic et nunc DAO ○ curation parameter</p>
          </Padding>
        </Container>

        {/*         <Container>
          <Padding>
            <Button onClick={this.unregister}>
              <Curate>Unregister</Curate>
            </Button>
          </Padding>
        </Container> */}
        <BottomBanner>
          The dApp has been temporarily disabled for a contract migration. Follow <a href="https://twitter.com/hicetnunc2000" target="_blank">@hicetnunc2000</a> or <a href="https://discord.gg/jKNy6PynPK" target="_blank">join the discord</a> for updates.
        </BottomBanner>
      </Page>
    )
  }
}
