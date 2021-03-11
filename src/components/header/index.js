import React, { useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Container, Padding } from '../layout'
import { Button, Primary, Secondary } from '../button'
import { fadeIn } from '../../utils/motion'
import styles from './style.module.scss'
import { useHistory } from 'react-router'

export const Header = () => {
  const context = useContext(HicetnuncContext)
  const history = useHistory()

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
              <Secondary>sync</Secondary>
            </Button>

            <Button onClick={context.toogleNavbar} secondary>
              <img
                src={require('../../media/menu-black-18dp.svg')}
                alt=""
                className={styles.hamburger}
              />
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
