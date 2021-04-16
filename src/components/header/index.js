/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Footer } from '../footer'
import { Container, Padding } from '../layout'
import { Button, Primary } from '../button'
import { fadeIn } from '../../utils/motion'
import { Menu } from '../icons'
import { walletPreview } from '../../utils/string'
import { VisuallyHidden } from '../visually-hidden'
import styles from './styles.module.scss'
import { getItem, setItem } from '../../utils/storage'

/* import { BeaconWallet } from '@taquito/beacon-wallet'

const wallet = new BeaconWallet({
  name: 'hicetnunc.xyz',
  preferredNetwork: 'mainnet',
}) */

export const Header = () => {
  const history = useHistory()
  const context = useContext(HicetnuncContext)

  useEffect(() => {
    context.setAccount()
    context.setTheme(getItem('theme') || setItem('theme', 'dark'))
  }, [])

  // we assume user isn't connected
  let button = 'sync'

  // but if they are
  if (context.acc?.address) {
    // is menu closed?
    if (context.collapsed) {
      button = walletPreview(context.acc.address)
    } else {
      // menu is open
      button = 'unsync'
    }
  }

  //const activeAccount = await wallet.client.getActiveAccount()
  //console.log(activeAccount)
  const handleRoute = (path) => {
    context.setMenu(true)
    history.push(path)
  }

  const handleSyncUnsync = () => {
    if (context.acc?.address && !context.collapsed) {
      // disconnect wallet
      context.disconnect()
    } else {
      // connect wallet
      context.syncTaquito()
    }
  }

  return (
    <>
      <header className={styles.container}>
        <div className={styles.content}>
          <Button onClick={() => handleRoute('/')}>
            <div className={styles.logo}>
              <svg viewBox="0 0 196.87 53.23">
                <path
                  d="M228.9,79.31H211.51a2.26,2.26,0,0,1-.35-.34.75.75,0,0,1-.16-.42c0-11.42,0-22.85,0-34.43H193.24v35H175.41V26.27H228.9Z"
                  transform="translate(-32.03 -26.27)"
                />
                <path
                  d="M67.74,43.78V26.42H85.41V79.19H67.91V62.38a4.24,4.24,0,0,0-.52-.57.77.77,0,0,0-.42-.17H50V79.08H32V26.48H49.78v17.3Z"
                  transform="translate(-32.03 -26.27)"
                />
                <path
                  d="M103.62,43.79V26.43h53.6c.09,5.62,0,11.41.05,17.36Z"
                  transform="translate(-32.03 -26.27)"
                />
                <path
                  d="M103.71,61.71h53.38V78.84c-4.05.69-38.16.91-53.38.31Z"
                  transform="translate(-32.03 -26.27)"
                />
              </svg>
            </div>
          </Button>

          <div className={styles.right}>
            <Button onClick={handleSyncUnsync} secondary>
              <Primary>{button}</Primary>
            </Button>

            <Button onClick={context.toogleNavbar} secondary>
              <VisuallyHidden>
                {`${context.collapsed ? 'show' : 'hide'} menu`}
              </VisuallyHidden>
              <Menu isOpen={!context.collapsed} />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {!context.collapsed && (
          <motion.div className={styles.menu} {...fadeIn()}>
            <Container>
              <Padding>
                <nav className={styles.content}>
                  <ul>
                    <li>
                      <Button onClick={() => handleRoute('/hdao')}>
                        <Primary>○</Primary>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => handleRoute('/random')}>
                        <Primary>random</Primary>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => handleRoute('/mint')}>
                        <Primary>OBJKTs</Primary>
                      </Button>
                    </li>
                    {false && (
                      <li>
                        <Button onClick={() => handleRoute('/galleries')}>
                          <Primary>galleries</Primary>
                        </Button>
                      </li>
                    )}
                    <li>
                      <Button onClick={() => handleRoute('/sync')}>
                        <Primary>manage assets</Primary>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => handleRoute('/about')}>
                        <Primary>about</Primary>
                      </Button>
                    </li>
                  </ul>
                </nav>
              </Padding>
            </Container>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
