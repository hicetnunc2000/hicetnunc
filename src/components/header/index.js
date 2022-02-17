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
// import { Link } from 'react-router-dom'
import { EventBanner } from '../event-banner'
/* import { BeaconWallet } from '@taquito/beacon-wallet'

const wallet = new BeaconWallet({
  name: 'hicetnunc.xyz',
  preferredNetwork: 'mainnet',
}) */

export const Header = () => {
  const history = useHistory()
  const context = useContext(HicetnuncContext)
  const style = {fontSize : '30px'}
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
      const proxyAddress = context.proxyAddress ? ' (' + context.proxyAddress + ')' : ''
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
    <div className={styles.outer__container}>
      <EventBanner />
      <header className={styles.container}>
        <div className={styles.content}>
          <Button onClick={() => handleRoute('/')}>
            <div className={styles.logo}>
              {/* HIC LOGO */}
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
                      <Button>
                        <Primary><a style={style} href='/'>home</a></Primary>
                      </Button>
                    </li>
                    <li>
                      <Button>
                        <Primary><a style={style} href='/galleries'>galleries</a></Primary>
                      </Button>
                    </li>
                    <li>
                      <Button>
                        <Primary>
                          <a style={style} href='/mint'>OBJKT<span style={{ fontSize: '16px' }}> (mint)</span></a>
                        </Primary>
                      </Button>
                    </li>
{/*                     <li>
                      <Button onClick={() => handleRoute('/collaborate')}>
                        <Primary>collaborate</Primary>
                      </Button>
                    </li> */}
                    <li>
                      <Button>
                        <Primary><a style={style} href='/sync'>manage assets</a></Primary>
                      </Button>
                    </li>
                    { context.acc?.address ?
                      <li>
                        <Button>
                          <Primary><a style={style} href='/config'>edit profile</a></Primary>
                        </Button>
                      </li>
                      :
                      null
                    }
                    <li>
                      <Button>
                        <Primary><a style={style} href='/about'>about</a></Primary>
                      </Button>
                    </li>
                    <li>
                      <Button>
                        <Primary><a style={style} href='faq'>faq</a></Primary>
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
    </div>
  )
}
