import React, { useContext, useState, useRef, useEffect } from 'react'
import classnames from 'classnames'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Button } from '../../button'
import {
  dataRUIToBuffer,
  prepareFilesFromZIP,
  validateFiles,
} from '../../../utils/html'
import { VisuallyHidden } from '../../visually-hidden'
import styles from './styles.module.scss'

const uid = Math.round(Math.random() * 100000000).toString()

export const HTMLComponent = ({
  src,
  interactive,
  preview,
  token_info,
  displayUri,
}) => {
  const context = useContext(HicetnuncContext)
  const [viewing, setViewing] = useState(interactive)

  let _creator_ = false
  let _viewer_ = false

  if (token_info && token_info.creators[0]) {
    _creator_ = token_info.creators[0]
  }

  if (context.address && context.address.address) {
    _viewer_ = context.address.address
  }

  // preview
  const iframeRef = useRef(null)
  const unpackedFiles = useRef(null)
  const unpacking = useRef(false)
  const [validHTML, setValidHTML] = useState(null)
  const [validationError, setValidationError] = useState(null)

  const unpackZipFiles = async () => {
    unpacking.current = true

    const buffer = dataRUIToBuffer(src)
    const filesArr = await prepareFilesFromZIP(buffer)
    const files = {}
    filesArr.forEach((f) => {
      files[f.path] = f.blob
    })

    unpackedFiles.current = files

    const result = await validateFiles(unpackedFiles.current)
    if (result.error) {
      console.error(result.error)
      setValidationError(result.error)
    } else {
      setValidationError(null)
    }
    setValidHTML(result.valid)

    unpacking.current = false
  }

  if (preview && !unpackedFiles.current && !unpacking.current) {
    unpackZipFiles()
  }

  useEffect(() => {
    const handler = async (event) => {
      if (event.data !== uid) {
        return
      }

      iframeRef.current.contentWindow.postMessage(
        {
          target: 'hicetnunc-html-preview',
          data: unpackedFiles.current,
        },
        '*'
      )
    }

    window.addEventListener('message', handler)

    return () => window.removeEventListener('message', handler)
  }, [src])

  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: interactive,
  })

  if (preview) {
    // creator is viewer in preview
    _creator_ = _viewer_

    if (validHTML) {
      return (
        <div className={classes}>
          <iframe
            ref={iframeRef}
            title="html-zip-embed"
            src={`https://hicetnunc2000.github.io/hicetnunc/gh-pages/html-preview/?uid=${uid}&creator=${_creator_}&viewer=${_viewer_}`}
            sandbox="allow-scripts allow-same-origin allow-modals"
            allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
          />
        </div>
      )
    } else if (validHTML === false) {
      return (
        <div className={styles.error}>Preview Error: {validationError}</div>
      )
    }
  }

  if (!viewing) {
    return (
      <div className={classes}>
        <div className={styles.preview}>
          <img src={displayUri} alt="thumbnail" />
          <div className={styles.button}>
            <Button onClick={() => setViewing(true)}>
              <VisuallyHidden>View</VisuallyHidden>
              <svg
                width="54"
                height="54"
                viewBox="0 0 54 54"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d)">
                  <circle cx="27" cy="23" r="23" fill="white" />
                </g>
                <path
                  d="M32.8837 35.3528C31.3991 35.3528 29.6798 34.8834 27.7044 33.946C25.4989 32.9004 24.4365 32.9415 23.7354 32.9705C23.1684 32.9964 22.58 33.0162 21.9978 32.434C21.7935 32.2297 20.8653 31.117 22.6898 29.2925C23.5997 28.3826 24.8481 28.1204 25.9318 28.1052L19.6124 21.7858C18.7481 20.9215 18.7497 19.5132 19.6169 18.6459C20.4827 17.7801 21.8911 17.7771 22.7568 18.6428L25.3831 21.2691C25.4867 21.0618 25.6254 20.8682 25.7976 20.6959C26.4012 20.0924 27.267 19.9095 28.026 20.1442C28.1327 19.8424 28.308 19.5589 28.5489 19.3165C29.375 18.4889 30.6965 18.4493 31.5683 19.2007C31.6735 18.9888 31.8153 18.7937 31.986 18.623C32.8532 17.7573 34.2601 17.7542 35.1259 18.62L39.2412 22.7354C41.8217 25.3159 41.5382 29.0517 38.5508 32.0483C38.5492 32.0498 38.5477 32.0514 38.5462 32.0529C38.5401 32.059 38.5325 32.0666 38.5264 32.0742L36.8177 33.7829C35.7554 34.8285 34.4506 35.3528 32.8837 35.3528ZM24.1484 31.4356C24.9807 31.4356 26.2595 31.5728 28.3583 32.5681C32.9081 34.7264 34.7524 33.6762 35.7462 32.6976L37.4625 30.9814C37.4671 30.9768 37.4716 30.9722 37.4747 30.9692C39.29 29.1355 40.5429 26.1892 38.1773 23.8236L34.0498 19.6961C33.7784 19.4263 33.3395 19.4278 33.0651 19.6991C32.7923 19.9719 32.7908 20.4124 33.0605 20.6838L34.0894 21.7126C34.2388 21.862 34.3119 22.0571 34.3119 22.2522C34.3119 22.4473 34.2372 22.6424 34.0894 22.7917C33.7922 23.089 33.309 23.089 33.0118 22.7917L30.6111 20.3911C30.3398 20.1228 29.9008 20.1244 29.628 20.3957C29.3552 20.6685 29.3536 21.109 29.6234 21.3803L31.3382 23.0951C31.4875 23.2444 31.5607 23.4395 31.5607 23.6346C31.5607 23.8297 31.486 24.0248 31.3382 24.1742C31.041 24.4714 30.5578 24.4714 30.2606 24.1742L27.8599 21.7736C27.5886 21.5038 27.1496 21.5068 26.8768 21.7781C26.604 22.051 26.6024 22.4915 26.8722 22.7628L28.587 24.4775C28.7363 24.6269 28.8095 24.822 28.8095 25.0171C28.8095 25.2122 28.7348 25.4073 28.587 25.5567C28.2897 25.8539 27.8066 25.8539 27.5093 25.5567L21.6792 19.7265C21.4094 19.4568 20.9689 19.4583 20.6946 19.7296C20.4217 20.0024 20.4202 20.4429 20.69 20.7142L28.5778 28.6021C28.8247 28.849 28.872 29.23 28.6937 29.5288C28.5153 29.8275 28.1541 29.9693 27.8233 29.8717C27.7944 29.8641 25.063 29.0807 23.7659 30.3763C23.176 30.9661 23.0891 31.3289 23.1043 31.4112C23.1699 31.4569 23.1821 31.4722 23.6744 31.4539C23.8162 31.4417 23.9732 31.4356 24.1484 31.4356Z"
                  fill="black"
                />
                <path
                  d="M15.9442 23.9226C15.7674 23.9226 15.5814 23.8616 15.4442 23.7489C14.0282 22.5874 13.2158 20.8727 13.2158 19.0451C13.2158 15.6827 15.9503 12.9482 19.3127 12.9482C20.215 12.9482 21.0686 13.1372 21.852 13.5107C22.2316 13.6921 22.3931 14.1463 22.2118 14.5273C22.0304 14.9069 21.5792 15.0684 21.1951 14.887C20.6189 14.6112 19.9864 14.4725 19.3127 14.4725C16.7916 14.4725 14.74 16.5241 14.74 19.0451C14.74 20.3986 15.336 21.6713 16.377 22.5417C16.5706 22.6804 16.6987 22.906 16.6987 23.1605C16.6987 23.5827 16.3649 23.9226 15.9442 23.9226Z"
                  fill="black"
                />
                <defs>
                  <filter
                    id="filter0_d"
                    x="0"
                    y="0"
                    width="54"
                    height="54"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={classes}>
      <iframe
        title="html-embed"
        src={`${src}?creator=${_creator_}&viewer=${_viewer_}`}
        sandbox="allow-scripts allow-same-origin"
        allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
      />
    </div>
  )
}
