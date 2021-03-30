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
        <Container>
          <ImageComponent src={url} interactive={interactive} />
        </Container>
      )
    /* VECTOR */
    case MIMETYPE.SVG:
      return (
        <Container>
          <VectorComponent
            {...metadata}
            src={url}
            interactive={interactive}
            preview={preview}
          />
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
        <Container>
          <HTMLComponent
            {...metadata}
            src={url}
            interactive={interactive}
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
        <Container>
          <VideoComponent src={url} interactive={interactive} />
        </Container>
      )
    /* 3D */
    case MIMETYPE.GLB:
    case MIMETYPE.GLTF:
      return (
        <Container>
          <GLBComponent src={url} interactive={interactive} />
        </Container>
      )
    /* AUDIO */
    case MIMETYPE.MP3:
    case MIMETYPE.OGA:
      return (
        <Container>
          <AudioComponent src={url} interactive={interactive} />
        </Container>
      )
    /* PDF */
    case MIMETYPE.PDF:
      return (
        <Container>
          <PdfComponent src={url} />
        </Container>
      )
    default:
      return <UnknownComponent mimeType={mimeType} />
  }
}
