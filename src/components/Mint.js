import React, { Component } from 'react'
import { Card, Col, Row, CardTitle, CardText } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
import Loading from './Loading'
import Menu from './Menu'
import { BabelLoading } from 'react-loadingg'

const axios = require('axios')
const IPFS = require('ipfs-api')
const Buffer = require('buffer').Buffer

export default class Mint extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileTitle: '',
      title: '',
      description: '',
      tags: '',
      amount: 0,
      selectedFile: null,
      media: '',
      json: '',
      uploaded: false,
      reveal: false,
      loading: false,
      royalties: 0,
    }
    this.handleChange = this.handleChange.bind(this)
    this.onFileUpload = this.onFileUpload.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
  }

  static contextType = HicetnuncContext

  //state = {
  //    selectedFile: null
  //};

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () =>
      console.log(this.state)
    )
  }

  onFileChange = (event) => {
    // Update the state
    this.setState({
      selectedFile: event.target.files,
      fileTitle: event.target.files[0].name,
    })
  }

  fileToArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      const arrayBuffer = (fileReader.onload = (evt) => {
        resolve(evt.target.result)
      })
      fileReader.readAsArrayBuffer(file)
    })
  }

  onFileUpload = async (e) => {
    if (this.context.Tezos == null) {
      alert('sync')
    } else {
      this.context.loading()

      const icon = 'ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc'
      const host = 'https://cloudflare-ipfs.com/ipfs/'

      const files = this.state.selectedFile
      const ipfs = new IPFS({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
      })

      // 40mb limit
      if (files[0].size < 40000000) {
        const arrayBuffer = await this.fileToArrayBuffer(files[0])
        console.log(arrayBuffer)
        const fileCid =
          'ipfs://' + (await ipfs.files.add(Buffer.from(arrayBuffer)))[0].hash
        const nftCid = (
          await ipfs.files.add(
            Buffer.from(
              JSON.stringify({
                name: this.state.title,
                description: this.state.description,
                tags: [],
                symbol: 'OBJKT',
                artifactUri: fileCid,
                creators: [this.context.address],
                formats: [{ uri: fileCid, mimeType: files[0].type }],
                thumbnailUri: icon,
                decimals: 0,
                isBooleanAmount: false,
                shouldPreferSymbol: false,
              })
            )
          )
        )[0].hash

        this.context.mint(
          this.context.getAuth(),
          this.state.amount,
          nftCid,
          this.state.royalties
        )
      }
    }
  }

  reveal = () => {
    this.setState({
      reveal: !this.state.reveal,
    })
  }

  render() {
    let subList = {
      listStyle: 'none',
      fontSize: '26px',
    }

    return (
      <div>
        {this.context.load ? (
          <div style={{ marginTop: '35vh', verticalAlign: 'middle' }}>
            <Row>
              <Col sm="12" md={{ position: 'fixed', size: 6, offset: 3 }}>
                <p style={{ margin: 'auto', display: 'table' }}>
                  preparing NFT
                </p>
              </Col>
            </Row>
            <BabelLoading
              style={{
                backgroundColor: 'black',
                position: 'absolute',
                left: '49%',
              }}
            />
          </div>
        ) : (
          <Row>
            <Col sm="12" md={{ position: 'fixed', size: 6, offset: 3 }}>
              {this.context.collapsed ? (
                <div>
                  <Card style={{ border: 0, marginTop: '17%' }}>
                    <input
                      type="text"
                      name="title"
                      onChange={this.handleChange}
                      placeholder="OBJKT title"
                    ></input>
                    <input
                      type="text"
                      name="description"
                      onChange={this.handleChange}
                      placeholder="OBJKT description"
                    ></input>
                    <input
                      type="text"
                      name="amount"
                      onChange={this.handleChange}
                      placeholder="amount of OBJKTs"
                    ></input>
                    <input
                      type="text"
                      name="royalties"
                      onChange={this.handleChange}
                      placeholder="0-25% royalties from future resales"
                    ></input>
                    <label
                      style={{
                        marginTop: '5%',
                        paddingTop: '1.25%',
                        paddingBottom: '1.25%',
                        borderStyle: 'dashed',
                        textAlign: 'center',
                      }}
                    >
                      Upload OBJKT
                      <input
                        style={{ display: 'none' }}
                        type="file"
                        name="file"
                        onChange={this.onFileChange}
                      />
                    </label>
                    <br />
                    <p>{this.state.fileTitle}</p>
                    <button
                      style={{ lenght: '100%', cursor: 'pointer' }}
                      onClick={this.onFileUpload}
                    >
                      Mint
                    </button>
                    this operation costs 0.08~ tez
                    {/* redirect to objkt id */}
                    {/* {this.context.op != undefined ? <p>injected operation {this.context.op}</p> : undefined} */}
                  </Card>
                </div>
              ) : (
                <Menu />
              )}
            </Col>
          </Row>
        )}
      </div>
    )
  }
}
