import React, { useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Container, Padding } from '../layout'
import { Button } from '../button'
import { fadeIn } from '../../utils/motion'
import styles from './style.module.scss'

export const Header = () => {
  const context = useContext(HicetnuncContext)

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <Button to="/" secondary>
            <div className={styles.logo}>〇 hic et nunc</div>
          </Button>

          <div className={styles.right}>
            <Button onClick={context.syncTaquito} secondary>
              sync
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
                      <Button to="/mint">
                        OBJKTs<i style={{ fontSize: '15px' }}>(mint NFTs)</i>
                      </Button>
                    </li>
                    <li>
                      <Button to="/sync">manage assets</Button>
                    </li>
                    <li>
                      <Button to="/about">about</Button>
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
