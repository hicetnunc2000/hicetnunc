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
              {/* HIC LOGO */}
              {true && (
                <svg viewBox="0 0 196.87 53.23" fill={'var(--text-color)'}>
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
              )}
              {/* PRIDE LOGO */}
              {false && (
                <svg
                  width="74"
                  height="20"
                  viewBox="0 0 74 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0"
                    mask-type="alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="74"
                    height="20"
                  >
                    <path
                      d="M73.9825 19.9291H67.4484C67.4001 19.8913 67.356 19.8485 67.3169 19.8013C67.2812 19.7561 67.2603 19.701 67.2568 19.6435C67.2568 15.3526 67.2568 11.0579 67.2568 6.70689H60.5837V19.8577H53.8844V0H73.9825V19.9291Z"
                      fill="black"
                    />
                    <path
                      d="M13.4288 6.57914V0.0563582H20.0681V19.884H13.4927V13.5678C13.4342 13.4907 13.3688 13.419 13.2973 13.3537C13.2523 13.317 13.1973 13.2948 13.1395 13.2898H6.76326V19.8426H0V0.0789021H6.68059V6.57914H13.4288Z"
                      fill="black"
                    />
                    <path
                      d="M26.9102 6.5829V0.0601192H47.0497C47.0835 2.17176 47.0497 4.34727 47.0685 6.5829H26.9102Z"
                      fill="black"
                    />
                    <path
                      d="M26.9441 13.3161H47.0009V19.7525C45.4791 20.0117 32.6628 20.0944 26.9441 19.8689V13.3161Z"
                      fill="black"
                    />
                  </mask>
                  <g mask="url(#mask0)">
                    <path d="M74 17.5H0V20H74V17.5Z" fill="#750787" />
                    <path d="M74 15H0V17.5H74V15Z" fill="#004DFF" />
                    <path d="M74 12.5H0V15H74V12.5Z" fill="#008026" />
                    <path d="M74 10H0V12.5H74V10Z" fill="#FFED00" />
                    <path d="M74 7.5H0V10H74V7.5Z" fill="#FF8C00" />
                    <path d="M74 5H0V7.5H74V5Z" fill="#E40303" />
                    <path d="M74 2.5H0V5H74V2.5Z" fill="#725123" />
                    <path d="M74 0H0V2.5H74V0Z" fill="black" />
                  </g>
                </svg>
              )}
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
                      <Button onClick={() => handleRoute('/galleries')}>
                        <Primary>galleries</Primary>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => handleRoute('/mint')}>
                        <Primary>
                          OBJKT<span style={{ fontSize: '16px' }}> (mint)</span>
                        </Primary>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => handleRoute('/sync')}>
                        <Primary>manage assets</Primary>
                      </Button>
                    </li>
                    {context.acc?.address ?
                      <li>
                        <Button onClick={() => handleRoute('/config')}>
                          <Primary>settings</Primary>
                        </Button>
                      </li>
                      :
                      null
                    }
                    <li>
                      <Button onClick={() => handleRoute('/about')}>
                        <Primary>about</Primary>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => handleRoute('/faq')}>
                        <Primary>faq</Primary>
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
