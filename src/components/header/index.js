/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Footer } from '../footer'
// import { VoteBanner } from '../vote-banner'
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
    context.setLogo()
  }, [])

  // we assume user isn't connected
  let button = 'sync'

  // but if they are
  if (context.acc?.address) {
    // is menu closed?
    if (context.collapsed) {
      const proxyAddress = context.proxyAddress ? ` (${context.proxyName || walletPreview(context.proxyAddress)})` : ''
      button = walletPreview(context.acc.address) + proxyAddress
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
      {/* <VoteBanner /> */}
      <header className={styles.container}>
        <div className={styles.content}>
          <Button onClick={() => handleRoute('/')}>
            <div className={styles.logo}>
              {/* HIC LOGO */}
              {true && (
                <img src={`https://teia.art/logos/${context.theme}/${context.logo}`} alt="teia"></img>
              )}
              {/* PRIDE LOGO */}
              {false && <img src="/hen-pride.gif" alt="pride 2021" />}
            </div>
          </Button>

          <div className={styles.right}>
            {!context.collapsed && context.proxyAddress && (
              <div className={styles.mr}>
                <Button onClick={() => context.setProxyAddress(null)} secondary>
                  <Primary>exit collab</Primary>
                </Button>
              </div>
            )}

            <Button onClick={handleSyncUnsync} secondary>
              <Primary>{button}</Primary> {/* Main address display here */}
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
                      <Button onClick={() => handleRoute('/explore')}>
                        <Primary>explore</Primary>
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
                      <Button onClick={() => handleRoute('/collaborate')}>
                        <Primary>collaborate</Primary>
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
                          <Primary>edit profile</Primary>
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
