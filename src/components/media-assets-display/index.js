import React from 'react'
import { toHHMMSS } from '../../utils/time'
import { formatBytes } from '../../utils/sanitise'
import styles from './styles.module.scss'

export const MediaAssetsDisplay = ({ ffmpeg, processing, message, media }) => {
  const isVideo = (mimeType) => {
    return mimeType.indexOf('video') === 0
  }

  return (
    <div className={styles.container}>
      {processing && message && (
        <div>
          <span>{message}</span>{' '}
          <span className={styles.subdued}>(this may take a while)</span>
        </div>
      )}
      {media && (
        <div>
          <span>extra media</span>{' '}
          <span className={styles.subdued}>(thumbnails, covers, etc)</span>
          <br />
          <div className={styles.media}>
            {media.map((item, index) => {
              return (
                <div className={styles.item} key={index}>
                  <div className={styles.inner}>
                    <div>
                      {isVideo(item.meta.mimeType) ? (
                        <video src={item.reader} controls />
                      ) : (
                        <img src={item.reader} alt="" />
                      )}
                    </div>
                    <div className={styles.meta}>
                      <div>{item.meta.mimeType}</div>
                      <div>
                        {item.meta.dimensions.width} x{' '}
                        {item.meta.dimensions.height}
                      </div>
                      {item.meta.duration && (
                        <div>{toHHMMSS(item.meta.duration)}</div>
                      )}
                      <div>{formatBytes(item.meta.fileSize)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {!ffmpeg && (
            <div>
              <br />
              NOTE: Mint with the latest Firefox or Chrome to enable video or
              animated GIF thumbnails for your OBJKT.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
