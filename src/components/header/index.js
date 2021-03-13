import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Container, Padding } from '../layout'
import { Button, Primary, Secondary } from '../button'
import { fadeIn } from '../../utils/motion'
import { Menu } from '../icons'
import styles from './style.module.scss'

export const Header = () => {
  const history = useHistory()
  const context = useContext(HicetnuncContext)

  const handleRoute = (path) => {
    context.setMenu(true)
    history.push(path)
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <Button onClick={() => handleRoute('/')} ariaLabel="Logo, back to home">
            <Secondary>
              <div className={styles.logo}>〇 hic et nunc</div>
            </Secondary>
          </Button>

          <div className={styles.right}>
            <Button onClick={context.syncTaquito} secondary ariaLabel="Sync with wallet">
              <Secondary>sync</Secondary>
            </Button>

            <Button onClick={context.toogleNavbar} secondary ariaLabel="Toggle menu">
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
                    <li>○</li>
                    <li>
                      <Button onClick={() => handleRoute('/mint')} ariaLabel="Mint NFTs">
                        <Primary>
                          OBJKTs<i style={{ fontSize: '15px' }}>(mint NFTs)</i>
                        </Primary>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => handleRoute('/sync')} ariaLabel="Manage assets">
                        <Primary>manage assets</Primary>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => handleRoute('/about')} ariaLabel="About hic et nunc">
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
