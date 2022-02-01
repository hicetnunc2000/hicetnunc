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

  const menu = () => {
    context.toogleNavbar()
  }

  return (
    <>
      <header className={styles.container}>
        <div className={styles.content}>
          <a href='/' style={{textDecoration : 'none', fontSize: '45px'}}>
            <div>
              {/* HIC LOGO */}
              {true && 
              /* (<svg viewBox="0 0 196.87 53.23" fill={'var(--text-color)'}>
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
                </svg>) */
              (<div style={{marginTop : '-2.5px'}}>○</div>)
              }
              {/* PRIDE LOGO */}
              {false && <img src="/hen-pride.gif" alt="pride 2021" />}
            </div>
          </a>

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
                        <Primary><a style={style} href='#/' onClick={menu}>home</a></Primary>
                      </Button>
                    </li>
                    <li>
                      <Button>
                        <Primary><a style={style} href='#/galleries' onClick={menu}>galleries</a></Primary>
                      </Button>
                    </li>
                    <li>
                      <Button>
                        <Primary>
                          <a style={style} onClick={menu} href='#/mint'>OBJKT<span style={{ fontSize: '16px' }}> (mint)</span></a>
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
                        <Primary><a style={style} onClick={menu} href='#/sync'>manage assets</a></Primary>
                      </Button>
                    </li>
                    {context.acc?.address ?
                      <li>
                        <Button>
                          <Primary><a style={style} onClick={menu} href='#/config'>edit profile</a></Primary>
                        </Button>
                      </li>
                      :
                      null
                    }
                    <li>
                      <Button>
                        <Primary><a style={style} onClick={menu} href='#/about'>about</a></Primary>
                      </Button>
                    </li>
                    <li>
                      <Button>
                        <Primary><a style={style} onClick={menu} href='#/faq'>faq</a></Primary>
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
