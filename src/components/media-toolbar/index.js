import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn } from '../../utils/motion'
import { Button, Purchase } from '../button'
import { IPFS_DIRECTORY_MIMETYPE } from '../../constants'
import styles from './index.module.scss'

const IFRAME_PERMISSIONS_ALERT_KEY = 'hen:iframe-permissions-alert'

export const MediaToolbar = (props) => {
  const [open, setOpen] = useState(false)

  const toggle = function () {
    setOpen(!open)
  }

  const isHtml = props.mimeType === IPFS_DIRECTORY_MIMETYPE

  if (isHtml) {
    const alerted = window.localStorage.getItem(IFRAME_PERMISSIONS_ALERT_KEY)
    if (!alerted) {
      setTimeout(() => {
        setOpen(true)
        window.localStorage.setItem(IFRAME_PERMISSIONS_ALERT_KEY, true)
      }, 1000)
    }
  }

  return (
    <div className={styles.container}>
      {isHtml && (
        <div>
          <div className={styles.button} onClick={toggle}>
            i
          </div>

          <AnimatePresence>
            {open && (
              <motion.div className={styles.modal} {...fadeIn()}>
                <div className={styles.bg}></div>
                <div className={styles.box}>
                  Interactive OBJKTs can see your wallet address. This lets them
                  do interesting things like generate unique content.
                  <br />
                  <br />
                  Please be mindful of this when allowing features like camera
                  and microphone.
                  <br />
                  <br />
                  <div className={styles.buttons}>
                    <Button onClick={toggle}>
                      <Purchase>Got it!</Purchase>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
