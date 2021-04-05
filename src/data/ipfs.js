import { IPFS_DIRECTORY_MIMETYPE } from '../constants'

const createClient = require('ipfs-http-client')
const Buffer = require('buffer').Buffer
const axios = require('axios')
const readJsonLines = require('read-json-lines-sync').default

const infuraUrl = 'https://ipfs.infura.io:5001'

export const prepareFile = async ({
  name,
  description,
  tags,
  address,
  buffer,
  mimeType,
  cover,
  thumbnail,
}) => {
  const ipfs = createClient(infuraUrl)

  // upload main file
  const info = await ipfs.add(buffer)
  const hash = info.path
  const cid = `ipfs://${hash}`

  // upload cover image
  const coverInfo = await ipfs.add(cover.buffer)
  const coverHash = coverInfo.path
  const displayUri = `ipfs://${coverHash}`

  // upload thumbnail image
  const thumbnailInfo = await ipfs.add(thumbnail.buffer)
  const thumbnailHash = thumbnailInfo.path
  const thumbnailUri = `ipfs://${thumbnailHash}`

  return await uploadMetadataFile({
    name,
    description,
    tags,
    cid,
    address,
    mimeType,
    displayUri,
    thumbnailUri,
  })
}

export const prepareDirectory = async ({
  name,
  description,
  tags,
  address,
  files,
  cover,
  thumbnail,
}) => {
  // upload directory of files
  const hashes = await uploadFilesToDirectory(files)
  const cid = `ipfs://${hashes.directory}`

  // upload cover image
  const ipfs = createClient(infuraUrl)
  const coverInfo = await ipfs.add(cover.buffer)
  const coverHash = coverInfo.path
  const displayUri = `ipfs://${coverHash}`

  // upload thumbnail image
  const thumbnailInfo = await ipfs.add(thumbnail.buffer)
  const thumbnailHash = thumbnailInfo.path
  const thumbnailUri = `ipfs://${thumbnailHash}`

  return await uploadMetadataFile({
    name,
    description,
    tags,
    cid,
    address,
    mimeType: IPFS_DIRECTORY_MIMETYPE,
    displayUri,
    thumbnailUri,
  })
}

function not_directory(file) {
  return file.blob.type !== IPFS_DIRECTORY_MIMETYPE
}

async function uploadFilesToDirectory(files) {
  files = files.filter(not_directory)

  const form = new FormData()

  files.forEach((file) => {
    form.append('file', file.blob, encodeURIComponent(file.path))
  })
  const endpoint =
    `${infuraUrl}/api/v0/add?pin=true&recursive=true&wrap-with-directory=true`
  const res = await axios.post(endpoint, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  const data = readJsonLines(res.data)
  const rootDir = data.find((e) => e.Name === '')

  return rootDir.Hash
}

async function uploadMetadataFile({
  name,
  description,
  tags,
  cid,
  address,
  mimeType,
  displayUri = '',
  thumbnailUri = 'ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc'
}) {
  const ipfs = createClient(infuraUrl)

  return await ipfs.add(
    Buffer.from(
      JSON.stringify({
        name,
        description,
        tags: tags.replace(/\s/g, '').split(','),
        symbol: 'OBJKT',
        artifactUri: cid,
        displayUri,
        thumbnailUri,
        creators: [address],
        formats: [{ uri: cid, mimeType }],
        decimals: 0,
        isBooleanAmount: false,
        shouldPreferSymbol: false,
      })
    )
  )
}
