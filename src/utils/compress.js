// import Compressor from 'compressorjs'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { MIMETYPE } from '../constants'

const ffmpeg = createFFmpeg({ log: true })

// // with compressorjs
// async function compressImage(file, options) {
//   return new Promise(async (resolve, reject) => {
//     new Compressor(file, {
//       ...options,
//       success(blob) {
//         resolve(blob)
//       },
//       error(err) {
//         reject(err)
//       },
//     })
//   })
// }

// with ffmpeg.wasm
async function compressImage(file, params) {
  if (!params.maxWidth) {
    throw new Error('Missing maxWidth option')
  }

  if (!params.maxHeight) {
    throw new Error('Missing maxHeight option')
  }

  if (!params.quality) {
    throw new Error('Missing quality option')
  }

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }

  ffmpeg.FS('writeFile', file.name, await fetchFile(file))

  // run ffmpeg command
  const args = getArgs(file, params)
  await ffmpeg.run(...args)

  // get data
  // const nameParts = file.name.split('.')
  // const ext = nameParts[nameParts.length - 1]
  const data = ffmpeg.FS('readFile', `compressed.mp4`)
  console.log(data)
  const blob = new Blob([data.buffer], { type: 'video/mp4' })
  console.log(blob)

  // tmp: test results
  // const img = new Image()
  // document.body.appendChild(img)
  // img.src = URL.createObjectURL(blob)

  const video = document.createElement('video')
  document.body.appendChild(video)
  video.src = URL.createObjectURL(blob)

  return blob
}

function getArgs(file, params) {
  console.log('getArgs')
  console.log(file)
  console.log(params)

  switch (file.type) {
    case MIMETYPE.GIF:
      // animted gif
      return [
        '-i',
        file.name,
        '-vf',
        `scale=${params.maxWidth}:-1`,
        '-q:v',
        4,
        'compressed.mp4',
      ]
      break
    default:
      // standard image
      return [
        '-i',
        file.name,
        '-vf',
        `scale=${params.maxWidth}:-1`,
        '-q:v',
        4,
        'compressed.jpg',
      ]
  }
}

async function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

export async function generateCompressedImage(file, options) {
  const blob = await compressImage(file, options)
  const mimeType = blob.type
  const buffer = await blob.arrayBuffer()
  const reader = await blobToDataURL(blob)
  return { mimeType, buffer, reader }
}
