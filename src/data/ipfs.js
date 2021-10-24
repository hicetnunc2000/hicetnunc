import {
  IPFS_DIRECTORY_MIMETYPE,
  IPFS_DEFAULT_THUMBNAIL_URI,
} from '../constants'
//import { NFTStorage, File } from 'nft.storage'
import { getPresignedUrls, uploadToS3, callCompression } from '../utils/audio-compress'

const { create } = require('ipfs-http-client')
const Buffer = require('buffer').Buffer
const axios = require('axios')
const readJsonLines = require('read-json-lines-sync').default
const { getCoverImagePathFromBuffer } = require('../utils/html')

const infuraUrl = 'https://ipfs.infura.io:5001'
//const apiKey = process.env.REACT_APP_IPFS_KEY
//const storage = new NFTStorage({ token: apiKey })

export const prepareFile100MB = async ({
  name,
  description,
  tags,
  address,
  buffer,
  mimeType,
  cover,
  thumbnail,
  generateDisplayUri,
  file
}) => {

  const ipfs = create(infuraUrl)

  let formData = new FormData()
  formData.append('file', file)

  let info = await axios.post('https://hesychasm.herokuapp.com/post_file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)
  const hash = info.path
  const cid = `ipfs://${hash}`

  // upload cover image
  let displayUri = ''
  if (generateDisplayUri) {
    const coverInfo = await ipfs.add(cover.buffer)
    const coverHash = coverInfo.path
    displayUri = `ipfs://${coverHash}`
  }

  // upload thumbnail image
  let thumbnailUri = IPFS_DEFAULT_THUMBNAIL_URI
  // @crzypatch works wants the thumbnailUri to be the black circle
  // if (generateDisplayUri) {
  //   const thumbnailInfo = await ipfs.add(thumbnail.buffer)
  //   const thumbnailHash = thumbnailInfo.path
  //   thumbnailUri = `ipfs://${thumbnailHash}`
  // }

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

export const prepareFile = async ({
  name,
  description,
  tags,
  address,
  buffer,
  mimeType,
  cover,
  thumbnail,
  generateDisplayUri,
  setFeedback
}) => {
  const ipfs = create(infuraUrl)

  // upload main file
 // const ipfs = create(infuraUrl)

  const hash = await ipfs.add(new Blob([buffer]))
  console.log(hash)
  const cid = `ipfs://${hash.path}`

  // upload cover image
  let displayUri = ''
  if (generateDisplayUri) {
    const coverHash = await ipfs.add(new Blob([cover.buffer]))
    console.log(coverHash)
    displayUri = `ipfs://${coverHash.path}`
  }

  // upload thumbnail image
  let thumbnailUri = IPFS_DEFAULT_THUMBNAIL_URI
  // @crzypatch works wants the thumbnailUri to be the black circle
  // if (generateDisplayUri) {
  //   const thumbnailInfo = await ipfs.add(thumbnail.buffer)
  //   const thumbnailHash = thumbnailInfo.path
  //   thumbnailUri = `ipfs://${thumbnailHash}`
  // }
  let compressedAudioUri ='';
  if (mimeType.indexOf('audio') === 0) {
    setFeedback({
      visible: true,
      message: 'compressing audio',
      progress: true,
      confirm: false,
    })
    const compressedAudio = await compressAudio(mimeType, buffer);
    console.log(compressedAudio)
    console.log(compressedAudio.data)
    const hash = await ipfs.add(compressedAudio.data)
    console.log(hash)
    compressedAudioUri = `ipfs://${hash.path}`
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
    compressedAudioUri,
    setFeedback
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
  generateDisplayUri,
}) => {
  // upload directory of files
  const hashes = await uploadFilesToDirectory(files)
  const cid = `ipfs://${hashes.directory}`

  // upload cover image
  const ipfs = create(infuraUrl)

  let displayUri = ''
  if (generateDisplayUri) {
    const coverInfo = await ipfs.add(cover.buffer)
    const coverHash = coverInfo.path
    displayUri = `ipfs://${coverHash}`
  } else if (hashes.cover) {
    // TODO: Remove this once generateDisplayUri option is gone
    displayUri = `ipfs://${hashes.cover}`
  }

  // upload thumbnail image
  let thumbnailUri = IPFS_DEFAULT_THUMBNAIL_URI

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
  thumbnailUri = IPFS_DEFAULT_THUMBNAIL_URI,
  compressedAudioUri = '',
  setFeedback
}) {
  const ipfs = create(infuraUrl)
  setFeedback({
    visible: true,
    message: 'uploading metadata',
    progress: true,
    confirm: false,
  })
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
        formats: [{ uri: cid, mimeType, compressedAudioUri }],
        decimals: 0,
        isBooleanAmount: false,
        shouldPreferSymbol: false,
      })
    )
  )
}

const compressAudio = async (type, buffer) => {

  try {
      if (type && buffer) {
          const presignedUrls = await getPresignedUrls(type);
          const getUrl = presignedUrls.presignedGet
          const filePath = await uploadToS3(type, new Blob([buffer]), presignedUrls);
          console.log('filePath is', filePath);
          const compressedFile = await callCompression(filePath, getUrl)
          return compressedFile;
      }
  } catch (err) {
      console.log('error is', err);
  }
};


