import * as fflate from 'fflate'
import mime from 'mime-types'
import { ALLOWED_COVER_MIMETYPES } from '../constants'

export async function unzipMedia(buffer) {
  // unzip into blobs
  let entries = fflate.unzipSync(buffer)
  entries = Object.entries(entries).map((entry) => {
    const fileName = getFileName(entry[0])
    return {
      fileName,
      buffer: entry[1],
    }
  })

  // keep only images/videos
  entries = entries
    .map((e) => {
      e.mimeType = mime.lookup(e.fileName)
      return e
    })
    .filter((e) => {
      return ALLOWED_COVER_MIMETYPES.includes(e.mimeType)
    })

  // format as: { meta, blob, reader }
  const media = []
  for (let i = 0; i < entries.length; i++) {
    const buffer = entries[i].buffer
    const type = entries[i].mimeType
    const blob = new Blob([buffer], { type })
    let meta
    if (blob.type.indexOf('video') === 0) {
      meta = await getVideoMetadata(blob)
    } else if (blob.type.indexOf('image') === 0) {
      meta = await getImageMetadata(blob)
    }
    const reader = await blobToDataURL(blob)
    media.push({ meta, blob, reader })
  }

  return media
}

export function getImageMetadata(blob) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        mimeType: blob.type,
        fileSize: blob.size,
        dimensions: {
          width: img.width,
          height: img.height,
        },
      })
    }
    img.onerror = (err) => {
      reject(err)
    }
    img.src = URL.createObjectURL(blob)
  })
}

export function getVideoMetadata(blob) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.addEventListener(
      'loadedmetadata',
      () => {
        resolve({
          mimeType: blob.type,
          fileSize: blob.size,
          duration: video.duration,
          dimensions: {
            width: video.videoWidth,
            height: video.videoHeight,
          },
        })
      },
      false
    )
    video.addEventListener('error', (err) => {
      reject(err)
    })

    video.src = URL.createObjectURL(blob)
  })
}

function toHHMMSS(sec) {
  var hours = Math.floor(sec / 3600)
  var minutes = Math.floor((sec - hours * 3600) / 60)
  var seconds = sec - hours * 3600 - minutes * 60

  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return hours + ':' + minutes + ':' + seconds
}

async function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

function getFileName(path) {
  const parts = path.split('/')
  return parts[parts.length - 1]
}
