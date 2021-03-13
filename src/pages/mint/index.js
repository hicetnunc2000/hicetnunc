import React, { Component } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Input } from '../../components/input'
import { Button, Curate } from '../../components/button'
import { Loading } from '../../components/loading'
import { getMimeType } from '../../utils/sanitise'
import {
  ALLOWED_MIMETYPES,
  ALLOWED_FILETYPES,
  MINT_FILESIZE,
} from '../../constants'
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
      const [file] = this.state.selectedFile
      const ipfs = new IPFS({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
      })

      // check for mymetype
      const mimeType = file.type !== '' ? file.type : await getMimeType(file)
      const buffer = Buffer.from(await file.arrayBuffer())

      console.log('file', file.type)

      // only allows for supported mimetype
      if (ALLOWED_MIMETYPES.indexOf(mimeType) === -1) {
        alert(
          `File format invalid. supported formats include: ${ALLOWED_FILETYPES.join(
            ', '
          ).toLocaleLowerCase()}`
        )
      } else {
        // checks file size limit
        const filesize = (file.size / 1024 / 1024).toFixed(4)
        if (filesize <= MINT_FILESIZE) {
          const fileCid = 'ipfs://' + (await ipfs.files.add(buffer))[0].hash
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
                  formats: [{ uri: fileCid, mimeType }],
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
        } else {
          alert(
            `File too big (${filesize}). Limit is currently set at ${MINT_FILESIZE}MB`
          )
        }
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
                <div style={{ fontSize: '12px', textTransform: 'lowercase' }}>
                  ({ALLOWED_FILETYPES.join(', ')})
                </div>
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
                <p>this operation costs 0.08~ tez</p>
                <p>10% royalties are set by default</p>
              </Padding>
            </Container>
          </>
        )}
      </Page>
    )
  }
}
