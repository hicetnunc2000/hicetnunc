import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Container, Padding } from '../layout'
import { Button, Primary, Secondary } from '../button'
import { fadeIn } from '../../utils/motion'
import { Menu } from '../icons'
import styles from './style.module.scss'
import { walletPreview } from '../../utils/string'

const ls = require('local-storage')
/* import { BeaconWallet } from '@taquito/beacon-wallet'

const wallet = new BeaconWallet({
  name: 'hicetnunc.xyz',
  preferredNetwork: 'mainnet',
}) */

export const Header = () => {
  const history = useHistory()
  const context = useContext(HicetnuncContext)

  useEffect(() => context.setAccount(), [])

  try {
    context.message = context.acc.address
  } catch (e) {
    context.message = 'sync'
  }

  //const activeAccount = await wallet.client.getActiveAccount()
  //console.log(activeAccount)
  const handleRoute = (path) => {
    context.setMenu(true)
    history.push(path)
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <Button onClick={() => handleRoute('/')}>
            <Secondary>
              <div className={styles.logo}>〇 hic et nunc</div>
            </Secondary>
          </Button>

          <div className={styles.right}>
            <Button onClick={context.syncTaquito} secondary>
              <Secondary>
                {context.message !== 'sync'
                  ? walletPreview(context.message)
                  : context.message}
              </Secondary>
            </Button>

            <Button onClick={context.toogleNavbar} secondary>
              <Menu isOpen={!context.collapsed} />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!context.collapsed && (
          <motion.div className={styles.menu} {...fadeIn()}>
            <Container>
              <Padding>
                <div className={styles.content}>
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
                        <Primary>
                          OBJKTs<i style={{ fontSize: '15px' }}>(mint NFTs)</i>
                        </Primary>
                      </Button>
                    </li>
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
                </div>
              </Padding>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
