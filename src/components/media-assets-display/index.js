import React from 'react'
import { toHHMMSS } from '../../utils/time'
import styles from './styles.module.scss'

export const MediaAssetsDisplay = ({ ffmpeg, processing, media }) => {
  const isVideo = (mimeType) => {
    return mimeType.indexOf('video') === 0
  }

  return (
    <div className={styles.container}>
      {processing && <div>Processing media... (this may take some time)</div>}
      {media && (
        <div>
          cover/thumbnail media
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
                      {item.meta.mimeType}
                      <br />
                      {item.meta.dimensions.width} x{' '}
                      {item.meta.dimensions.height}
                      {item.meta.duration && (
                        <div>{toHHMMSS(item.meta.duration)}</div>
                      )}
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
