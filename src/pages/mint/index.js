import React, { useContext, useState, useRef } from 'react'
import { useHistory } from 'react-router'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Input } from '../../components/input'
import { Button, Curate, Primary } from '../../components/button'
import { Upload } from '../../components/upload'
import { Preview } from '../../components/preview'
import { MediaAssetsDisplay } from '../../components/media-assets-display'
import { prepareFile, prepareDirectory } from '../../data/ipfs'
import { getMediaMetadata, unzipMedia } from '../../utils/media'
import { prepareFilesFromZIP } from '../../utils/html'

import {
  ALLOWED_MIMETYPES,
  ALLOWED_FILETYPES_LABEL,
  MINT_FILESIZE,
  MIMETYPE,
  MAX_EDITIONS,
  MIN_ROYALTIES,
  MAX_ROYALTIES,
} from '../../constants'

const COMPRESSOR_URL = 'https://hicetnunc-media-compressor.netlify.app'

// @crzypathwork change to "true" to activate displayUri and thumbnailUri
const GENERATE_DISPLAY_AND_THUMBNAIL = true

export const Mint = () => {
  const { mint, getAuth, acc, setAccount, setFeedback, syncTaquito } =
    useContext(HicetnuncContext)
  // const history = useHistory()
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [amount, setAmount] = useState()
  const [royalties, setRoyalties] = useState()
  const [file, setFile] = useState() // the uploaded file
  const fileMetadata = useRef(null)
  const [extraMedia, setExtraMedia] = useState() // the uploaded or generated cover image

  const handleMint = async () => {
    if (!acc) {
      // warning for sync
      setFeedback({
        visible: true,
        message: 'sync your wallet',
        progress: true,
        confirm: false,
      })

      await syncTaquito()

      setFeedback({
        visible: false,
      })
    } else {
      await setAccount()

      // check mime type
      if (ALLOWED_MIMETYPES.indexOf(file.mimeType) === -1) {
        // alert(
        //   `File format invalid. supported formats include: ${ALLOWED_FILETYPES_LABEL.toLocaleLowerCase()}`
        // )

        setFeedback({
          visible: true,
          message: `File format invalid. supported formats include: ${ALLOWED_FILETYPES_LABEL.toLocaleLowerCase()}`,
          progress: false,
          confirm: true,
          confirmCallback: () => {
            setFeedback({ visible: false })
          },
        })

        return
      }

      // check file size
      const filesize = (file.file.size / 1024 / 1024).toFixed(4)
      if (filesize > MINT_FILESIZE) {
        // alert(
        //   `File too big (${filesize}). Limit is currently set at ${MINT_FILESIZE}MB`
        // )

        setFeedback({
          visible: true,
          message: `File too big (${filesize}). Limit is currently set at ${MINT_FILESIZE}MB`,
          progress: false,
          confirm: true,
          confirmCallback: () => {
            setFeedback({ visible: false })
          },
        })

        return
      }

      // file about to be minted, change to the mint screen

      setStep(2)

      setFeedback({
        visible: true,
        message: 'preparing OBJKT',
        progress: true,
        confirm: false,
      })

      // upload file(s)
      let nftCid
      if (
        [MIMETYPE.ZIP, MIMETYPE.ZIP1, MIMETYPE.ZIP2].includes(file.mimeType)
      ) {
        const files = await prepareFilesFromZIP(file.buffer)

        nftCid = await prepareDirectory({
          name: title,
          description,
          tags,
          address: acc.address,
          files,
          metadata: fileMetadata.current,
          extraMedia,
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
          metadata: fileMetadata.current,
          extraMedia,
          generateDisplayUri: GENERATE_DISPLAY_AND_THUMBNAIL,
        })
      }
      
      mint(getAuth(), amount, nftCid.path, royalties)
    }
  }

  const handlePreview = () => {
    setStep(1)
  }

  const handleFileUpload = async (props) => {
    setFile(props)
    fileMetadata.current = await getMediaMetadata(props.file)
    setExtraMedia(null)
  }

  const handleCoverZipUpload = async (props) => {
    const error =
      'No valid media in zip file. Supported types: jpeg, png, gif, mp4'
    try {
      const media = await unzipMedia(props.buffer)
      if (media.length === 0) {
        alert(error)
        return
      }

      setExtraMedia(media)
    } catch (err) {
      alert(error)
    }
  }

  const limitNumericField = async (target, minValue, maxValue) => {
    if (target.value === '') target.value = '' // Seems redundant but actually cleans up e.g. '234e'
    target.value = Math.round(
      Math.max(Math.min(target.value, maxValue), minValue)
    )
  }

  const handleValidation = () => {
    if (
      amount <= 0 ||
      amount > MAX_EDITIONS ||
      royalties < MIN_ROYALTIES ||
      royalties > MAX_ROYALTIES ||
      !file
    ) {
      return true
    }
    if (GENERATE_DISPLAY_AND_THUMBNAIL && !extraMedia) {
     return true
    } 
    return false
  }

  return (
    <Page title="mint" large>
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
                maxlength="2000"
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
                max={MAX_EDITIONS}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={(e) => {
                  limitNumericField(e.target, 1, MAX_EDITIONS)
                  setAmount(e.target.value)
                }}
                placeholder={`editions (no. editions, 1-${MAX_EDITIONS})`}
                label="editions"
                value={amount}
              />

              <Input
                type="number"
                min={MIN_ROYALTIES}
                max={MAX_ROYALTIES}
                onChange={(e) => setRoyalties(e.target.value)}
                onBlur={(e) => {
                  limitNumericField(e.target, MIN_ROYALTIES, MAX_ROYALTIES)
                  setRoyalties(e.target.value)
                }}
                placeholder={`royalties after each sale (between ${MIN_ROYALTIES}-${MAX_ROYALTIES}%)`}
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

          {file && GENERATE_DISPLAY_AND_THUMBNAIL && (
            <Container>
              <Padding>
                <div>
                  Please use{' '}
                  <a
                    href={COMPRESSOR_URL}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: 'underline',
                      color: 'inherit',
                    }}
                  >
                    this tool
                  </a>{' '}
                  to generate cover/thumbnail assets for your OJBKT, then upload
                  here.
                  <br />
                  <br />
                </div>
                <Upload
                  label="Upload cover/thumbnail media zip"
                  allowedTypes={['.zip']}
                  allowedTypesLabel="zip archive"
                  onChange={handleCoverZipUpload}
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
              <MediaAssetsDisplay media={extraMedia} />
            </Padding>
          </Container>

          <Container>
            <Padding>
              <Button onClick={handleMint} fit>
<<<<<<< HEAD
                <Curate>
                  mint {amount} OBJKT{amount > 1 && 's'}
                </Curate>
=======
                <Curate>mint OBJKT</Curate>
>>>>>>> develop
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
    </Page>
  )
}
