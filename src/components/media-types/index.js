import React from 'react'
import { GLBComponent } from './glb'
import { ImageComponent } from './image'
import { VideoComponent } from './video'
import { AudioComponent } from './audio'
import { UnknownComponent } from './unknown'
import { MIMETYPE } from '../../constants'

// some elements might not be interactive on the feed
export const renderMediaType = (token_info, interactive, preview = false) => {
  const { mimeType, uri } = token_info.formats[0]
  const path = uri.split('//')[1]
  let ipfsHost
  let url

  switch (mimeType) {
    /* IMAGES */
    case MIMETYPE.BMP:
    case MIMETYPE.GIF:
    case MIMETYPE.JPEG:
    case MIMETYPE.PNG:
    case MIMETYPE.SVG:
    case MIMETYPE.TIFF:
    case MIMETYPE.WEBP:
      ipfsHost = `https://cloudflare-ipfs.com/ipfs/`
      url = preview ? uri : `${ipfsHost}${path}`
      return <ImageComponent src={url} />
    /* VIDEOS */
    case MIMETYPE.MP4:
    case MIMETYPE.OGV:
    case MIMETYPE.QUICKTIME:
      ipfsHost = `https://ipfs.io/ipfs/`
      url = preview ? uri : `${ipfsHost}${path}`
      return <VideoComponent src={url} />
    /* 3D */
    case MIMETYPE.GLTF:
    case MIMETYPE.GLB:
      ipfsHost = `https://cloudflare-ipfs.com/ipfs/`
      url = preview ? uri : `${ipfsHost}${path}`
      return <GLBComponent src={url} interactive={interactive} />
    case MIMETYPE.MP3:
    case MIMETYPE.OGA:
      ipfsHost = `https://cloudflare-ipfs.com/ipfs/`
      url = preview ? uri : `${ipfsHost}${path}`
      return <AudioComponent src={url} />
    default:
      return <UnknownComponent mimeType={mimeType} />
  }
}
