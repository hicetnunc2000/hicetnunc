import Compress from 'client-compress'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { toHHMMSS } from '../utils/time'
import { MIMETYPE } from '../constants'

const VIDEO_MIMETYPES = [
  MIMETYPE.MP4,
  MIMETYPE.OGV,
  MIMETYPE.QUICKTIME,
  MIMETYPE.WEBM,
]

const DEBUG = false

const imageSettings = {
  quality: 4, // ffmpeg
  fallbackQuality: 0.85, // client-compress
  sizes: [256, 512, 1024, 2048],
}

const videoSettings = {
  quality: 4, // ffmpeg
  maxTime: 15, // seconds
  sizes: [512, 1024],
}

const ffmpeg = createFFmpeg({ log: DEBUG })

export const FFMPEG_SUPPORTED = typeof SharedArrayBuffer === 'function'

export async function generateCompressedMedia(file) {
  if (FFMPEG_SUPPORTED && !ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }

  let srcMeta
  if (VIDEO_MIMETYPES.includes(file.type)) {
    srcMeta = await getVideoMetadata(file)
  } else {
    srcMeta = await getImageMetadata(file)
  }

  const media = []

  if (VIDEO_MIMETYPES.includes(file.type)) {
    // generate JPEGs, and MP4s when possible
    media.push(await generateImages(file, srcMeta, 'jpg'))
    if (FFMPEG_SUPPORTED) {
      media.push(await generateVideos(file, srcMeta, 'mp4'))
    }
  } else if (file.type === MIMETYPE.GIF && FFMPEG_SUPPORTED) {
    // generate GIFs
    media.push(await generateImages(file, srcMeta, 'gif'))
  } else {
    // generate JPEGs
    media.push(await generateImages(file, srcMeta, 'jpg'))
  }

  return media.flat()
}

async function generateImages(file, srcMeta, extension) {
  const images = []
  const quality = FFMPEG_SUPPORTED
    ? imageSettings.quality
    : imageSettings.fallbackQuality
  for (const size of imageSettings.sizes) {
    if (size < srcMeta.dimensions.width) {
      images.push(
        await generateImage(file, srcMeta, { size, quality, extension })
      )
    }
  }
  return images
}

async function generateVideos(file, srcMeta, extension) {
  const videos = []
  const quality = videoSettings.quality
  const maxTime = videoSettings.maxTime
  for (const size of videoSettings.sizes) {
    if (size < srcMeta.dimensions.width) {
      videos.push(
        await generateVideo(file, srcMeta, {
          size,
          quality,
          maxTime,
          extension,
        })
      )
    }
  }
  return videos
}

async function generateImage(file, srcMeta, { size, quality, extension }) {
  if (FFMPEG_SUPPORTED) {
    return await generateImageFfmpeg(file, srcMeta, {
      size,
      quality,
      extension,
    })
  } else {
    return await generateImageFallback(file, srcMeta, {
      size,
      quality,
      extension,
    })
  }
}

async function generateImageFfmpeg(
  file,
  srcMeta,
  { size, quality, extension }
) {
  const inFilename = `input`
  const outFilename = `compressed_${size}.${extension}`

  // use ffmpeg
  ffmpeg.FS('writeFile', inFilename, await fetchFile(file))

  if (VIDEO_MIMETYPES.includes(srcMeta.mimeType)) {
    // Select middle frame
    const time = toHHMMSS(srcMeta.duration * 0.5)
    await ffmpeg.run(
      '-ss',
      time,
      '-i',
      inFilename,
      '-vf',
      `scale=${size}:-1`,
      '-q:v',
      quality,
      outFilename
    )
  } else if (MIMETYPE.GIF === srcMeta.mimeType) {
    // TODO: Optimize GIF
    await ffmpeg.run(
      '-i',
      inFilename,
      '-vf',
      `scale=${size}:-1`,
      '-q:v',
      quality,
      outFilename
    )
  } else {
    // JPG
    await ffmpeg.run(
      '-i',
      inFilename,
      '-vf',
      `scale=${size}:-1`,
      '-q:v',
      quality,
      outFilename
    )
  }

  const mimeType =
    MIMETYPE.GIF === srcMeta.mimeType ? MIMETYPE.GIF : MIMETYPE.JPEG

  const data = ffmpeg.FS('readFile', outFilename)
  const blob = new Blob([data.buffer], { type: mimeType })

  const meta = await getImageMetadata(blob)
  const buffer = await blob.arrayBuffer()
  const reader = await blobToDataURL(blob)
  return { meta, buffer, reader }
}

async function generateVideo(
  file,
  srcMeta,
  { size, quality, maxTime, extension }
) {
  const inFilename = `input`
  const outFilename = `compressed_${size}.${extension}`

  ffmpeg.FS('writeFile', inFilename, await fetchFile(file))

  await ffmpeg.run(
    '-i',
    inFilename,
    '-t',
    maxTime.toString(),
    '-vf',
    `scale=${size}:-2`,
    '-q:v',
    quality,
    outFilename
  )

  const data = ffmpeg.FS('readFile', outFilename)
  const blob = new Blob([data.buffer], { type: `video/${extension}` })

  const meta = await getVideoMetadata(blob)
  const buffer = await blob.arrayBuffer()
  const reader = await blobToDataURL(blob)

  return { meta, buffer, reader }
}

async function generateImageFallback(file, srcMeta, { size, quality }) {
  // fallback options
  const options = {
    quality,
    maxWidth: size,
  }

  const blob = await compressImage(file, options)
  const meta = await getImageMetadata(blob)
  const buffer = await blob.arrayBuffer()
  const reader = await blobToDataURL(blob)
  return { meta, buffer, reader }
}

async function compressImage(file, options) {
  const compressor = new Compress(options)
  const results = await compressor.compress([file])
  const { photo } = results[0]
  return photo.data
}

async function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

function getImageMetadata(blob) {
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

    if (DEBUG) document.body.appendChild(img)
  })
}

function getVideoMetadata(blob) {
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
    video.setAttribute('controls', true)

    if (DEBUG) document.body.appendChild(video)
  })
}
