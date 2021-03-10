import React from 'react'
import { ImageComponent } from './image'
import { VideoComponent } from './video'

export const renderMediaType = (token_info) => {
  const { mimeType, uri } = token_info.formats[0]
  let url

  switch (mimeType) {
    case 'image/gif':
    case 'image/jpeg':
    case 'image/png':
    case 'image/svg+xml':
    case 'image/bmp':
      url = `https://cloudflare-ipfs.com/ipfs/${uri.split('//')[1]}`
      return <ImageComponent src={url} />
    case 'video/mp4':
    case 'video/ogg':
    case 'video/quicktime':
      url = `https://dweb.link/ipfs/${uri.split('//')[1]}`
      return <VideoComponent src={url} />
    default:
      console.warn('non supported mimeType', mimeType)
      return null
  }
}
