import React from 'react'
import { GLBComponent } from './glb'
import { ImageComponent } from './image'
import { VideoComponent } from './video'
import { UnknownComponent } from './unknown'
import { MIMETYPE } from '../../constants'

// some elements might not be interactive on the feed
export const renderMediaType = (token_info, interactive) => {
  const { mimeType, uri } = token_info.formats[0]
  const path = uri.split('//')[1]
  let url

  switch (mimeType) {
    /* IMAGES */
    case MIMETYPE.BMP:
    case MIMETYPE.GIF:
    case MIMETYPE.JPEG:
    case MIMETYPE.PNG:
    case MIMETYPE.SVG:
    case MIMETYPE.WEBP:
      url = `https://cloudflare-ipfs.com/ipfs/${path}`
      return <ImageComponent src={url} />
    /* VIDEOS */
    case MIMETYPE.MP4:
    case MIMETYPE.OGG:
    case MIMETYPE.QUICKTIME:
      url = `https://dweb.link/ipfs/${path}`
      return <VideoComponent src={url} />
    /* 3D */
    case MIMETYPE.GLTF:
    case MIMETYPE.GLB:
      url = `https://cloudflare-ipfs.com/ipfs/${path}`
      return <GLBComponent src={url} interactive={interactive} />
    default:
      return <UnknownComponent mimeType={mimeType} />
  }
}
