import React from 'react'
import { GLBComponent } from './glb'
import { ImageComponent } from './image'
import { VideoComponent } from './video'
import { AudioComponent } from './audio'
import { VectorComponent } from './vector'
import { UnknownComponent } from './unknown'
import { MIMETYPE } from '../../constants'

const CLOUDFLARE = 'https://cloudflare-ipfs.com/ipfs/'
const IPFS = 'https://ipfs.io/ipfs/'

export const renderMediaType = ({
  mimeType,
  uri,
  interactive = false,
  preview = false,
  metadata,
}) => {
  const path = uri
  let url

  switch (mimeType) {
    /* IMAGES */
    case MIMETYPE.BMP:
    case MIMETYPE.GIF:
    case MIMETYPE.JPEG:
    case MIMETYPE.PNG:
    case MIMETYPE.TIFF:
    case MIMETYPE.WEBP:
      url = preview ? uri : `${CLOUDFLARE}${path}`
      return <ImageComponent src={url} />
    /* VECTOR */
    case MIMETYPE.SVG:
      url = preview ? uri : `${CLOUDFLARE}${path}`
      return (
        <VectorComponent {...metadata} src={url} interactive={interactive} />
      )
    /* VIDEOS */
    case MIMETYPE.MP4:
    case MIMETYPE.OGV:
    case MIMETYPE.QUICKTIME:
    case MIMETYPE.WEBM:
      url = preview ? uri : `${IPFS}${path}`
      return <VideoComponent src={url} />
    /* 3D */
    case MIMETYPE.GLTF:
    case MIMETYPE.GLB:
      url = preview ? uri : `${CLOUDFLARE}${path}`
      return <GLBComponent src={url} interactive={interactive} />
    case MIMETYPE.MP3:
    case MIMETYPE.OGA:
      url = preview ? uri : `${CLOUDFLARE}${path}`
      return <AudioComponent src={url} />
    default:
      return <UnknownComponent mimeType={mimeType} />
  }
}
