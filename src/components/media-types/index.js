import React from 'react'
import ipfsClient from 'ipfs-http-client'
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
// const PINATA = 'https://gateway.pinata.cloud/ipfs/'
const IPFS = 'https://ipfs.io/ipfs/'

function getInfuraUrl(hash) {
  const cidv1 = new ipfsClient.CID(hash).toV1()
  const subomain = cidv1.toString()
  return `https://${subomain}.ipfs.infura-ipfs.io/`
}

export const renderMediaType = (props) => {
  const {
    mimeType,
    uri,
    interactive = false,
    preview = false,
    metadata,
  } = props
  const path = uri
  let url = preview ? uri : `${IPFS}${path}`
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
      if (!preview) {
        url = getInfuraUrl(path)
      }
      let displayUri = ''

      if (metadata && metadata.token_info && metadata.token_info.displayUri) {
        displayUri = metadata.token_info.displayUri.replace('ipfs://', IPFS)
      }

      if (metadata && metadata.display_uri && metadata.display_uri !== '') {
        displayUri = metadata.display_uri.replace('ipfs://', IPFS)
      }
      // console.log(displayUri)

      // new
      // if (metadata && metadata.display_uri) {
      //   displayUri = metadata.display_uri.replace('ipfs://', CLOUDFLARE)
      // }

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
        <Container interactive={interactive} nofullscreen>
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
    case MIMETYPE.FLAC:
    case MIMETYPE.WAV:
      url = preview ? uri : `${IPFS}${path}`
      return (
        <Container interactive={interactive}>
          <AudioComponent {...metadata} src={url} />
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
