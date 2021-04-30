import React, { useRef, useEffect } from 'react'
import styles from './styles.module.scss'

const COMPRESSOR_URL = 'https://hicetnunc-media-compressor.netlify.app'

export const MediaCompressorIframe = React.forwardRef(
  ({ file, onMetadata, onProgress, onComplete, onError }, ref) => {
    const busy = useRef(false)

    useEffect(() => {
      if (file && !busy.current) {
        busy.current = true

        const target = 'hicetnunc-media-compressor'
        const key = 'my-random-key'
        ref.current.contentWindow.postMessage({ target, key, file }, '*')

        const onMessage = (event) => {
          if (event.data.key !== key) return

          const type = event.data.type
          const payload = event.data.payload

          if (type === 'metadata') {
            onMetadata(payload)
          } else if (type === 'progress') {
            onProgress(payload)
          } else if (type === 'results') {
            onComplete(payload)
            busy.current = false
          } else if (type === 'error') {
            onError(payload)
            busy.current = false
          }
        }

        window.addEventListener('message', onMessage)
      }
    }, [file])

    return (
      <iframe
        ref={ref}
        title="hen-media-compressor"
        src={COMPRESSOR_URL}
        width="0"
        height="0"
        className={styles.hidden}
        allow="cross-origin-isolated"
      />
    )
  }
)
