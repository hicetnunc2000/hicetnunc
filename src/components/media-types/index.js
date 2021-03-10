import React from 'react'
import { GLBComponent } from './glb'
import { ImageComponent } from './image'
import { VideoComponent } from './video'

export const renderMediaType = (token_info) => {
  const { mimeType, uri } = token_info.formats[0]
  const path = uri.split('//')[1]
  let url

  switch (mimeType) {
    /* IMAGES */
    case 'image/gif':
    case 'image/jpeg':
    case 'image/png':
    case 'image/svg+xml':
    case 'image/bmp':
      url = `https://cloudflare-ipfs.com/ipfs/${path}`
      return <ImageComponent src={url} />
    /* VIDEOS */
    case 'video/mp4':
    case 'video/ogg':
    case 'video/quicktime':
      url = `https://dweb.link/ipfs/${path}`
      return <VideoComponent src={url} />
    /* 3D */
    case 'model/gltf-binary':
    case 'model/gltf+json':
      // TODO: @crzypatchwork to define which domain we extract this from
      url = require('../../media/cube.glb')
      return <GLBComponent src={url} />
    default:
      console.warn('non supported mimeType', mimeType)
      return null
  }
}
