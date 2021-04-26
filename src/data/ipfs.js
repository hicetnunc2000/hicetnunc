import { toHHMMSS } from '../utils/time'
import {
  IPFS_DIRECTORY_MIMETYPE,
  IPFS_DISPLAY_URI_BLACKCIRCLE,
} from '../constants'

const createClient = require('ipfs-http-client')
const Buffer = require('buffer').Buffer
const axios = require('axios')
const readJsonLines = require('read-json-lines-sync').default
const { getCoverImagePathFromBuffer } = require('../utils/html')

const infuraUrl = 'https://ipfs.infura.io:5001'

export const prepareFile = async ({
  name,
  description,
  tags,
  address,
  buffer,
  mimeType,
  extraMedia,
  generateDisplayUri,
}) => {
  const ipfs = createClient(infuraUrl)

  // upload main file
  const info = await ipfs.add(buffer)
  const hash = info.path
  const cid = `ipfs://${hash}`

  // TODO: upload all extra media here
  // set displayUri and thumbnailUri

  // upload extra media
  let displayUri = ''
  let thumbnailUri = IPFS_DISPLAY_URI_BLACKCIRCLE
  let extraFormats = []
  if (generateDisplayUri) {
    const extraMediaMetadata = await uploadExtraMedia(extraMedia)
    displayUri = extraMediaMetadata.displayUri
    thumbnailUri = extraMediaMetadata.thumbnailUri
    extraFormats = extraMediaMetadata.formats
  }

  return await uploadMetadataFile({
    name,
    description,
    tags,
    cid,
    address,
    mimeType,
    displayUri,
    thumbnailUri,
    extraFormats,
  })
}

export const prepareDirectory = async ({
  name,
  description,
  tags,
  address,
  files,
  extraMedia,
  generateDisplayUri,
}) => {
  // upload directory of files
  const hashes = await uploadFilesToDirectory(files)
  const cid = `ipfs://${hashes.directory}`

  // upload extra media
  let displayUri = ''
  let thumbnailUri = IPFS_DISPLAY_URI_BLACKCIRCLE
  let extraFormats = []
  if (generateDisplayUri) {
    // upload
    const extraMediaMetadata = await uploadExtraMedia(extraMedia)
    displayUri = extraMediaMetadata.displayUri
    thumbnailUri = extraMediaMetadata.thumbnailUri
    extraFormats = extraMediaMetadata.formats
  } else if (hashes.cover) {
    // TODO: Remove this once generateDisplayUri option is gone
    displayUri = `ipfs://${hashes.cover}`
  }

  return await uploadMetadataFile({
    name,
    description,
    tags,
    cid,
    address,
    mimeType: IPFS_DIRECTORY_MIMETYPE,
    displayUri,
    thumbnailUri,
    extraFormats,
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
  const endpoint = `${infuraUrl}/api/v0/add?pin=true&recursive=true&wrap-with-directory=true`
  const res = await axios.post(endpoint, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  const data = readJsonLines(res.data)

  // TODO: Remove this once generateDisplayUri option is gone
  // get cover hash
  let cover = null
  const indexFile = files.find((f) => f.path === 'index.html')
  if (indexFile) {
    const indexBuffer = await indexFile.blob.arrayBuffer()
    const coverImagePath = getCoverImagePathFromBuffer(indexBuffer)

    if (coverImagePath) {
      const coverEntry = data.find((f) => f.Name === coverImagePath)
      if (coverEntry) {
        cover = coverEntry.Hash
      }
    }
  }

  const rootDir = data.find((e) => e.Name === '')

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
  displayUri = '',
  thumbnailUri = IPFS_DISPLAY_URI_BLACKCIRCLE,
  extraFormats = [],
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
        formats: [{ uri: cid, mimeType }, ...extraFormats],
        decimals: 0,
        isBooleanAmount: false,
        shouldPreferSymbol: false,
      })
    )
  )
}

async function uploadExtraMedia(extraMedia) {
  console.log('uploadExtraMedia called')
  const ipfs = createClient(infuraUrl)

  let displayUri = ''
  let thumbnailUri = IPFS_DISPLAY_URI_BLACKCIRCLE
  const formats = []
  console.log('extraMedia', extraMedia)
  for (const item of extraMedia) {
    const info = await ipfs.add(item.buffer)
    const hash = info.path
    console.log('item', item)
    const format = getFormatData(item, hash)
    console.log('format', format)
    formats.push(format)
  }

  const imageFormats = formats.filter((f) => {
    return formatIsImage(f) && formatLessThanWidth(f, 1200)
  })

  console.log('imageFormats', imageFormats)

  if (imageFormats.length !== 0) {
    thumbnailUri = imageFormats[0].uri
    displayUri = imageFormats[imageFormats.length - 1].uri
  }

  console.log('formats', formats)
  console.log('displayUri', displayUri)
  console.log('thumbnailUri', thumbnailUri)

  return {
    displayUri,
    thumbnailUri,
    formats,
  }
}

function formatIsImage(format) {
  return format.mimeType.indexOf('image') === 0
}

function formatLessThanWidth(format, width) {
  const dims = format.dimensions.value.split('x').map((v) => parseInt(v))
  return dims[0] < width
}

function getFormatData(item, hash) {
  console.log(item)
  console.log(item.meta)
  console.log(item.meta.mimeType)
  const data = {
    mimeType: item.meta.mimeType,
    uri: `ipfs://${hash}`,
    hash: hash,
    fileSize: item.meta.fileSize,
  }

  if (item.meta.dimensions) {
    const w = item.meta.dimensions.width
    const h = item.meta.dimensions.height
    data.dimensions = {
      value: `${w}x${h}`,
      unit: 'px',
    }
  }

  if (item.meta.duration) {
    data.duration = toHHMMSS(item.meta.duration)
  }

  console.log('format data')
  console.log(data)

  return data
}
