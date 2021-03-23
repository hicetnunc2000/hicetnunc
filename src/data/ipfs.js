const createClient = require('ipfs-http-client')
const Buffer = require('buffer').Buffer
const { v4: uuidv4 } = require('uuid')
const { post } = require('axios')

export const prepareFile = async ({
  name,
  description,
  tags,
  address,
  buffer,
  mimeType,
}) => {
  const ipfs = createClient('https://ipfs.infura.io:5001')
  const hash = await ipfs.files.add(buffer)
  const fileCid = `ipfs://${hash[0].hash}`

  const result = await ipfs.files.add(
    Buffer.from(
      JSON.stringify({
        name,
        description,
        tags: tags.replace(/\s/g, '').split(','),
        symbol: 'OBJKT',
        artifactUri: fileCid,
        creators: [address],
        formats: [{ uri: fileCid, mimeType }],
        thumbnailUri: 'ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc',
        decimals: 0,
        isBooleanAmount: false,
        shouldPreferSymbol: false,
      })
    )
  )
  return result
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

  // create and upload meta file
  const ipfs = createClient('https://ipfs.infura.io:5001')
  const result = await ipfs.files.add(
    Buffer.from(
      JSON.stringify({
        name,
        description,
        tags: tags.replace(/\s/g, '').split(','),
        symbol: 'OBJKT',
        artifactUri: cid,
        creators: [address],
        formats: [{ uri: cid, mimeType: 'application/x-directory' }],
        thumbnailUri: 'ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc',
        decimals: 0,
        isBooleanAmount: false,
        shouldPreferSymbol: false,
      })
    )
  )

  return result
}

async function uploadFilesToDirectory (files) {
  const formData = new FormData()

  console.log('Upload files to IPFS')
  console.log(files)

  files.forEach(file => {
    formData.append('file', file.blob, {
      filepath: file.path
    })
  })

  const endpoint = 'https://ipfs.infura.io:5001/api/v0/add?pin=true&recursive=true&wrap-with-directory=true'
  const res = await post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return res.data.Hash
}