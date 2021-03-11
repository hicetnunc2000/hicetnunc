import React, { Component } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Input } from '../../components/input'
import { Button, Curate } from '../../components/button'
import { Loading } from '../../components/loading'
import styles from './index.module.scss'

const IPFS = require('ipfs-api')
const Buffer = require('buffer').Buffer

export class Mint extends Component {
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
      <Page>
        {this.context.load ? (
          <div className={styles.mint}>
            preparing OBJKT (NFT)
            <Loading />
          </div>
        ) : (
          <>
            <Container>
              <Padding>
                <Input
                  type="text"
                  name="title"
                  onChange={this.handleChange}
                  placeholder="OBJKT title"
                />

                <Input
                  type="text"
                  name="description"
                  onChange={this.handleChange}
                  placeholder="OBJKT description"
                />

                <Input
                  type="text"
                  name="tags"
                  onChange={this.handleChange}
                  placeholder="tags (separated by commas)"
                />

                <Input
                  type="text"
                  name="amount"
                  onChange={this.handleChange}
                  placeholder="amount of OBJKTs"
                />
              </Padding>
            </Container>

            <Container>
              <Padding>
                <label
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '6px',
                    borderStyle: 'dashed',
                    textAlign: 'center',
                  }}
                >
                  Upload OBJKT
                  <input
                    style={{ display: 'none', width: '100%' }}
                    type="file"
                    name="file"
                    onChange={this.onFileChange}
                  />
                </label>
              </Padding>
            </Container>

            <Container>
              <Padding>
                <p>{this.state.fileTitle}</p>
                <Button onClick={this.onFileUpload} fit>
                  <Curate>Mint</Curate>
                </Button>
              </Padding>
            </Container>

            <Container>
              <Padding>
                <span>this operation costs 0.08~ tez</span>
                <span>10% royalties are set by default</span>
              </Padding>
            </Container>
          </>
        )}
      </Page>
    )
  }
}
