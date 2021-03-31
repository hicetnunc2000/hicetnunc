import React from 'react'
import { GLBComponent } from './glb'
import { ImageComponent } from './image'
import { VideoComponent } from './video'
import { AudioComponent } from './audio'
import { VectorComponent } from './vector'
import { HTMLComponent } from './html'
import { UnknownComponent } from './unknown'
import { PdfComponent } from './pdf'
import { MIMETYPE, IPFS_DIRECTORY_MIMETYPE } from '../../constants'
import { Container } from './container'

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
  let url = preview ? uri : `${CLOUDFLARE}${path}`

  switch (mimeType) {
    /* IMAGES */
    case MIMETYPE.BMP:
    case MIMETYPE.GIF:
    case MIMETYPE.JPEG:
    case MIMETYPE.PNG:
    case MIMETYPE.TIFF:
    case MIMETYPE.WEBP:
      return (
        <Container interactive={interactive}>
          <ImageComponent src={url} />
        </Container>
      )
    /* VECTOR */
    case MIMETYPE.SVG:
      return (
        <Container interactive={interactive}>
          <VectorComponent {...metadata} src={url} preview={preview} />
        </Container>
      )
    /* HTML ZIP */
    case IPFS_DIRECTORY_MIMETYPE:
    case MIMETYPE.ZIP:
    case MIMETYPE.ZIP1:
    case MIMETYPE.ZIP2:
      let displayUri = ''
      if (metadata && metadata.token_info && metadata.token_info.displayUri) {
        displayUri = metadata.token_info.displayUri.replace(
          'ipfs://',
          CLOUDFLARE
        )
      }
      return (
        <Container interactive={interactive}>
          <HTMLComponent
            {...metadata}
            src={url}
            preview={preview}
            displayUri={displayUri}
          />
        </Container>
      )
    /* VIDEOS */
    case MIMETYPE.MP4:
    case MIMETYPE.OGV:
    case MIMETYPE.QUICKTIME:
    case MIMETYPE.WEBM:
      url = preview ? uri : `${IPFS}${path}`
      return (
        <Container interactive={interactive}>
          <VideoComponent src={url} />
        </Container>
      )
    /* 3D */
    case MIMETYPE.GLB:
    case MIMETYPE.GLTF:
      return (
        <Container interactive={interactive}>
          <GLBComponent src={url} />
        </Container>
      )
    /* AUDIO */
    case MIMETYPE.MP3:
    case MIMETYPE.OGA:
      return (
        <Container interactive={interactive}>
          <AudioComponent src={url} />
        </Container>
      )
    /* PDF */
    case MIMETYPE.PDF:
      return (
        <Container interactive={interactive}>
          <PdfComponent src={url} />
        </Container>
      )
    default:
      return <UnknownComponent mimeType={mimeType} />
  }
}
