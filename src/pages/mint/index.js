import React, { useContext, useState, useEffect } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Input } from '../../components/input'
import { Button, Curate, Primary } from '../../components/button'
import { Loading } from '../../components/loading'
import { Upload } from '../../components/upload'
import { Preview } from '../../components/preview'
import { prepareFile } from '../../data/ipfs'
import {
  ALLOWED_MIMETYPES,
  ALLOWED_FILETYPES,
  MINT_FILESIZE,
} from '../../constants'

export const Mint = () => {
  const { Tezos, mint, address, getAuth, acc, setAccount } = useContext(HicetnuncContext)
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [amount, setAmount] = useState(1)
  const [file, setFile] = useState() // the uploaded file

  const [message, setMessage] = useState('')

  const handleMint = async () => {
    console.log('mint', Tezos)
    setAccount()
    if (acc === null) {
      alert('sync')
    } else {
      if (ALLOWED_MIMETYPES.indexOf(file.mimeType) === -1) {
        alert(
          `File format invalid. supported formats include: ${ALLOWED_FILETYPES.join(
            ', '
          ).toLocaleLowerCase()}`
        )
      } else {
        // checks file size limit
        const filesize = (file.file.size / 1024 / 1024).toFixed(4)
        if (filesize <= MINT_FILESIZE) {
          // mint
          const nftCid = await prepareFile({
            name: title,
            description,
            tags,
            address,
            buffer: file.buffer,
            mimeType: file.mimeType,
          })
          mint(getAuth(), amount, nftCid[0].hash, 10)
            .then((e) => {
              console.log('mint confirm', e)
              setMessage('Minted successfully')
              // redirect here
            })
            .catch((e) => {
              console.log('mint error', e)
              alert('an error occurred')
              setMessage('an error occurred')
            })
        } else {
          alert(
            `File too big (${filesize}). Limit is currently set at ${MINT_FILESIZE}MB`
          )
        }
      }
    }
  }

  const handlePreview = () => {
    setStep(1)
  }

  const handleFileUpload = (props) => {
    setFile(props)
  }

  const handleValidation = () => {
    if (
      amount > 0 &&
      file
    ) {
      return false
    }
    return true
  }

  return (
    <Page>
      {step === 0 && (
        <>
          <Container>
            <Padding>
              <Input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="title"
              />

              <Input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="description"
              />

              <Input
                type="text"
                onChange={(e) => setTags(e.target.value)}
                placeholder="tags (separated by commas)"
              />

              <Input
                type="number"
                min={1}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="amount"
              />
            </Padding>
          </Container>

          <Container>
            <Padding>
              <Upload label="Upload OBJKT" onChange={handleFileUpload} />
            </Padding>
          </Container>

          <Container>
            <Padding>
              <Button onClick={handlePreview} fit disabled={handleValidation()}>
                <Curate>Preview</Curate>
              </Button>
            </Padding>
          </Container>
        </>
      )}

      {step === 1 && (
        <>
          <Container>
            <Padding>
              <div style={{ display: 'flex' }}>
                <Button onClick={() => setStep(0)} fit>
                  <Primary>
                    <strong>back</strong>
                  </Primary>
                </Button>
              </div>
            </Padding>
          </Container>

          <Container>
            <Padding>
              <Preview
                mimeType={file.mimeType}
                uri={file.reader}
                title={title}
                description={description}
                tags={tags}
              />
            </Padding>
          </Container>

          <Container>
            <Padding>
              <Button onClick={handleMint} fit>
                <Curate>mint</Curate>
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

      {step === 2 && (
        <>
          <Container>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                height: 'calc(100vh - 200px)',
              }}
            >
              preparing OBJKT (NFT)
              <Loading />
            </div>
          </Container>

          {message && (
            <Container>
              <Padding>
                <p>{message}</p>
              </Padding>
            </Container>
          )}
        </>
      )}
    </Page>
  )
}
