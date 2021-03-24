const createClient = require('ipfs-http-client')
const Buffer = require('buffer').Buffer
const axios = require('axios')
const readJsonLines = require('read-json-lines-sync').default
const { getCoverImagePathFromBuffer } = require('../utils/html')

export const prepareFile = async ({
  name,
  description,
  tags,
  address,
  buffer,
  mimeType,
}) => {
  const ipfs = createClient('https://ipfs.infura.io:5001')
  const info = await ipfs.add(buffer)
  const hash = info.path
  const cid = `ipfs://${hash}`

  return await uploadMetadataFile({
    name,
    description,
    tags,
    cid,
    address,
    mimeType,
  })
}

export const prepareDirectory = async ({
  name,
  description,
  tags,
  address,
  files,
}) => {
  // upload files
  const hashes = await uploadFilesToDirectory(files)
  const cid = `ipfs://${hashes.directory}`
  const displayUri = `ipfs://${hashes.cover}`

  return await uploadMetadataFile({
    name,
    description,
    tags,
    cid,
    address,
    mimeType: 'application/x-directory',
    displayUri
  })
}

function not_directory(file) {
  return file.blob.type !== 'application/x-directory';
}

async function uploadFilesToDirectory (files) {
  files = files.filter(not_directory)

  const form = new FormData()

  files.forEach(file => {
    form.append('file', file.blob, encodeURIComponent(file.path))
  })
  const endpoint = 'https://ipfs.infura.io:5001/api/v0/add?pin=true&recursive=true&wrap-with-directory=true'
  const res = await axios.post(endpoint, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  const data = readJsonLines(res.data)

  // get cover hash if it exists
  let cover = null
  const indexFile = files.find(f => f.path === 'index.html')
  if (indexFile) {
    const indexBuffer = await indexFile.blob.arrayBuffer()
    const coverImagePath = getCoverImagePathFromBuffer(indexBuffer)

    if (coverImagePath) {
      const coverEntry = data.find(f => f.Name === coverImagePath)
      if (coverEntry) {
        cover = coverEntry.Hash
      }
    }
  }

  const rootDir = data.find(e => e.Name === '')
  const directory = rootDir.Hash

  return { directory, cover }
}

async function uploadMetadataFile({
  name,
  description,
  tags,
  cid,
  address,
  mimeType,
  displayUri = null
}) {
  const ipfs = createClient('https://ipfs.infura.io:5001')

  return await ipfs.add(
    Buffer.from(
      JSON.stringify({
        name,
        description,
        tags: tags.replace(/\s/g, '').split(','),
        symbol: 'OBJKT',
        artifactUri: cid,
        displayUri,
        creators: [address],
        formats: [{ uri: cid, mimeType }],
        thumbnailUri: 'ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc',
        decimals: 0,
        isBooleanAmount: false,
        shouldPreferSymbol: false,
      })
    )
  )
}

