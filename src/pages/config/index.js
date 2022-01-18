/* eslint-disable */

import React, { Component } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Container, Padding, Page } from '../../components/layout'
import { BottomBanner } from '../../components/bottom-banner'
import { Input, Textarea } from '../../components/input'
import { Button, Curate, Primary, Purchase } from '../../components/button'
import { Upload } from '../../components/upload'
import { Identicon } from '../../components/identicons'
import { SigningType } from '@airgap/beacon-sdk'
import { char2Bytes } from '@taquito/utils'
import styles from './styles.module.scss'
import axios from 'axios'
const { create } = require('ipfs-http-client')
const infuraUrl = 'https://ipfs.infura.io:5001'
const ipfs = create(infuraUrl)

const ls = require('local-storage')

const query_tz = `
query addressQuery($address: String!) {
  hic_et_nunc_holder(where: { address: {_eq: $address}}) {
    address
    name
    hdao_balance
    metadata
    metadata_file
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
  let result = await fetch(process.env.REACT_APP_GRAPHQL_API, {
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
    loading: true,
    vote: 0,
    address: '',
    subjkt: '',
    description: '',
    social_media: '',
    identicon: '',
    subjktUri: '', // uploads image
    cid: undefined,
    selectedFile: undefined,
    toogled: false
  }

  componentWillMount = async () => {
    await this.context.syncTaquito()

    const { acc, proxyAddress } = this.context

    // Maybe use proxy address here
    const address = proxyAddress || acc.address

    this.setState({ address })
    let res = await fetchTz(address)

    this.context.subjktInfo = res[0]
    console.log(this.context.subjktInfo)

    if (this.context.subjktInfo) {
      let cid = await axios.get('https://ipfs.io/ipfs/' + (this.context.subjktInfo.metadata_file).split('//')[1]).then(res => res.data)

      this.context.subjktInfo.gravatar = cid

      if (cid.description) this.setState({ description: cid.description })
      if (cid.identicon) this.setState({ identicon: cid.identicon })
      if (this.context.subjktInfo.name) this.setState({ subjkt: this.context.subjktInfo.name })

    }
    //console.log(this.context.subjktInfo)
    this.setState({ loading: false })
  }

  handleChange = (e) => {
    if (e.target.name == 'subjkt' && !e.target.checkValidity()) {
      console.log(e.target.pattern)
      e.target.value = e.target.value.replace(/[^a-z0-9-._]/g, "")
    }
    console.log('set', e.target.name, 'to', e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  // config subjkt

  subjkt_config = async () => {

    if (this.state.selectedFile) {
      const [file] = this.state.selectedFile

      const buffer = Buffer.from(await file.arrayBuffer())
      console.log(buffer)
      this.setState({ identicon: 'ipfs://' + (await ipfs.add(buffer)).path })
    }

    console.log(this.state)
    this.context.registry(
      this.state.subjkt,
      await ipfs.add(
        Buffer.from(JSON.stringify({ description: this.state.description, identicon: this.state.identicon }))
      )
    )
  }

  // upload file

  onFileChange = async (event) => {
    this.setState({
      selectedFile: event.target.files,
      fileTitle: event.target.files[0].name,
    })

    const [file] = event.target.files

    const buffer = Buffer.from(await file.arrayBuffer())
    this.setState({ identicon: 'ipfs://' + (await ipfs.add(buffer)).path })

  }

  hDAO_operators = () => {
    this.context.hDAO_update_operators(this.context.acc.address)
  }

  unregister = () => this.context.unregister()

  hDAO_config = () => {
    // convert float to 10^6
    ls.set('hDAO_config', this.state.vote)
  }

  toggle = () => this.setState({ toogled: !this.state.toogled })
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

          <Identicon address={this.state.address} logo={this.state.identicon} />

          <div style={{ height: '20px' }}></div>
          <input type="file" onChange={this.onFileChange} />
          <div style={{ height: '20px' }}></div>
          <Padding>
            <Input
              name="subjkt"
              onChange={this.handleChange}
              placeholder="Username"
              label="Username"
              value={this.context.subjktInfo ? this.context.subjktInfo.name : undefined}
              pattern="^[a-z0-9-._]*$"
            />
            <Input
              name="description"
              onChange={this.handleChange}
              placeholder="Description"
              label="Description"
              value={this.state.description}
            />
            <Button onClick={this.subjkt_config}>
              <Purchase>Save Profile</Purchase>
            </Button>
          </Padding>
          <div style={{ display: 'inline' }}>
            <p style={{paddingTop : '7.5px' }}>
              <span>
                link your Twitter, Discord, GitHub, and website with </span>
              <span>
                <a href="https://tzprofiles.com">
                  <Button>
                    <a href='#' style={{ fontWeight: 'bold' }}>Tezos Profiles</a>
                  </Button>
                </a>
              </span>
            </p>
          </div>
        </Container>

        <Container>
          <Padding>
            <div onClick={this.toggle}>
              <Primary>
                + advanced
              </Primary>
            </div>
          </Padding>
        </Container>
        {
          this.state.toogled ?
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
                  <Purchase>Save ○</Purchase>
                </Button>

                <p style={{ marginTop : '7.5px' }}>hic et nunc DAO ○ curation parameter</p>
              </Padding>
            </Container>
            :
            undefined
        }


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
