import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Input } from '../../components/input'
import { Button, Curate, Primary } from '../../components/button'
import { Loading } from '../../components/loading'
import { Upload } from '../../components/upload'
import { Preview } from '../../components/preview'
import { prepareFile, prepareDirectory } from '../../data/ipfs'
import { prepareFilesFromZIP } from '../../utils/html'
import { generateCompressedImage } from '../../utils/compress'

import {
  ALLOWED_MIMETYPES,
  ALLOWED_FILETYPES_LABEL,
  ALLOWED_COVER_MIMETYPES,
  ALLOWED_COVER_FILETYPES_LABEL,
  MINT_FILESIZE,
  MIMETYPE,
  PATH,
} from '../../constants'

const coverOptions = {
  quality: 0.85,
  maxWidth: 1024,
  maxHeight: 1024,
}

const thumbnailOptions = {
  quality: 0.85,
  maxWidth: 350,
  maxHeight: 350,
}

// @crzypathwork change to "true" to activate displayUri and thumbnailUri
const GENERATE_DISPLAY_AND_THUMBNAIL = false

export const Mint = () => {
  const { mint, getAuth, acc, setAccount } = useContext(HicetnuncContext)
  const history = useHistory()
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [amount, setAmount] = useState()
  const [royalties, setRoyalties] = useState()
  const [file, setFile] = useState() // the uploaded file
  const [cover, setCover] = useState() // the uploaded or generated cover image
  const [thumbnail, setThumbnail] = useState() // the uploaded or generated cover image
  const [message, setMessage] = useState('')
  const [needsCover, setNeedsCover] = useState(false)

  const handleMint = async () => {
    setAccount()
    if (!acc) {
      alert('sync')
      return
    }

    // check mime type
    if (ALLOWED_MIMETYPES.indexOf(file.mimeType) === -1) {
      alert(
        `File format invalid. supported formats include: ${ALLOWED_FILETYPES_LABEL.toLocaleLowerCase()}`
      )
      return
    }

    // check file size
    const filesize = (file.file.size / 1024 / 1024).toFixed(4)
    if (filesize > MINT_FILESIZE) {
      alert(
        `File too big (${filesize}). Limit is currently set at ${MINT_FILESIZE}MB`
      )
      return
    }

    // file about to be minted, change to the mint screen

    setStep(2)
    // upload file(s)
    let nftCid
    if ([MIMETYPE.ZIP, MIMETYPE.ZIP1, MIMETYPE.ZIP2].includes(file.mimeType)) {
      const files = await prepareFilesFromZIP(file.buffer)

      nftCid = await prepareDirectory({
        name: title,
        description,
        tags,
        address: acc.address,
        files,
        cover,
        thumbnail,
        generateDisplayUri: GENERATE_DISPLAY_AND_THUMBNAIL,
      })
    } else {
      // process all other files
      nftCid = await prepareFile({
        name: title,
        description,
        tags,
        address: acc.address,
        buffer: file.buffer,
        mimeType: file.mimeType,
        cover,
        thumbnail,
        generateDisplayUri: GENERATE_DISPLAY_AND_THUMBNAIL,
      })
    }

    mint(getAuth(), amount, nftCid.path, royalties)
      .then((e) => {
        console.log('mint confirm', e)
        setMessage('Minted successfully')
        // redirect here
        history.push(PATH.FEED)
      })
      .catch((e) => {
        console.log('mint error', e)
        alert('an error occurred')
        setMessage('an error occurred')
      })
  }

  const handlePreview = () => {
    setStep(1)
  }

  const handleFileUpload = async (props) => {
    setFile(props)

    if (GENERATE_DISPLAY_AND_THUMBNAIL) {
      if (props.mimeType.indexOf('image') === 0) {
        setNeedsCover(false)
        await generateCoverAndThumbnail(props.file)
      } else {
        setNeedsCover(true)
      }
    }
  }

  const handleCoverUpload = async (props) => {
    await generateCoverAndThumbnail(props.file)
  }

  const generateCoverAndThumbnail = async (file) => {
    const cover = await generateCompressedImage(file, coverOptions)
    setCover(cover)

    const thumb = await generateCompressedImage(file, thumbnailOptions)
    setThumbnail(thumb)
  }

  const handleValidation = () => {
    if (GENERATE_DISPLAY_AND_THUMBNAIL) {
      if (amount > 0 && file && cover && thumbnail && royalties >= 10) {
        return false
      }
    } else {
      if (amount > 0 && file && royalties >= 10) {
        return false
      }
    }

    return true
  }

  return (
    <Page title="mint">
      {step === 0 && (
        <>
          <Container>
            <Padding>
              <Input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="title"
                label="title"
                value={title}
              />

              <Input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="description"
                label="description"
                value={description}
              />

              <Input
                type="text"
                onChange={(e) => setTags(e.target.value)}
                placeholder="tags (comma separated. example: illustration, digital)"
                label="tags"
                value={tags}
              />

              <Input
                type="number"
                min={1}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="editions (no. editions)"
                label="editions"
                value={amount}
              />

              <Input
                type="number"
                min={10}
                max={25}
                onChange={(e) => setRoyalties(e.target.value)}
                placeholder="royalties after each sale (between 10-25%)"
                label="royalties"
                value={royalties}
              />
            </Padding>
          </Container>

          <Container>
            <Padding>
              <Upload
                label="Upload OBJKT"
                allowedTypesLabel={ALLOWED_FILETYPES_LABEL}
                onChange={handleFileUpload}
              />
            </Padding>
          </Container>

          {file && needsCover && (
            <Container>
              <Padding>
                <Upload
                  label="Upload cover image"
                  allowedTypes={ALLOWED_COVER_MIMETYPES}
                  allowedTypesLabel={ALLOWED_COVER_FILETYPES_LABEL}
                  onChange={handleCoverUpload}
                />
              </Padding>
            </Container>
          )}

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
                <Curate>mint {amount} OBJKTs</Curate>
              </Button>
            </Padding>
          </Container>

          <Container>
            <Padding>
              <p>this operation costs 0.08~ tez</p>
              <p>Your royalties upon each sale are {royalties}%</p>
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
              preparing OBJKT
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
