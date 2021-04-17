import Compressor from 'compressorjs'

function compressImage(file, options) {
  return new Promise(async (resolve, reject) => {
    new Compressor(file, {
      ...options,
      success(blob) {
        resolve(blob)
      },
      error(err) {
        reject(err)
      },
    })
  })
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
