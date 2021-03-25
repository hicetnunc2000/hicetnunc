import React from 'react'
import { MIMETYPE, IPFS_DIRECTORY_MIMETYPE } from '../../constants'
import styles from './styles.module.scss'

export const MimeTypeIcon = ({ mimeType }) => {
  const getIcon = () => {
    switch (mimeType) {
      /* IMAGES */
      case MIMETYPE.BMP:
      case MIMETYPE.GIF:
      case MIMETYPE.JPEG:
      case MIMETYPE.PNG:
      case MIMETYPE.TIFF:
      case MIMETYPE.WEBP:
        return null
      /* VECTOR */
      case MIMETYPE.SVG:
        return null
      /* HTML ZIP */
      case IPFS_DIRECTORY_MIMETYPE:
      case MIMETYPE.ZIP:
      case MIMETYPE.ZIP1:
      case MIMETYPE.ZIP2:
        // return (
        //   <svg viewBox="0 0 96 96">
        //     <path d="M24.8452,25.3957a6.0129,6.0129,0,0,0-8.4487.7617L1.3974,44.1563a5.9844,5.9844,0,0,0,0,7.687L16.3965,69.8422a5.9983,5.9983,0,1,0,9.21-7.687L13.8068,48l11.8-14.1554A6,6,0,0,0,24.8452,25.3957Z" />
        //     <path d="M55.1714,12.1192A6.0558,6.0558,0,0,0,48.1172,16.83L36.1179,76.8262A5.9847,5.9847,0,0,0,40.8286,83.88a5.7059,5.7059,0,0,0,1.1835.1172A5.9949,5.9949,0,0,0,47.8828,79.17L59.8821,19.1735A5.9848,5.9848,0,0,0,55.1714,12.1192Z" />
        //     <path d="M94.6026,44.1563,79.6035,26.1574a5.9983,5.9983,0,1,0-9.21,7.687L82.1932,48l-11.8,14.1554a5.9983,5.9983,0,1,0,9.21,7.687L94.6026,51.8433A5.9844,5.9844,0,0,0,94.6026,44.1563Z" />
        //   </svg>
        // )
        return null
      /* VIDEOS */
      case MIMETYPE.MP4:
      case MIMETYPE.OGV:
      case MIMETYPE.QUICKTIME:
      case MIMETYPE.WEBM:
        return null
      /* 3D */
      case MIMETYPE.GLB:
      case MIMETYPE.GLTF:
        return null
      /* AUDIO */
      case MIMETYPE.MP3:
      case MIMETYPE.OGA:
        return null
      default:
        return null
    }
  }

  return <div className={styles.container}>{getIcon()}</div>
}
