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
// import './styles.css'

const uid = Math.round(Math.random() * 100000000).toString()

export const HTMLComponent = (props) => {
  const {
    artifactUri,
    displayUri,
    previewUri,
    creator,
    objkt,
    onDetailView,
    preview,
    displayView
  } = props
  const context = useContext(HicetnuncContext)

  let _creator_ = false
  let _viewer_ = false
  let _objectId_ = false

  if (creator && creator.address) {
    _creator_ = creator.address
  }

  if (context.address && context.address.address) {
    _viewer_ = context.address.address
  }

  if (objkt) {
    _objectId_ = String(objkt)
  }

  // preview
  const iframeRef = useRef(null)
  const unpackedFiles = useRef(null)
  const unpacking = useRef(false)
  const [validHTML, setValidHTML] = useState(null)
  const [validationError, setValidationError] = useState(null)

  const unpackZipFiles = async () => {
    unpacking.current = true

    const buffer = dataRUIToBuffer(previewUri)
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
  }, [previewUri])

  const classes = classnames({
    [styles.container]: true,
    [styles.interactive]: onDetailView,
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
            src={`https://hicetnunc2000.github.io/hicetnunc/gh-pages/html-preview/?uid=${uid}&creator=${_creator_}&viewer=${_viewer_}&objkt=${_objectId_}`}
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

  if (!onDetailView) {
    return (
      <div className={classes}>
        <div className={styles.preview}>
          <img src={displayUri} alt="display" />
          <div className={styles.button}>
            <Button>
              <VisuallyHidden>View</VisuallyHidden>
{/*               <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="15"
                  cy="15"
                  r="14.25"
                  fill="#0D0D0D"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <path
                  d="M10.592 13.336L7.292 15.04V15.1L10.592 16.804V17.716H10.448L6.212 15.424V14.716L10.448 12.424H10.592V13.336ZM16.7769 9.364H17.7849L13.6329 20.872H12.6249L16.7769 9.364ZM19.6301 12.424L23.8661 14.716V15.424L19.6301 17.716H19.4861V16.804L22.7981 15.1V15.04L19.4861 13.336V12.424H19.6301Z"
                  fill="white"
                />
                <path
                  d="M10.592 13.336L10.7755 13.6914L10.992 13.5796V13.336H10.592ZM7.292 15.04L7.10848 14.6846L6.892 14.7964V15.04H7.292ZM7.292 15.1H6.892V15.3436L7.10848 15.4554L7.292 15.1ZM10.592 16.804H10.992V16.5604L10.7755 16.4486L10.592 16.804ZM10.592 17.716V18.116H10.992V17.716H10.592ZM10.448 17.716L10.2576 18.0678L10.3467 18.116H10.448V17.716ZM6.212 15.424H5.812V15.6624L6.02165 15.7758L6.212 15.424ZM6.212 14.716L6.02165 14.3642L5.812 14.4776V14.716H6.212ZM10.448 12.424V12.024H10.3467L10.2576 12.0722L10.448 12.424ZM10.592 12.424H10.992V12.024H10.592V12.424ZM10.4085 12.9806L7.10848 14.6846L7.47552 15.3954L10.7755 13.6914L10.4085 12.9806ZM6.892 15.04V15.1H7.692V15.04H6.892ZM7.10848 15.4554L10.4085 17.1594L10.7755 16.4486L7.47552 14.7446L7.10848 15.4554ZM10.192 16.804V17.716H10.992V16.804H10.192ZM10.592 17.316H10.448V18.116H10.592V17.316ZM10.6384 17.3642L6.40235 15.0722L6.02165 15.7758L10.2576 18.0678L10.6384 17.3642ZM6.612 15.424V14.716H5.812V15.424H6.612ZM6.40235 15.0678L10.6384 12.7758L10.2576 12.0722L6.02165 14.3642L6.40235 15.0678ZM10.448 12.824H10.592V12.024H10.448V12.824ZM10.192 12.424V13.336H10.992V12.424H10.192ZM16.7769 9.364V8.964H16.496L16.4006 9.22825L16.7769 9.364ZM17.7849 9.364L18.1611 9.49975L18.3544 8.964H17.7849V9.364ZM13.6329 20.872V21.272H13.9138L14.0091 21.0078L13.6329 20.872ZM12.6249 20.872L12.2486 20.7362L12.0553 21.272H12.6249V20.872ZM16.7769 9.764H17.7849V8.964H16.7769V9.764ZM17.4086 9.22825L13.2566 20.7362L14.0091 21.0078L18.1611 9.49975L17.4086 9.22825ZM13.6329 20.472H12.6249V21.272H13.6329V20.472ZM13.0011 21.0078L17.1531 9.49975L16.4006 9.22825L12.2486 20.7362L13.0011 21.0078ZM19.6301 12.424L19.8204 12.0722L19.7313 12.024H19.6301V12.424ZM23.8661 14.716H24.2661V14.4776L24.0564 14.3642L23.8661 14.716ZM23.8661 15.424L24.0564 15.7758L24.2661 15.6624V15.424H23.8661ZM19.6301 17.716V18.116H19.7313L19.8204 18.0678L19.6301 17.716ZM19.4861 17.716H19.0861V18.116H19.4861V17.716ZM19.4861 16.804L19.3031 16.4483L19.0861 16.56V16.804H19.4861ZM22.7981 15.1L22.9811 15.4557L23.1981 15.344V15.1H22.7981ZM22.7981 15.04H23.1981V14.796L22.9811 14.6843L22.7981 15.04ZM19.4861 13.336H19.0861V13.58L19.3031 13.6917L19.4861 13.336ZM19.4861 12.424V12.024H19.0861V12.424H19.4861ZM19.4397 12.7758L23.6757 15.0678L24.0564 14.3642L19.8204 12.0722L19.4397 12.7758ZM23.4661 14.716V15.424H24.2661V14.716H23.4661ZM23.6757 15.0722L19.4397 17.3642L19.8204 18.0678L24.0564 15.7758L23.6757 15.0722ZM19.6301 17.316H19.4861V18.116H19.6301V17.316ZM19.8861 17.716V16.804H19.0861V17.716H19.8861ZM19.6691 17.1597L22.9811 15.4557L22.6151 14.7443L19.3031 16.4483L19.6691 17.1597ZM23.1981 15.1V15.04H22.3981V15.1H23.1981ZM22.9811 14.6843L19.6691 12.9803L19.3031 13.6917L22.6151 15.3957L22.9811 14.6843ZM19.8861 13.336V12.424H19.0861V13.336H19.8861ZM19.4861 12.824H19.6301V12.024H19.4861V12.824Z"
                  fill="white"
                />
              </svg> */}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!displayView) {
    try {
    return (
      <div>
        <iframe
          className={styles.html + ' zip-embed'}
          title="html-embed"
          src={`${artifactUri}/?creator=${_creator_}&viewer=${_viewer_}&objkt=${_objectId_}`}
          sandbox="allow-scripts allow-same-origin"
          allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"

        />
      </div>
    )
    } catch (err) {
      return undefined
    }
  } else {

    return (
      <div>
        <iframe
          className={styles.html}
          title="html-embed"
          src={`${artifactUri}/?creator=${_creator_}&viewer=${_viewer_}&objkt=${_objectId_}`}
          sandbox="allow-scripts allow-same-origin"
          allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
        />
      </div>
    )
  }
}
