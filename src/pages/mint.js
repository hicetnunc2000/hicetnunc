import React, { Component } from 'react'
import { Card, Col, Row } from 'reactstrap'
import { BabelLoading } from 'react-loadingg'
import { HicetnuncContext } from '../context/HicetnuncContext'

const IPFS = require('ipfs-api')
const Buffer = require('buffer').Buffer

export default class Mint extends Component {
  static contextType = HicetnuncContext

  state = {
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
    royalties: 10,
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () =>
      console.log(this.state)
    )
  }

  onFileChange = (event) => {
    this.setState({
      selectedFile: event.target.files,
      fileTitle: event.target.files[0].name,
    })
  }

  onFileUpload = async (e) => {
    if (this.context.Tezos == null) {
      alert('sync')
    } else {
      this.context.loading()

      const icon = 'ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc'

      const files = this.state.selectedFile
      const ipfs = new IPFS({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
      })

      console.log(files)
      console.log(Buffer.from(await files[0].arrayBuffer()))

      // 40mb limit
      if (files[0].size < 100000000) {
        const fileCid =
          'ipfs://' +
          (await ipfs.files.add(Buffer.from(await files[0].arrayBuffer())))[0]
            .hash
        const nftCid = (
          await ipfs.files.add(
            Buffer.from(
              JSON.stringify({
                name: this.state.title,
                description: this.state.description,
                tags: this.state.tags.replace(/\s/g, '').split(','),
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
                    name="tags"
                    onChange={this.handleChange}
                    placeholder="tags (separated by commas)"
                  ></input>
                  <input
                    type="text"
                    name="amount"
                    onChange={this.handleChange}
                    placeholder="amount of OBJKTs"
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
                  <span>this operation costs 0.08~ tez</span>
                  <span>10% royalties are set by default</span>
                  {/* redirect to objkt id */}
                  {/* {this.context.op != undefined ? <p>injected operation {this.context.op}</p> : undefined} */}
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}
