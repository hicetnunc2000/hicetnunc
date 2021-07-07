/* eslint-disable */

import React, { Component } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Container, Padding, Page } from '../../components/layout'
import { BottomBanner } from '../../components/bottom-banner'
import { Input, Textarea } from '../../components/input'
import { Button, Curate } from '../../components/button'
import { Upload } from '../../components/upload'
import { Identicon } from '../../components/identicons'
import { SigningType } from '@airgap/beacon-sdk'
import { char2Bytes } from '@taquito/utils'
import styles from './styles.module.scss'
const { create } = require('ipfs-http-client')
const infuraUrl = 'https://ipfs.infura.io:5001'

const ls = require('local-storage')

const query_tz = `
query addressQuery($address: String!) {
  hic_et_nunc_holder(where: { address: {_eq: $address}}) {
    address
    name
    hdao_balance
    metadata
  }
}
`

async function fetchTz(addr) {
  const { errors, data } = await fetchGraphQL(query_tz, 'addressQuery', {
    address: addr,
  })
  if (errors) {
    console.error(errors)
  }
  const result = data.hic_et_nunc_holder
  // console.log({ result })
  return result
}

async function fetchGraphQL(operationsDoc, operationName, variables) {
  let result = await fetch('https://api.hicdex.com/v1/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  })
  return await result.json()
}

export class Config extends Component {
  static contextType = HicetnuncContext

  state = {
    vote: 0,
    address : '',
    subjkt: '',
    description: '',
    social_media: '',
    identicon: '',
    subjktUri: '', // uploads image
  }

  componentWillMount = async () => {
    await this.context.syncTaquito()
/*     this.setState({address : this.context.acc.address})
    let res = await fetchTz(this.context.acc.address)
    this.context.setSubjktInfo(res[0])
    this.context.subjktInfo = res[0]
    console.log(this.context.subjktInfo) */
    //console.log(this.context.subjktInfo)
  }

  handleChange = (e) => {
    console.log('set', e.target.name, 'to', e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  // config subjkt

  subjkt_config = async () => {
    const ipfs = create(infuraUrl)
        const [file] = this.state.selectedFile
    
        const buffer = Buffer.from(await file.arrayBuffer())
    
        this.setState({ identicon: 'ipfs://' + (await ipfs.add(buffer)).path })
        //console.log(this.state)
    this.context.registry(
      this.state.subjkt,
      await ipfs.add(
        Buffer.from(JSON.stringify({ description: this.state.description, identicon: this.state.identicon }))
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

  render () {
    return (
      <Page>
        <Container>
         <Identicon address={this.state.address} />
         <div style={{height:'20px'}}></div>
         <input type="file" onChange={this.onFileChange} />
          <div style={{height:'20px'}}></div>
          <Padding>
            <Input
              name="subjkt"
              onChange={this.handleChange}
              placeholder="Username"
              label="Username"
              value={undefined}
            />
            <Input
              name="description"
              onChange={this.handleChange}
              placeholder="Description"
              label="Description"
              value={undefined}
            />
            <Button onClick={this.subjkt_config}>
              <Curate>Save Profile</Curate>
            </Button>
          </Padding>
          <p>link your twitter account with <a href="https://tzprofiles.com">tz profiles</a></p>
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
{/*         <BottomBanner>
          The dApp has been temporarily disabled for a contract migration. Follow <a href="https://twitter.com/hicetnunc2000" target="_blank">@hicetnunc2000</a> or <a href="https://discord.gg/jKNy6PynPK" target="_blank">join the discord</a> for updates.
        </BottomBanner> */}
      </Page>
    )
  }
}
