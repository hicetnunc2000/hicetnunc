import React, { useState } from 'react'
// import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Input } from '../../components/input'
// import { Button, Curate } from '../../components/button'
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
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [tags, setTags] = useState()
  const [amount, setAmount] = useState()

  console.log(title, description, tags, amount)

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
            type="text"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="amount"
          />
        </Padding>
      </Container>

      <Container>
        <Padding>
          <Upload label="Upload OBJKT" />
        </Padding>
      </Container>
    </Page>
  )
}
