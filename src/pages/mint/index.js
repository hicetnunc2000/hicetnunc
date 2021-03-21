import React, { useContext, useState } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Input } from '../../components/input'
import { Button, Curate } from '../../components/button'
import { Loading } from '../../components/loading'
import { Upload } from '../../components/upload'
import { Preview } from '../../components/preview'
import { prepareFile } from '../../data/ipfs'
import { prepareFilesFromZIP } from '../../utils/html'
import {
  ALLOWED_MIMETYPES,
  ALLOWED_FILETYPES,
  MINT_FILESIZE,
  MIMETYPE,
} from '../../constants'

export const Mint = () => {
  const { Tezos, mint, address, getAuth } = useContext(HicetnuncContext)
  const [preview, setPreview] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [amount, setAmount] = useState(1)
  const [file, setFile] = useState() // the uploaded file

  const [progress, setProgress] = useState(false)
  const [message, setMessage] = useState('')

  const handleMint = async () => {
    console.log('mint', Tezos)

    if (Tezos === null) {
      alert('sync')
    } else {
      if (ALLOWED_MIMETYPES.indexOf(file.mimeType) === -1) {
        alert(
          `File format invalid. supported formats include: ${ALLOWED_FILETYPES.join(
            ', '
          ).toLocaleLowerCase()}`
        )
      } else {

        if (file.mimeType === MIMETYPE.HTML_ZIP) {
          const files = await prepareFilesFromZIP(file.reader)
          console.log(files)
        }    

        /*

        TODO: In case of HTML_ZIP type, upload all files (directories?)

        */

        // // checks file size limit
        // const filesize = (file.file.size / 1024 / 1024).toFixed(4)
        // if (filesize <= MINT_FILESIZE) {
        //   setProgress(true)
        //   setMessage('minting...')
        //   // mint
        //   const nftCid = await prepareFile({
        //     name: title,
        //     description,
        //     tags,
        //     address,
        //     buffer: file.buffer,
        //     mimeType: file.mimeType,
        //   })
        //   mint(getAuth(), amount, nftCid[0].hash, 10)
        //     .then((e) => {
        //       console.log('confirmado', e)
        //       setProgress(false)
        //       setMessage(e.description)
        //       // redirect here
        //     })
        //     .catch((e) => {
        //       setProgress(false)
        //       setMessage('an error occurred')
        //     })
        // } else {
        //   alert(
        //     `File too big (${filesize}). Limit is currently set at ${MINT_FILESIZE}MB`
        //   )
        // }
      }
    }
  }

  const handlePreview = () => {
    setPreview(true)
  }

  const handleFileUpload = (props) => {
    setFile(props)
  }

  const handleValidation = () => {
    if (
      title !== '' &&
      description !== '' &&
      tags !== '' &&
      amount > 0 &&
      file
    ) {
      return false
    }
    return true
  }

  return (
    <Page>
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

      {!preview && (
        <Container>
          <Padding>
            <Button onClick={handlePreview} fit disabled={handleValidation()}>
              <Curate>Preview</Curate>
            </Button>
          </Padding>
        </Container>
      )}

      {preview && (
        <>
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

              <div>
                <p>{message}</p>
                {progress && <Loading />}
              </div>
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
