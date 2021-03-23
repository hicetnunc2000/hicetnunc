const createClient = require('ipfs-http-client')
const Buffer = require('buffer').Buffer
const axios = require('axios')
const readJsonLines = require('read-json-lines-sync').default

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
    mimeType
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
  const hash = await uploadFilesToDirectory(files)
  const cid = `ipfs://${hash}`

  return await uploadMetadataFile({
    name,
    description,
    tags,
    cid,
    address,
    mimeType: 'application/x-directory'
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
  const rootDir = data.find(e => e.Name === '')
  return rootDir.Hash
}

async function uploadMetadataFile({name, description, tags, cid, address, mimeType}) {
  const ipfs = createClient('https://ipfs.infura.io:5001')

  return await ipfs.add(
    Buffer.from(
      JSON.stringify({
        name,
        description,
        tags: tags.replace(/\s/g, '').split(','),
        symbol: 'OBJKT',
        artifactUri: cid,
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