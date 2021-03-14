import React, { useState } from 'react'
// import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Input } from '../../components/input'
import { Button, Curate } from '../../components/button'
// import { Loading } from '../../components/loading'
// import { getMimeType } from '../../utils/sanitise'
import { Upload } from '../../components/upload'
import {
  ALLOWED_MIMETYPES,
  ALLOWED_FILETYPES,
  MINT_FILESIZE,
} from '../../constants'
import styles from './index.module.scss'

export const Mint = () => {
  const [preview, setPreview] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [amount, setAmount] = useState()
  const [file, setFile] = useState()

  // console.log(title, description, tags, amount)

  const handlePreview = () => {
    setPreview(true)
  }

  const handleFileUpload = (props) => {
    console.log('file upload', props)
    setFile(file)
  }

  const handleValidation = () => {
    console.log('handleValidation', title, description, tags, amount)
    if (title !== '' && description !== '' && tags !== '' && amount > 0) {
      return false
    }
    return true
  }

  console.log('render', handleValidation())
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
        <Container>
          <Padding>THIS IS A PREVIEW</Padding>
        </Container>
      )}

      {false && (
        <Container>
          <Padding>
            <p>this operation costs 0.08~ tez</p>
            <p>10% royalties are set by default</p>
          </Padding>
        </Container>
      )}
    </Page>
  )
}
