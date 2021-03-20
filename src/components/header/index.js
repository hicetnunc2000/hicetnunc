import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Container, Padding } from '../layout'
import { Button, Primary, Secondary } from '../button'
import { fadeIn } from '../../utils/motion'
import { Menu } from '../icons'
import { getLanguage } from '../../constants'
import styles from './style.module.scss'

export const Header = () => {
  const history = useHistory()
  const context = useContext(HicetnuncContext)

  const language = getLanguage()
  console.log('language', language)

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
              <Secondary>{language.header.sync}</Secondary>
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
                    <li>○</li>
                    {language.header.menu.map((menu) => (
                      <li key={menu.route}>
                        <Button onClick={() => handleRoute(menu.route)}>
                          <Primary>
                            {menu.primary}
                            {menu.secondary && (
                              <i style={{ fontSize: '15px' }}>
                                {menu.secondary}
                              </i>
                            )}
                          </Primary>
                        </Button>
                      </li>
                    ))}
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
